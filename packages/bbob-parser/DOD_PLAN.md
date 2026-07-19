# bbob-parser — Data-Oriented Design plan (after Yuku / arshad.fyi)

Source: https://www.arshad.fyi/writings/engineering-high-performance-parsers
Yuku is a JS/TS parser in **Zig**, 3–10× faster than npm alternatives. Its thesis:
*the grammar is not the bottleneck — the in-memory shape of a node is.*

---

## Part 1 — Recap of the article's optimizations

| # | Technique | Problem it solves | How |
|---|---|---|---|
| 1 | **Indices, not pointers** | Pointer-chasing = cache misses (~100ns each); 8B pointer often bigger than payload | Every child edge is a `u32` index into one flat `nodes` array. `maxInt(u32)` is the reserved "null" so optional children are free |
| 2 | **Struct-of-Arrays (SoA)** | Traversals touching one field drag whole structs through cache | `MultiArrayList` splits `Node{data, span}` into a `data` column and a `span` column, same index into both. Walkers that only need tags never load spans |
| 3 | **Fixed, asserted node size** | One fat variant silently bloats all 50k nodes | `comptime assert(@sizeOf(Node) == 52)`. Invariant is a compile-time check, cannot regress |
| 4 | **Arena allocation** | 50k mallocs + 50k frees per file | One arena owns everything; `arena.deinit()` frees the whole tree in one call |
| 5 | **Variadic children in one shared `extras` array** | Sizing every node for the worst case, or a growable list per block | Owning node stores an 8-byte `IndexRange{start, len}`; actual child indices live in one global `extras` array |
| 6 | **Scratch buffer used as a stack (checkpoint/reset)** | Parser doesn't know a block's child count until the closing brace | One reusable buffer. Each call records `checkpoint = len`, appends, bulk-copies into `extras`, then `shrinkRetainingCapacity(checkpoint)`. Nests naturally through recursion. Grows a few times per *parse*, not per *block* |
| 7 | **Strings are offsets (zero-copy)** | Copying every identifier into its own allocation | A string is `{start, end}`. If `start < source.len` it's a **slice of the source, zero copy**. Above that, it indexes a small interned side-pool (deduped by a content hash map) for the rare exceptions |
| 8 | **Lazy decoding — lexer refuses to do work up front** | Paying escape-decoding cost for every token when almost none need it | Lexer only records a span + sets an `isEscaped` flag. Decoding happens at the moment the name is needed, only for the rare escaped token |
| 9 | **Reserve from an estimate** | Repeated array growth/realloc | Budget ~1 node per 2 source bytes, preallocate up front |
| 10 | **Tree is its own wire format** | JSON serialize + `JSON.parse` costs more than the parse did | Because there are zero pointers, the tree is already position-independent bytes → serialization is a `memcpy` into an `ArrayBuffer`. Fixed 48-byte `PackedNode` records, layout derived at compile time from struct decls so encoder/decoder can't drift |
| 11 | **Never let the common case pay for the general one** | — | ASCII before unicode tables; source slices before interning; spans before decoding |

**The generalizable core:** choose the representation from the access pattern; indices over pointers; amortize (reserve, reuse scratch, batch); keep the common case cheap; make invariants machine-checked.

---

## Part 2 — What actually transfers to bbob (JS/TS)

Honest translation. Several of these are Zig-specific and become no-ops or *pessimizations* in JS.

### Transfers well ✅
- **#6 scratch buffer / checkpoint-reset** → pure JS win. Kills per-tag/per-node array allocation.
- **#7 strings are offsets** → big win. bbob currently `substring()`s every word/tag/attr. V8 sliced strings help, but we still allocate a string object per token.
- **#8 lazy decoding** → bbob eagerly builds values in `Token`; several are never read.
- **#9 reserve from estimate** → already partly done (token array), extend to node lists.
- **#11 common case first** → already the theme of the char-code work already landed.
- **#1/#2 indices + SoA** → viable *via typed arrays* (`Int32Array` columns for token type/start/end/line/col). Real, measurable in JS.

### Transfers poorly / not at all ❌
- **#4 arena** — no manual allocator in JS. GC is the arena. Nothing to do.
- **#3 comptime size assert** — no equivalent; a test asserting `Object.keys().length` is theatre.
- **#10 wire format** — only relevant for a native↔JS boundary. bbob is pure JS. Skip.
- **Full SoA for the *output AST*** — see the blocker below.

### ⚠️ The blocker you must decide first
**bbob's public API *is* the pointer tree.** `parse()` returns `TagNode` objects that every plugin and the renderer walk directly (`node.tag`, `node.attrs`, `node.content`). Yuku can use flat arrays because its output is an opaque `ArrayBuffer` decoded on demand.

So #1/#2 can only be applied to bbob in one of three ways:

- **(A) Internal-only.** Flat/typed-array representation *inside* lexing + parsing, materialized into `TagNode[]` at the end. Zero API change. Gains limited to the build phase — but that's exactly the phase we're optimizing.
- **(B) Lazy materialization.** Return a proxy/lazy tree that decodes `TagNode`s on first access. Big potential win for `onlyAllowTags`/partial traversals, but a real behavioral-compatibility risk (identity, spread, `JSON.stringify`, `Array.isArray`).
- **(C) Full flat AST as a new opt-in API.** `parseFlat()` alongside `parse()`. Largest payoff, largest surface.

**Recommendation: (A) now, evaluate (B) later with real numbers.** (C) is a different product, not an optimization.

---

## Part 3 — Implementation plan

Prerequisite: **fix the benchmark first.** Current harness variance is ±15%, which exceeds every remaining gain. Nothing below is worth doing blind.

### Phase A — Trustworthy measurement (do first, blocks everything)
- Move bench out of jest into a standalone Node process (`tinybench` or hand-rolled with `--allow-natives-syntax` optional).
- Warmup to steady state, report median + MAD, not best-of-N.
- Add a memory/allocation counter (`process.memoryUsage()` delta, or `--trace-gc` scrape) — most changes below target allocations, and ops/sec alone will hide the win.
- **Gate:** re-measure the current HEAD; establish a baseline with <5% run-to-run spread.

### Phase B — Strings are offsets (article #7 + #8) — highest ROI
Today `Token` stores `v: string`, built via `substring()` for every word, tag, attr name and attr value.
- Store `start`/`end` only (already present as `s`/`e`), make `v` a **lazy getter** that slices the buffer on first read and memoizes.
- Keep an `escaped` flag; only run `unquote`/escape handling when set.
- Risk: `Token` is currently a plain-ish class with `readonly v`. Adding a getter changes shape — must confirm V8 doesn't deopt the monomorphic call sites. **Measure, don't assume.**
- Expected: kills one string allocation per token; big on prose-heavy input.

### Phase C — Scratch buffer for node lists (article #6)
`parse.ts` uses `NodeList` + per-tag `content` arrays; every tag allocates a growable array.
- One parser-owned scratch array used as a stack with `begin()`/`reset(checkpoint)`.
- Bulk-copy into the final `content` array once the close tag is seen, at exact length.
- Nests through the existing `nestedNodes` recursion the same way the article describes.
- Expected: fewer array allocations + correctly-sized final arrays (no growth doubling).

### Phase D — Reserve from estimate (article #9)
- Heuristic-size the scratch buffers and `content` arrays from `input.length` instead of growing from empty.
- Cheap, low risk, small win. Bundle with C.

### Phase E — Typed-array token columns (article #1/#2, internal only)
- Replace `Token[]` with SoA columns: `Int32Array` for type/start/end/line/col, plus the lazy string accessor from Phase B.
- Token objects become a *view* materialized only where the public `createTokenizer` option exposes them.
- **This is the largest change and the one most likely to be a wash in JS.** Do it last, only if A–D leave headroom, and be prepared to revert.

### Phase F — Re-evaluate lazy AST (option B)
Only after A–E, only with the good benchmark, only if numbers justify the compatibility risk.

---

## Guardrails (unchanged)
- All 90 parser tests green after every phase; `tsc --noEmit` clean.
- No change to `parse()`'s public output shape in phases A–E.
- Every phase reports before/after from the Phase A harness. **No phase lands on a hunch.**

## Honest expectation
Phases B–D are real but incremental — think 10–30%, not 3×. The 3–10× in the article comes from Zig-vs-JS and from controlling memory layout directly, which JS mostly denies us. The already-landed char-code + `String()` work captured the cheap 2–6×. What's left here is allocation pressure, and the ceiling is lower.

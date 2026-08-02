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
- ~~Add a memory/allocation counter~~ — **attempted twice, dropped.** `heapUsed`
  deltas measure GC timing, not allocation; V8's sampling heap profiler is
  proportional but ~200× low because it reports *retained* sampled objects.
  Both produced numbers that contradicted throughput. See the note in `run.mjs`.
  Throughput at ±1% spread decides every change here; a misleading number is
  worse than an absent one.
- **Gate:** re-measure the current HEAD; establish a baseline with <5% run-to-run spread.

**Done.** Spread ±15% → ±1.5%. Note jest was also *inflating absolute cost*: several
parse figures came in well above what the old harness reported, so the absolute
ops/sec in `PERF_PLAN.md` are overstated (the relative gains there still hold).

### Phase B — Strings are offsets (article #7 + #8) — ⛔ BLOCKED, superseded

**The premise was wrong.** Checked before implementing: only `TYPE_TAG` tokens carry
spans (`lexer.ts:200,253`). Every other `emitToken` passes `startPos`/`endPos` as
`undefined`, and attribute values are *transformed* by `unq()` — so value ≠ source
slice. Lazy slicing needs accurate spans on every token first, which is a much
larger and riskier change than this phase assumed. Deferred; revisit only with a
concrete plan for span-accurate `emitToken` calls.

**Shipped instead (same article principle, #11 — common case never pays for the
general one):**
- `isTokenNested` built a `[/name]` string on *every* tag token just to key its
  cache. Key by the raw tag name; build the bracketed form only on a cache miss.
- `unquote` concatenated `BACKSLASH + QUOTEMARK` per call and always entered
  `replace()`. Hoist the constant; `indexOf` guard first.
- `unq` skips `trimChar` + `unquote` entirely when the value has no quotemark.

Result: **+5.6–30.6% lexer, +1.5–20.3% parse** (prose parse at +1.5% is within
noise; the rest are well clear of the ±1.5% spread).

### Phase B (original, for reference) — lazy Token values
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

### Phase D — Reserve from estimate (article #9) — ❌ TESTED, REJECTED

Measured token density first, and the premise does not hold for BBCode:

| fixture | chars | tokens | chars/token |
|---------|------:|-------:|------------:|
| tagDense | 14200 | 3200 | 4.44 |
| attrs | 15200 | 1000 | **15.20** |
| prose | 26200 | 8000 | 3.27 |
| nested | 8000 | 2400 | 3.33 |
| codeFree | 11600 | 5400 | **2.15** |

A 7× spread, so no single estimate fits. The article's "one node per two source
bytes" is a property of JS source, not of BBCode.

Tried `new Array(buffer.length / N)` for N = 2, 4, 8 anyway. **Every variant was
at or below the growable `[]` baseline on every fixture** (growable:
+23.2/+9.1/+4.4/+28.2/+5.1; best prealloc: +20.1/+5.6/+1.2/+26.2/+5.4).

Mechanism: `new Array(n)` produces a HOLEY_ELEMENTS array in V8, whereas
appending to `[]` keeps it PACKED_ELEMENTS, which has cheaper element access.
The geometric growth V8 already does costs less than the holey penalty. This
also independently reproduces the earlier Phase 4 result, which moved *away*
from `new Array(buffer.length)` for the same reason.

Reserve-from-estimate is a real win in a language where you control the
allocation. In V8 it fights the engine's element-kind optimisation. Not pursued.

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

## Outcome (after A–D)

| fixture | LEXER | PARSE |
|---------|------:|------:|
| tagDense | +23.2% | +25.2% |
| attrs | +9.1% | +13.3% |
| prose | +4.4% | +7.7% |
| nested | +28.2% | +22.1% |
| codeFree | +5.1% | **+48.2%** |

**Every win came from deleting work that did not need doing — none from memory
layout.** The article's headline techniques are exactly the ones that do not
survive the trip to JS (no allocator control, no struct layout, and V8's element
kinds actively punish manual preallocation). Its most throwaway line, #11
"never let the common case pay for the general one", paid on all three
successful phases.

**Phase E (typed-array token columns) is therefore not recommended.** It is the
most invasive remaining change and rests on the part of the article that has
transferred worst. Phase F (lazy AST) is unchanged: possible, but a
compatibility risk that needs its own justification.

The remaining headroom is likely in the same #11 shape — find work being done
unconditionally that only a rare input needs.

## Honest expectation (written before A–D; kept for the record)
Phases B–D are real but incremental — think 10–30%, not 3×. The 3–10× in the article comes from Zig-vs-JS and from controlling memory layout directly, which JS mostly denies us. The already-landed char-code + `String()` work captured the cheap 2–6×. What's left here is allocation pressure, and the ceiling is lower.

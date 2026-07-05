# bbob-parser — Lexer/Parser Speedup Plan

Scope: `src/lexer.ts`, `src/utils.ts` (CharGrabber), `src/Token.ts`, `src/parse.ts`.
Goal: cut allocations + redundant scans in the hot path. No public-API/output change; all
existing tests (`lexer.test.ts`, `parse.test.ts`) must stay green as the guardrail.

## Where time goes now (hotspots)

1. **String-char comparisons everywhere.** Every predicate compares single-char *strings*
   (`char === SPACE`, Set.has(char)). `CharGrabber.getCurr/getNext/getPrev` return `this.s[pos]`,
   allocating a 1-char string per access. This dominates lexing.
2. **Per-char `onSkip` callback** (`utils.ts:80`, `col++`) — a function call for *every* character
   consumed by `grabWhile`, only to maintain `col`.
3. **Double/triple scanning in `stateTag`** (`lexer.ts:208-234`): `substrUntilChar(closeTag)` builds
   a substring, then `indexOf(openTag)`, `indexOf(SPACE)`, `indexOf(EQ)`, then `grabWhile` re-walks
   the same span. 3–4 passes over each tag.
4. **`stateAttrs` per-tag allocations** (`lexer.ts:244-264`): a *new* `CharGrabber` (`tagGrabber`)
   plus `tagStr.split(EQ)` array, plus fresh predicate closures (`validAttrName`, `validAttrValue`,
   `validName`, `isChar`) recreated on every tag.
5. **Over-allocation**: `new Array<Token>(Math.floor(buffer.length))` (`lexer.ts:52`) reserves one
   slot per *character*; real token count is far smaller. Wasted memory + `Math.floor` is a no-op.
6. **`isTokenNested`**: `buffer.indexOf(value)` (and a full `buffer.toLowerCase()` when
   `caseFreeTags`) per unique tag. Cached, but still a full-buffer scan on first sight of each tag.
7. **Token/parse micro-costs**: `String(value)` in ctor, repeated `typeof token[VALUE_ID]` guards,
   `isTagEnd` via `charCodeAt(0)` is already good.

## Plan (ordered by ROI / risk)

### Baseline (jest harness, `test/bench.test.ts`, machine-specific)
```
LEXER tokenize   tagDense 933  attrs 499  prose 378  nested 1005  codeFree 734  ops/sec
PARSE full       tagDense 600  attrs 454  prose 234  nested  744  codeFree 395  ops/sec
```

### Phase 0 — Benchmark harness (do first, gate everything on it)  ✅ DONE
- Add `bench/lexer.bench.ts` using representative fixtures: small tag-dense string, large paragraph,
  deeply nested, attribute-heavy, contextFreeTag (`[code]`). Measure `tokenize()` and full `parse()`
  ops/sec (tinybench or a simple hrtime loop; repo already lists a `benchmark` workspace).
- Record baseline numbers in this file. **Every later phase reports before/after.**

### Phase 1 — Char codes instead of char strings (biggest win, low risk)  ✅ DONE
Results (ops/sec, baseline → phase1):
```
LEXER  tagDense 933→1509 (+62%)  prose 378→955 (+153%)  nested 1005→1440 (+43%)  codeFree 734→1510 (+106%)  attrs 499→529 (+6%)
PARSE  tagDense 600→819  (+37%)  prose 234→379 (+62%)   nested  744→960 (+29%)  codeFree 395→551 (+39%)   attrs 454→479 (+6%)
```
`attrs` barely moved — attribute internals (nextTagState + per-tag CharGrabber) still string-based → Phase 3.

- Convert constants to codes once: `const CC_OPEN = openTag.charCodeAt(0)` etc. (guard: `openTag`
  may be multi-char when overridden — keep a `openTagLen` fast path, fall back to string compare
  when len > 1).
- Add `CharGrabber.codeAt(pos)` / `currCode()` / `nextCode()` returning `number` (`charCodeAt`, no
  string alloc). Rewrite predicates (`isWhiteSpace`, `isNewLine`, `isSpecialChar`, `isCharReserved`,
  `isCharToken`, `isEscapableChar`) to take a code and compare numbers; replace the
  `RESERVED_CHARS_SET` Set with a numeric switch/range check.
- Keep the string-returning methods for value extraction (`grabWhile` still returns a substring).

### Phase 2 — Kill per-char `onSkip`; derive column from position
- Track `lineStart` (buffer index where current row began). `col = pos - lineStart`. Update `row` +
  `lineStart` only on newline. Delete the `onSkip` callback and the `col++` per char.
- `prevCol`/`emitToken` compute start column from the token's start pos instead of mutated state.
  Verify against line/column assertions in `lexer.test.ts`.

### Phase 3 — Single-pass tag scanning
- In `stateTag`, scan the span `[pos .. closeIdx)` **once** with `indexOf(closeTag)` giving `closeIdx`,
  and derive `hasOpen` / `hasSpace` / `hasEq` during that single find (or cheap `indexOf` bounded by
  `closeIdx`), then slice the name directly — drop the separate `grabWhile` re-walk.
- In `stateAttrs`, avoid the second `CharGrabber`: iterate attrs over the already-known
  `[startPos..closeIdx)` window of the main buffer. Replace `tagStr.split(EQ)` with an `indexOf(EQ)`
  bounded to the tag window (only the first `=` and presence of space are actually needed).
- Hoist the predicate closures (`validAttrName`, etc.) to module scope or make them code-based
  functions that don't capture per-tag state.

### Phase 4 — Right-size token storage
- Replace `new Array(buffer.length)` with a growable array (start small, `push`; V8 handles growth
  well) **or** size to a heuristic (`buffer.length / 8`). Drop `Math.floor`. Bench both.

### Phase 5 — Token/parse micro-opts (only if bench shows headroom)
- Skip `String(value)` when already a string (lexer always passes strings).
- Cache `token.getValue()` results reused within a single `onToken`/`nodeHandle` call.
- `isTokenNested` (lexer): search only up to first candidate rather than whole buffer where possible;
  keep the `nestedMap` cache. Consider building `lowercaseBuffer` lazily only once (already lazy).

## Guardrails
- Run `pnpm --filter @bbob/bbob-parser test` after every phase — behavior must be identical.
- Watch multi-char `openTag`/`closeTag` overrides and `caseFreeTags`/`contextFreeTags`/`enableEscapeTags`
  paths (issue-315 case-insensitive close tag lives in `stateWord`, `lexer.ts:288-291`).
- Keep changes internal to these 4 files; no `@bbob/types` signature changes.

## Results (baseline → final, ops/sec, higher = better)

| fixture  | LEXER base | LEXER now | Δ      | PARSE base | PARSE now | Δ      |
|----------|-----------:|----------:|--------|-----------:|----------:|--------|
| tagDense | 933        | 2700      | +189%  | 600        | 1200      | +100%  |
| attrs    | 499        | 2960      | +493%  | 454        | 2110      | +365%  |
| prose    | 378        | 2050      | +442%  | 234        | 820       | +250%  |
| nested   | 1005       | 2250      | +124%  | 744        | 1280      | +72%   |
| codeFree | 734        | 3180      | +333%  | 395        | 725       | +84%   |

All 90 existing parser tests stay green; `tsc --noEmit` clean.

Phases done: 0 (harness), 1 (char codes), 2 (batched onSkip), 3 (attr internals →
codes), 4 (right-size token array), 5 (lazy `isTagNested` in parse.ts),
6 (single-pass `stateTag` via `substr` reuse + `advance()`; short-circuit
`whitespaceInTags` scan), 7 (**`Token` ctor: skip `String()` coercion for the
already-string common case — the single biggest win; V8 could not inline the global
`String` call in this per-token hot path**).

Not done (lower ROI / higher risk): positional column tracking to delete `onSkip`
entirely; single-pass `stateAttrs` (still allocs a second CharGrabber + `split(EQ)`);
`getNodesContent` per-token cost in parse.ts (caches nothing across flat text).

## Expected payoff
Phases 1–3 target the per-character inner loop and per-tag allocations — the bulk of cost. Rough
expectation: meaningful reduction in GC pressure and a solid throughput gain on tag-dense input,
confirmed by the Phase 0 harness rather than assumed.

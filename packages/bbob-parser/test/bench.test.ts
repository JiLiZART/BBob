/* eslint-disable no-console */
/**
 * Micro-benchmark harness for lexer + parser.
 * Not a real test — gated behind BENCH=1 so it never runs in CI.
 *
 *   BENCH=1 npx jest --config packages/bbob-parser/jest.config.js --coverage=false bench
 *
 * Reports ops/sec (higher = better). Same harness across commits => valid
 * relative before/after comparison. Absolute numbers are machine-specific.
 */
import { createLexer } from '../src/lexer';
import { parse } from '../src/parse';

// Realistic tag-dense fixture (chord sheet), repeated to get a stable signal.
const CHORD = '[ch]Eb[/ch]           [ch]Fm[/ch]\n[ch]Ab[/ch]              [ch]Cm[/ch]\n';
const tagDense = CHORD.repeat(200);

// Attribute-heavy fixture.
const attrs = '[url=https://example.com/page?x=1 target="_blank" rel="noopener"]link[/url] '.repeat(200);

// Plain prose with sparse tags.
const prose = ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
  + 'Sed do [b]eiusmod[/b] tempor incididunt ut labore et dolore magna aliqua. ').repeat(200);

// Deeply nested.
const nested = '[a][b][c][d][e]deep[/e][/d][/c][/b][/a] '.repeat(200);

// contextFreeTags path.
const codeBlocks = '[code]if (a[0] < b[1]) { return [x]; }[/code] normal text '.repeat(200);

const FIXTURES: Array<{ name: string; input: string; opts?: any }> = [
  { name: 'tagDense', input: tagDense, opts: { onlyAllowTags: ['ch'] } },
  { name: 'attrs', input: attrs },
  { name: 'prose', input: prose },
  { name: 'nested', input: nested },
  { name: 'codeFree', input: codeBlocks, opts: { contextFreeTags: ['code'] } },
];

function timeIt(label: string, fn: () => void) {
  // Warmup
  for (let i = 0; i < 50; i++) fn();
  const runs = 5;
  const iters = 300;
  let best = Infinity;
  for (let r = 0; r < runs; r++) {
    const t0 = performance.now();
    for (let i = 0; i < iters; i++) fn();
    const dt = performance.now() - t0;
    if (dt < best) best = dt;
  }
  const opsSec = (iters / best) * 1000;
  console.log(`${label.padEnd(22)} ${opsSec.toFixed(0).padStart(9)} ops/sec  (${(best / iters).toFixed(4)} ms/op)`);
  return opsSec;
}

const maybe = process.env.BENCH ? describe : describe.skip;

maybe('benchmark', () => {
  it('lexer.tokenize', () => {
    console.log('\n=== LEXER (tokenize) ===');
    for (const f of FIXTURES) {
      timeIt(f.name, () => {
        createLexer(f.input, f.opts || {}).tokenize();
      });
    }
  });

  it('parse', () => {
    console.log('\n=== PARSE (full) ===');
    for (const f of FIXTURES) {
      timeIt(f.name, () => {
        parse(f.input, f.opts || {});
      });
    }
  });
});

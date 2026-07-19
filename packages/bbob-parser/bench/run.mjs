/* eslint-disable no-console */
/**
 * Standalone benchmark harness for @bbob/parser.
 *
 *   node --expose-gc packages/bbob-parser/bench/run.mjs
 *   node --expose-gc packages/bbob-parser/bench/run.mjs --save baseline.json
 *   node --expose-gc packages/bbob-parser/bench/run.mjs --compare baseline.json
 *
 * Why not jest: jest runs modules inside a sandboxed VM context with its own
 * module registry, which perturbs JIT behaviour and adds noise unrelated to the
 * code under test. This runs the compiled sources in a plain Node process.
 *
 * Methodology:
 *  - `src` is compiled once with swc into a temp dir, then imported.
 *  - Fixtures are **interleaved** across rounds, so machine-load drift spreads
 *    evenly over all fixtures instead of penalising whichever ran during a spike.
 *  - Reports the **median** ms/op plus MAD-based relative spread. Best-of-N
 *    flatters a noisy machine; the median plus a visible spread does not.
 *  - With --expose-gc, also reports bytes allocated per op. Most data-oriented
 *    changes target allocation, and ops/sec alone can hide that entirely.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { FIXTURES } from './fixtures.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(HERE, '..');
const REPO = resolve(PKG, '../..');

const argv = process.argv.slice(2);
const argOf = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
};
const savePath = argOf('--save');
const comparePath = argOf('--compare');

// Timing knobs. ROUNDS * ITERS iterations total per measurement.
const WARMUP = 100;
const ROUNDS = 15;
const ITERS = 200;

// ---------------------------------------------------------------------------
// Build: compile TS sources to CJS once, in a temp dir.
// ---------------------------------------------------------------------------

function build() {
  // Must live inside the package: the compiled output does `require('@bbob/plugin-helper')`,
  // and Node only resolves that by walking up to the workspace node_modules.
  const out = join(PKG, '.bench-build');
  mkdirSync(out, { recursive: true });
  // swc needs an explicit config; the repo's .swcrc is tuned for the package
  // build pipeline, so use a minimal one targeting modern Node.
  const swcrc = join(out, '.swcrc');
  writeFileSync(swcrc, JSON.stringify({
    jsc: {
      parser: { syntax: 'typescript' },
      target: 'es2022',
    },
    module: { type: 'commonjs' },
  }));

  // swc must be invoked with a *relative* source dir from the package root:
  // given an absolute path it silently emits nothing.
  execFileSync(
    join(REPO, 'node_modules/.bin/swc'),
    ['src', '-d', out, '--config-file', swcrc, '--quiet'],
    { stdio: 'inherit', cwd: PKG },
  );

  // swc emits into <out>/ mirroring the input dir name.
  const candidates = [join(out, 'parse.js'), join(out, 'src/parse.js')];
  const parseJs = candidates.find((p) => existsSync(p));
  if (!parseJs) {
    throw new Error(`swc output not found. Looked in:\n  ${candidates.join('\n  ')}`);
  }
  return dirname(parseJs);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Median absolute deviation — robust to the outliers a loaded machine produces. */
const mad = (xs) => {
  const m = median(xs);
  return median(xs.map((x) => Math.abs(x - m)));
};

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

/**
 * Runs every fixture's `fn` interleaved across rounds.
 * Returns { [name]: { msPerOp, spreadPct, bytesPerOp } }.
 */
function measure(jobs) {
  for (const job of jobs) {
    for (let i = 0; i < WARMUP; i++) job.fn();
  }

  const samples = new Map(jobs.map((j) => [j.name, []]));

  for (let round = 0; round < ROUNDS; round++) {
    for (const job of jobs) {
      const t0 = performance.now();
      for (let i = 0; i < ITERS; i++) job.fn();
      const dt = performance.now() - t0;
      samples.get(job.name).push(dt / ITERS);
    }
  }

  const results = {};
  for (const job of jobs) {
    const xs = samples.get(job.name);
    const m = median(xs);
    results[job.name] = {
      msPerOp: m,
      opsSec: 1000 / m,
      // MAD as a percentage of the median: a stability readout, not an error bar.
      spreadPct: (mad(xs) / m) * 100,
      bytesPerOp: measureAlloc(job.fn),
    };
  }
  return results;
}

/** Bytes allocated per op, or null when run without --expose-gc. */
function measureAlloc(fn) {
  if (typeof globalThis.gc !== 'function') return null;
  const N = 200;
  globalThis.gc();
  const before = process.memoryUsage().heapUsed;
  for (let i = 0; i < N; i++) fn();
  const after = process.memoryUsage().heapUsed;
  return Math.max(0, after - before) / N;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const fmtBytes = (b) => {
  if (b == null) return '     n/a';
  if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(2)} MB`;
  if (b > 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${b.toFixed(0)} B`;
};

function report(title, results, baseline) {
  console.log(`\n=== ${title} ===`);
  console.log(
    `${'fixture'.padEnd(12)}${'ops/sec'.padStart(10)}${'spread'.padStart(9)}`
    + `${'alloc/op'.padStart(11)}${baseline ? 'vs base'.padStart(10) : ''}`,
  );
  for (const [name, r] of Object.entries(results)) {
    let delta = '';
    if (baseline?.[name]) {
      const pct = ((r.opsSec / baseline[name].opsSec) - 1) * 100;
      delta = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`.padStart(10);
    }
    console.log(
      name.padEnd(12)
      + r.opsSec.toFixed(0).padStart(10)
      + `±${r.spreadPct.toFixed(1)}%`.padStart(9)
      + fmtBytes(r.bytesPerOp).padStart(11)
      + delta,
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const outDir = build();
// The build emits CommonJS; require() gives reliable named exports, whereas
// ESM interop on swc output can hide them behind `default`.
const require = createRequire(import.meta.url);
const { createLexer } = require(join(outDir, 'lexer.js'));
const { parse } = require(join(outDir, 'parse.js'));

if (typeof globalThis.gc !== 'function') {
  console.log('note: run with --expose-gc to get allocation numbers');
}

const lexJobs = FIXTURES.map((f) => ({
  name: f.name,
  fn: () => createLexer(f.input, f.opts).tokenize(),
}));
const parseJobs = FIXTURES.map((f) => ({
  name: f.name,
  fn: () => parse(f.input, f.opts),
}));

const baseline = comparePath && existsSync(comparePath)
  ? JSON.parse(readFileSync(comparePath, 'utf8'))
  : null;

const lexer = measure(lexJobs);
const parser = measure(parseJobs);

report('LEXER (tokenize)', lexer, baseline?.lexer);
report('PARSE (full)', parser, baseline?.parser);

const worst = Math.max(
  ...Object.values(lexer).map((r) => r.spreadPct),
  ...Object.values(parser).map((r) => r.spreadPct),
);
console.log(`\nworst spread: ±${worst.toFixed(1)}%  ${worst < 5 ? '(good — sub-5% changes are readable)' : '(NOISY — close other apps and re-run before trusting deltas)'}`);

if (savePath) {
  writeFileSync(savePath, JSON.stringify({ lexer, parser }, null, 2));
  console.log(`saved -> ${savePath}`);
}

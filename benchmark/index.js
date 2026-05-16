/* eslint-disable global-require */
const Benchmark = require('benchmark');
const pico = require('picocolors');

const stub = require('./test/stub');

function formatNumber(number) {
  return String(number)
    // .replace(/\d{3}$/, ',$&')
    .replace(/^(\d|\d\d)(\d{3},)/, '$1,$2');
}

const suite = new Benchmark.Suite();

suite
  .add('regex/parser', () => require('./test/RegexParser').parse(stub, {
    ch: {
      closable: true,
    },
  }))
  .add('ya-bbcode', () => {
    const Yabbcode = require('ya-bbcode');
    const parser = new Yabbcode();

    parser.clearTags();
    parser.registerTag('ch', {
      type: 'replace',
      open: () => '<div>',
      close: () => '</div>',
    });

    return parser.parse(stub);
  })
  .add('xbbcode/parser', () => {
    const xbbcode = require('xbbcode-parser');
    xbbcode.addTags({
      ch: {
        openTag: () => '<div>',
        closeTag: () => '</div>',
        restrictChildrenTo: [],
      },
    });

    return xbbcode.process({
      text: stub,
      removeMisalignedTags: false,
      addInLineBreaks: false,
    });
  })
  .add('@bbob/parser', () => require('@bbob/parser').parse(stub, {
    onlyAllowTags: ['ch'],
  }))
  .add('js-bbcode-parser', () => {
    const BBCode = require('js-bbcode-parser/src/index').default;
    const parser = new BBCode({
      '\\[ch\\](.+?)\\[/ch\\]': '<strong>$1</strong>',
    });

    return parser.parse(stub);
  })
// add listeners
  .on('cycle', (event) => {
    const name = event.target.name.padEnd('00000000000000000000'.length);
    const hz = formatNumber(event.target.hz.toFixed(0)).padStart(10);

    process.stdout.write(`${name}${pico.bold(hz)}${pico.dim(' ops/sec')}\n`);
  })
  .on('complete', function onComplete() {
    const name = this.filter('fastest').map('name').toString();

    process.stdout.write(`Fastest is ${pico.bold(name)}`);
  })
// run async
  .run();

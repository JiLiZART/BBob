/* eslint-disable global-require */
const Benchmark = require('benchmark');
const stub = require('./test/stub');

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
  .add('@bbob/parser lexer old', () => {
    const lexer1 = require('../packages/bbob-parser/lib/lexer_old');

    return require('../packages/bbob-parser/lib/index').parse(stub, {
      onlyAllowTags: ['ch'],
      createTokenizer: lexer1.createLexer,
    });
  })
  .add('@bbob/parser lexer', () => {
    const lexer2 = require('../packages/bbob-parser/lib/lexer');

    return require('../packages/bbob-parser/lib/index').parse(stub, {
      onlyAllowTags: ['ch'],
      createTokenizer: lexer2.createLexer,
    });
  })
// add listeners
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
// run async
  .run({ async: false });

const Benchmark = require('benchmark');
const stub = require('./test/stub');

const suite = new Benchmark.Suite();

// add tests
suite
  .add('Regex Based Parser', () => {
    const RegexParser = require('./test/RegexParser');

    const result = RegexParser.parse(stub);
  })
  .add('xBBCode Parser', () => {
    const xbbcode = require('xbbcode-parser');
    xbbcode.addTags({
      ch: {
        openTag(params, content) {
          return '<div>';
        },
        closeTag(params, content) {
          return '</div>';
        },
        restrictChildrenTo: [],
      },
    });

    const result = xbbcode.process({
      text: stub,
      removeMisalignedTags: false,
      addInLineBreaks: false,
    });
  })
  .add('BBob Parser', () => {
    const parse = require('../packages/bbob-parser/lib/index').parse;

    const result = parse(stub);
  })
// add listeners
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
// run async
  .run({ async: true });

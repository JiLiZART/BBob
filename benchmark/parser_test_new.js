const parse = require('../packages/bbob-parser/lib/index');

const textStub = require('./test/stub');

const count = 0;
const parsers3 = [];

function test() {
  console.time('newParser');
  for (let i = 0; i <= count; i++) {
    const parser3 = parse(textStub);

    parsers3.push(parser3);
  }
  console.timeEnd('newParser');
}

test();
// console.log(JSON.stringify(parsers3));

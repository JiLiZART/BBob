/* eslint-disable global-require */

const parser = require('@bbob/parser');
const stub = require('./test/stub');

const passes = 100;
const results = new Array(passes);
const lexer = parser.createLexer;

// eslint-disable-next-line no-plusplus
for (let i = 0; i < passes; i++) {
  results[i] = parser.parse(stub, {
    onlyAllowTags: ['ch'],
    createTokenizer: lexer,
  });
}

console.log(results.length);

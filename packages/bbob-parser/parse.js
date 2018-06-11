const Tokenizer = require('./Tokenizer');
const Parser = require('./Parser');

module.exports = function parse(input, options) {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens, options);
  const ast = parser.parse();

  return ast;
};

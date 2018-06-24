const Parser = require('./Parser');

module.exports = function parse(input, options) {
  const parser = new Parser(input, options);
  const ast = parser.parse();

  return ast;
};

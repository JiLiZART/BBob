const Parser = require('./Parser');
const TOKEN = require('./token');
const Tokenizer = require('./Tokenizer');

const parse = input => (new Parser(input).parse());
const tokenize = input => (new Tokenizer(input).tokenize());

describe('Parser', () => {
  test('parse paired tags tokens', () => {
    const input = [
      [TOKEN.TYPE_TAG, 'best'],
      [TOKEN.TYPE_ATTR_NAME, 'name'],
      [TOKEN.TYPE_ATTR_VALUE, 'value'],
      [TOKEN.TYPE_WORD, 'Foo'],
      [TOKEN.TYPE_SPACE, ' '],
      [TOKEN.TYPE_WORD, 'Bar'],
      [TOKEN.TYPE_TAG, '/best'],
    ];

    const ast = parse(input);

    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual([
      {
        tag: 'best',
        attrs: {
          name: 'value',
        },
        content: [
          'Foo',
          ' ',
          'Bar',
        ],
      },
    ]);
  });

  test('parse tag with value param', () => {
    const tokens = tokenize('[url=https://github.com/jilizart/bbob]BBob[/url]');
    const ast = parse(tokens);

    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual([
      {
        tag: 'url',
        attrs: {
          url: 'https://github.com/jilizart/bbob',
        },
        content: ['BBob'],
      },
    ]);
  });
});

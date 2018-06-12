const Parser = require('./Parser');
const TOKEN = require('./token');

const parse = input => (new Parser(input).parse());

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
});

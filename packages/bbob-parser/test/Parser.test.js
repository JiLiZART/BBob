const Parser = require('../lib/Parser');

const parse = input => (new Parser(input).parse());

describe('Parser', () => {
  test('parse paired tags tokens', () => {
    const ast = parse('[best name=value]Foo Bar[/best]');

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
    const ast = parse('[url=https://github.com/jilizart/bbob]BBob[/url]');

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

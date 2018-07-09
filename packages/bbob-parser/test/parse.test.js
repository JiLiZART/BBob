const parse = require('../lib/parse');

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

  test('parse tag with quoted param with spaces', () => {
    const ast = parse('[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]');

    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual([
      {
        tag: 'url',
        attrs: {
          href: 'https://ru.wikipedia.org',
          target: '_blank',
          text: 'Foo Bar',
        },
        content: ['Text'],
      },
    ]);
  });
});

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

  test('parse only allowed tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] [/h1]', {
      onlyAllowTags: ['h1']
    });

    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual([
      {
        tag: 'h1',
        attrs: {
          name: 'value',
        },
        content: [
          'Foo',
          ' ',
          '[Bar]',
          ' '
        ],
      },
    ]);
  });

  test('parse inconsistent tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] /h1]');

    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual(
      [
        {
          attrs: {},
          tag: 'h1',
          content: []
        },
        'Foo',
        ' ',
        {
          tag: 'Bar',
          attrs: {},
          content: []
        },
        ' ',
        '/h1',
      ]
    );
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

  test('detect inconsistent tag', () => {
    const onError = jest.fn();
    const ast = parse('[c][/c][b]hello[/c][/b][b]', { onError });

    expect(onError).toHaveBeenCalled();
  })
});

import { parse } from '../src'

describe('Parser', () => {
  const expectOutput = (ast, output) => {
    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual(output);
  };

  test('parse paired tags tokens', () => {
    const ast = parse('[best name=value]Foo Bar[/best]');

    expectOutput(ast, [
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

    expectOutput(ast, [
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

    expectOutput(ast, [
      {
        attrs: {
          name: 'value'
        },
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
      '/h1]',
    ]);
  });

  test('parse tag with value param', () => {
    const ast = parse('[url=https://github.com/jilizart/bbob]BBob[/url]');

    expectOutput(ast, [
      {
        tag: 'url',
        attrs: {
          'https://github.com/jilizart/bbob': 'https://github.com/jilizart/bbob',
        },
        content: ['BBob'],
      },
    ]);
  });

  test('parse tag with quoted param with spaces', () => {
    const ast = parse('[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]');

    expectOutput(ast, [
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

  test('parse single tag with params', () => {
    const ast = parse('[url=https://github.com/jilizart/bbob]');

    expectOutput(ast, [
      {
        tag: 'url',
        attrs: {
          'https://github.com/jilizart/bbob': 'https://github.com/jilizart/bbob',
        },
        content: [],
      },
    ]);
  });

  test('detect inconsistent tag', () => {
    const onError = jest.fn();
    const ast = parse('[c][/c][b]hello[/c][/b][b]', { onError });

    expect(onError).toHaveBeenCalled();
  });

  describe('html', () => {
    const parseHTML = input => parse(input, { openTag: '<', closeTag: '>' });

    test('normal attributes', () => {
      const content = `<button id="test0" class="value0" title="value1">class="value0" title="value1"</button>`;
      const ast = parseHTML(content);

      expectOutput(ast, [
        {
          "tag": "button",
          "attrs": {
            "id": "test0",
            "class": "value0",
            "title": "value1"
          },
          "content": [
            "class=\"value0\"",
            " ",
            "title=\"value1\""
          ]
        }
      ]);
    });

    test('attributes with no quotes or value', () => {
      const content = `<button id="test1" class=value2 disabled required>class=value2 disabled</button>`;
      const ast = parseHTML(content);

      expectOutput(ast, [
        {
          "tag": "button",
          "attrs": {
            "id": "test1",
            "class": "value2",
            "disabled": "disabled",
            "required": "required"
          },
          "content": [
            "class=value2",
            " ",
            "disabled"
          ]
        }
      ]);
    });

    test('attributes with no space between them. no valid, but accepted by the browser', () => {
      const content = `<button id="test2" class="value4"title="value5">class="value4"title="value5"</button>`;
      const ast = parseHTML(content);

      expectOutput(ast, [
        {
          "tag": "button",
          "attrs": {
            "id": "test2",
            "class": "value4",
            "title": "value5"
          },
          "content": [
            "class=\"value4\"title=\"value5\""
          ]
        }
      ]);
    });

    test('parse escaped tags', () => {
      const ast = parse('\\[b\\]test\\[/b\\]', {
        enableEscapeTags: true
      });

      expectOutput(ast, [
        '[',
        'b',
        ']',
        'test',
        '[',
        '/b',
        ']',
      ]);
    });

    test('parse escaped tags and escaped backslash', () => {
      const ast = parse('\\\\\\[b\\\\\\]test\\\\\\[/b\\\\\\]', {
        enableEscapeTags: true
      });

      expectOutput(ast, [
        '\\',
        '[',
        'b',
        '\\',
        ']',
        'test',
        '\\',
        '[',
        '/b',
        '\\',
        ']',
      ]);
    });
  });
});

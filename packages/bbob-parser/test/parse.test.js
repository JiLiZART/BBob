import { parse } from '../src'

describe('Parser', () => {
  const expectOutput = (ast, output) => {
    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual(output);
  };

  test('parse paired tags tokens', () => {
    const ast = parse('[best name=value]Foo Bar[/best]');
    const output = [
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
    ];

    expectOutput(ast, output);
  });

  test('parse only allowed tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] [/h1]', {
      onlyAllowTags: ['h1']
    });
    const output = [
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
    ];

    expectOutput(ast, output);
  });

  test('parse inconsistent tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] /h1]');
    const output = [
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
        tag: 'bar',
        attrs: {},
        content: []
      },
      ' ',
      '/h1]',
    ];

    expectOutput(ast, output);
  });

  test('parse tag with value param', () => {
    const ast = parse('[url=https://github.com/jilizart/bbob]BBob[/url]');
    const output = [
      {
        tag: 'url',
        attrs: {
          'https://github.com/jilizart/bbob': 'https://github.com/jilizart/bbob',
        },
        content: ['BBob'],
      },
    ];

    expectOutput(ast, output);
  });

  test('parse tag with quoted param with spaces', () => {
    const ast = parse('[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]');
    const output = [
      {
        tag: 'url',
        attrs: {
          href: 'https://ru.wikipedia.org',
          target: '_blank',
          text: 'Foo Bar',
        },
        content: ['Text'],
      },
    ];

    expectOutput(ast, output);
  });

  test('parse single tag with params', () => {
    const ast = parse('[url=https://github.com/jilizart/bbob]');
    const output = [
      {
        tag: 'url',
        attrs: {
          'https://github.com/jilizart/bbob': 'https://github.com/jilizart/bbob',
        },
        content: [],
      },
    ];

    expectOutput(ast, output);
  });

  test('detect inconsistent tag', () => {
    const onError = jest.fn();

    parse('[c][/c][b]hello[/c][/b][b]', { onError });

    expect(onError).toHaveBeenCalled();
  });

  test('parse only allowed tags with params', () => {
    const options = {
      onlyAllowTags: ['b', 'i', 'u']
    };
    const ast = parse('hello [blah foo="bar"]world[/blah]', options);

    expectOutput(ast, [
        'hello',
        ' ',
        '[blah foo="bar"]world[/blah]',
    ])
  });

  test('parse only allowed tags with named param', () => {
    const options = {
      onlyAllowTags: ['b', 'i', 'u']
    };
    const ast = parse('hello [blah="bar"]world[/blah]', options);

    expectOutput(ast, [
        'hello',
        ' ',
        '[blah="bar"]world[/blah]',
    ])
  });

  test('parse few tags without spaces', () => {
    const ast = parse('[mytag1 size="15"]Tag1[/mytag1][mytag2 size="16"]Tag2[/mytag2][mytag3]Tag3[/mytag3]');
    const output = [
      {
        tag: 'mytag1',
        attrs: {
          size: '15',
        },
        content: ['Tag1'],
      },
      {
        tag: 'mytag2',
        attrs: {
          size: '16',
        },
        content: ['Tag2'],
      },
      {
        tag: 'mytag3',
        attrs: {},
        content: ['Tag3'],
      },
    ];

    expectOutput(ast, output);
  });

  // @TODO: this is breaking change behavior
  test.skip('parse tags with single attributes like disabled', () => {
    const ast = parse('[b]hello[/b] [textarea disabled]world[/textarea]');

    expectOutput(ast, [
      {
        tag: 'b',
        attrs: {},
        content: ['hello'],
      },
        ' ',
      {
        tag: 'textarea',
        attrs: {
          disabled: 'disabled',
        },
        content: ['world'],
      },
    ]);
  });

  test('parse url tag with get params', () => {
    const ast = parse('[url=https://github.com/JiLiZART/bbob/search?q=any&unscoped_q=any]GET[/url]');

    expectOutput(ast, [
      {
        tag: 'url',
        attrs: {
          'https://github.com/JiLiZART/bbob/search?q=any&unscoped_q=any': 'https://github.com/JiLiZART/bbob/search?q=any&unscoped_q=any',
        },
        content: ['GET'],
      },
    ]);
  });

  test('parse url tag with # and = symbols [google docs]', () => {
    const ast = parse('[url href=https://docs.google.com/spreadsheets/d/1W9VPUESF_NkbSa_HtRFrQNl0nYo8vPCxJFy7jD3Tpio/edit#gid=0]Docs[/url]');

    expectOutput(ast, [
      {
        tag: 'url',
        attrs: {
          href: 'https://docs.google.com/spreadsheets/d/1W9VPUESF_NkbSa_HtRFrQNl0nYo8vPCxJFy7jD3Tpio/edit#gid=0',
        },
        content: ['Docs'],
      },
    ]);
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

import { parse } from '../src';
import type { TagNode, TagNodeTree } from "@bbob/types";

describe('Parser', () => {
  const expectOutput = (ast: TagNodeTree, output: Partial<TagNodeTree>) => {
    expect(ast).toBeInstanceOf(Array);
    expect(ast).toMatchObject(output as {} | TagNode[]);
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
        startTagPos: {
          start: 0,
          end: 17,
        },
        endTagPos: {
          start: 24,
          end: 31,
        },
      },
    ];

    expectOutput(ast, output);
  });

  test('parse paired tags tokens 2', () => {
    const ast = parse('[bar]Foo Bar[/bar]');
    const output = [
      {
        tag: 'bar',
        attrs: {},
        content: [
          'Foo',
          ' ',
          'Bar',
        ],
        startTagPos: {
          start: 0,
          end: 5,
        },
        endTagPos: {
          start: 12,
          end: 18,
        },
      },
    ];

    expectOutput(ast, output);
  });

  describe('onlyAllowTags', () => {
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
          startTagPos: {
            start: 0,
            end: 15,
          },
          endTagPos: {
            start: 25,
            end: 30,
          },
        },
      ];

      expectOutput(ast, output);
    });

    test('parse only allowed tags with params', () => {
      const options = {
        onlyAllowTags: ['b', 'i', 'u']
      };
      const ast = parse('hello [blah foo="bar"]world[/blah]', options);

      expectOutput(ast, [
        'hello',
        ' ',
        '[blah foo="bar"]',
        'world',
        '[/blah]'
      ]);
    });

    test('parse only allowed tags with named param', () => {
      const options = {
        onlyAllowTags: ['b', 'i', 'u']
      };
      const ast = parse('hello [blah="bar"]world[/blah]', options);

      expectOutput(ast, [
        'hello',
        ' ',
        '[blah="bar"]',
        'world',
        '[/blah]'
      ]);
    });

    test('parse only allowed tags inside disabled tags', () => {
      const ast = parse('[tab]  [ch]E[/ch]\nA cripple walks amongst you[/tab]\n[tab]                        [ch]A[/ch]\nAll you tired human beings[/tab]', {
        onlyAllowTags: ['ch']
      });
      const output = [
        '[tab]',
        '  ',
        {
          tag: 'ch',
          attrs: {},
          content: ['E'],
          startTagPos: {
            start: 7,
            end: 11,
          },
          endTagPos: {
            start: 12,
            end: 17,
          },
        },
        '\n',
        'A',
        ' ',
        'cripple',
        ' ',
        'walks',
        ' ',
        'amongst',
        ' ',
        'you',
        '[/tab]',
        '\n',
        '[tab]',
        '                        ',
        {
          tag: 'ch',
          attrs: {},
          content: ['A'],
          startTagPos: {
            start: 81,
            end: 85,
          },
          endTagPos: {
            start: 86,
            end: 91,
          },
        },
        '\n',
        'All',
        ' ',
        'you',
        ' ',
        'tired',
        ' ',
        'human',
        ' ',
        'beings',
        '[/tab]',
      ];

      expectOutput(ast, output);
    });

    test('parse only allowed tags case insensitive', () => {
      const ast = parse('[h1 name=value]Foo [Bar] [/h1]', {
        onlyAllowTags: ['H1']
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
          startTagPos: {
            start: 0,
            end: 15,
          },
          endTagPos: {
            start: 25,
            end: 30,
          },
        },
      ];

      expectOutput(ast, output);
    });
  });

  describe('contextFreeTags', () => {
    test('context free tag [code]', () => {
      const ast = parse('[code] [b]some string[/b][/code]', {
        contextFreeTags: ['code']
      });
      const output = [
        {
          tag: 'code',
          attrs: {},
          content: [
            ' ',
            '[',
            'b]some',
            ' ',
            'string',
            '[',
            '/b]'
          ],
          startTagPos: {
            start: 0,
            end: 6,
          },
          endTagPos: {
            start: 25,
            end: 32,
          },
        }
      ];

      expectOutput(ast, output);
    });
  });

  test('parse inconsistent tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] /h1]');
    const output = [
      {
        attrs: {
          name: 'value'
        },
        tag: 'h1',
        content: [],
        startTagPos: {
          start: 0,
          end: 15,
        },
      },
      'Foo',
      ' ',
      {
        tag: 'bar',
        attrs: {},
        content: [],
        startTagPos: {
          start: 19,
          end: 24,
        },
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
        startTagPos: {
          start: 0,
          end: 38,
        },
        endTagPos: {
          start: 42,
          end: 48,
        },
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
        startTagPos: {
          start: 0,
          end: 64,
        },
        endTagPos: {
          start: 68,
          end: 74,
        },
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
        startTagPos: {
          start: 0,
          end: 38,
        },
      },
    ];

    expectOutput(ast, output);
  });

  test('detect inconsistent tag', () => {
    const onError = jest.fn();

    parse('[c][/c][b]hello[/c][/b][b]', { onError });

    expect(onError).toHaveBeenCalled();
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
        startTagPos: {
          start: 0,
          end: 18,
        },
        endTagPos: {
          start: 22,
          end: 31,
        },
      },
      {
        tag: 'mytag2',
        attrs: {
          size: '16',
        },
        content: ['Tag2'],
        startTagPos: {
          start: 31,
          end: 49,
        },
        endTagPos: {
          start: 53,
          end: 62,
        },
      },
      {
        tag: 'mytag3',
        attrs: {},
        content: ['Tag3'],
        startTagPos: {
          start: 62,
          end: 70,
        },
        endTagPos: {
          start: 74,
          end: 83,
        },
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
        startTagPos: {
          start: 0,
          end: 17,
        },
        endTagPos: {
          start: 24,
          end: 31,
        },
      },
      ' ',
      {
        tag: 'textarea',
        attrs: {
          disabled: 'disabled',
        },
        content: ['world'],
        startTagPos: {
          start: 0,
          end: 17,
        },
        endTagPos: {
          start: 24,
          end: 31,
        },
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
        startTagPos: {
          start: 0,
          end: 66,
        },
        endTagPos: {
          start: 69,
          end: 75,
        },
      },
    ]);
  });

  test('parse triple nested tags', () => {
    const ast = parse(`this is outside [spoiler title="name with
      multiline
      attr value"] this is a spoiler
      [b]this is bold [i]this is bold and italic[/i] this is bold again[/b]
      [/spoiler]this is outside again`);
    expectOutput(ast, [
      "this",
      " ",
      "is",
      " ",
      "outside",
      " ",
      {
        attrs: {
          "title": "name with\n      multiline\n      attr value",
        },
        content: [
          " ",
          "this",
          " ",
          "is",
          " ",
          "a",
          " ",
          "spoiler",
          "\n",
          "      ",
          {
            attrs: {},
            content: [
              "this",
              " ",
              "is",
              " ",
              "bold",
              " ",
              {
                attrs: {},
                content: [
                  "this",
                  " ",
                  "is",
                  " ",
                  "bold",
                  " ",
                  "and",
                  " ",
                  "italic",
                ],
                endTagPos: {
                  "end": 147,
                  "start": 143,
                },
                startTagPos: {
                  "end": 120,
                  "start": 117,
                },
                "tag": "i",
              },
              " ",
              "this",
              " ",
              "is",
              " ",
              "bold",
              " ",
              "again",
            ],
            endTagPos: {
              "end": 170,
              "start": 166,
            },
            startTagPos: {
              "end": 104,
              "start": 101,
            },
            tag: "b",
          },
          "\n",
          "      ",
        ],
        endTagPos: {
          "end": 187,
          "start": 177,
        },
        startTagPos: {
          "end": 76,
          "start": 16,
        },
        tag: "spoiler",
      },
      "this",
      " ",
      "is",
      " ",
      "outside",
      " ",
      "again",
    ]);
  });

  test('parse tag with camelCase params', () => {
    const ast = parse(`[url href="/groups/123/" isNowrap=true isTextOverflow=true state=primary]
        [avatar href="/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff" size=xs][/avatar]
         Group Name Go[/url]    `);

    expectOutput(ast, [
      {
        tag: 'url',
        attrs: {
          href: '/groups/123/',
          isNowrap: 'true',
          isTextOverflow: 'true',
          state: 'primary'
        },
        content: [
          '\n',
          '        ',
          {
            tag: 'avatar',
            attrs: {
              href: '/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff',
              size: 'xs'
            },
            content: [],
            startTagPos: {
              start: 82,
              end: 164,
            },
            endTagPos: {
              start: 164,
              end: 173,
            },
          },
          '\n',
          '         ',
          'Group',
          ' ',
          'Name',
          ' ',
          'Go',
        ],
        startTagPos: {
          start: 0,
          end: 73,
        },
        endTagPos: {
          start: 196,
          end: 202,
        },
      },
      '    ',
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
        startTagPos: {
          start: 0,
          end: 105,
        },
        endTagPos: {
          start: 109,
          end: 115,
        },
      },
    ]);
  });

  test('parse with lost closing tag in middle', () => {
    const str = `[quote]some[/quote][color=red]test[/color]
[quote]xxxsdfasdf
sdfasdfasdf

[url=xxx]xxx[/url]`;

    expectOutput(
      parse(str),
      [
        {
          tag: 'quote', attrs: {}, content: ['some'],
          startTagPos: {
            start: 0,
            end: 7,
          },
          endTagPos: {
            start: 11,
            end: 19,
          },
        },
        {
          tag: 'color', attrs: { red: 'red' }, content: ['test'],
          startTagPos: {
            start: 19,
            end: 30,
          },
          endTagPos: {
            start: 34,
            end: 42,
          },
        },
        '\n',
        '[quote]',
        'xxxsdfasdf',
        '\n',
        'sdfasdfasdf',
        '\n',
        '\n',
        {
          tag: 'url', attrs: { xxx: 'xxx' }, content: ['xxx'],
          startTagPos: {
            start: 74,
            end: 83,
          },
          endTagPos: {
            start: 86,
            end: 92,
          },
        }
      ]
    );
  });

  test('parse with lost closing tag on start', () => {
    const str = `[quote]xxxsdfasdf[quote]some[/quote][color=red]test[/color]sdfasdfasdf[url=xxx]xxx[/url]`;

    expectOutput(
      parse(str),
      [
        '[quote]',
        'xxxsdfasdf',
        {
          tag: 'quote', attrs: {}, content: ['some'],
          startTagPos: {
            start: 17,
            end: 24,
          },
          endTagPos: {
            start: 28,
            end: 36,
          },
        },
        {
          tag: 'color', attrs: { red: 'red' }, content: ['test'],
          startTagPos: {
            start: 36,
            end: 47,
          },
          endTagPos: {
            start: 51,
            end: 59,
          },
        },
        'sdfasdfasdf',
        {
          tag: 'url', attrs: { xxx: 'xxx' }, content: ['xxx'],
          startTagPos: {
            start: 70,
            end: 79,
          },
          endTagPos: {
            start: 82,
            end: 88,
          },
        }
      ]
    );
  });

  test('parse with lost closing tag on end', () => {
    const str = `[quote]some[/quote][color=red]test[/color]sdfasdfasdf[url=xxx]xxx[/url][quote]xxxsdfasdf`;

    expectOutput(
      parse(str),
      [
        {
          tag: 'quote', attrs: {}, content: ['some'],
          startTagPos: {
            start: 0,
            end: 7,
          },
          endTagPos: {
            start: 11,
            end: 19,
          },
        },
        {
          tag: 'color', attrs: { red: 'red' }, content: ['test'],
          startTagPos: {
            start: 19,
            end: 30,
          },
          endTagPos: {
            start: 34,
            end: 42,
          },
        },
        'sdfasdfasdf',
        {
          tag: 'url', attrs: { xxx: 'xxx' }, content: ['xxx'],
          startTagPos: {
            start: 53,
            end: 62,
          },
          endTagPos: {
            start: 65,
            end: 71,
          },
        },
        '[quote]',
        'xxxsdfasdf',
      ]
    );
  });

  describe('html', () => {
    const parseHTML = (input: string) => parse(input, { openTag: '<', closeTag: '>' });

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
          ],
          startTagPos: {
            start: 0,
            end: 49,
          },
          endTagPos: {
            start: 78,
            end: 87,
          },
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
          ],
          startTagPos: {
            start: 0,
            end: 50,
          },
          endTagPos: {
            start: 71,
            end: 80,
          },
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
          ],
          startTagPos: {
            start: 0,
            end: 48,
          },
          endTagPos: {
            start: 76,
            end: 85,
          },
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

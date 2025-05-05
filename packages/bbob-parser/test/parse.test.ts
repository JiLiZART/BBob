import { parse } from '../src';
import type { TagNode, TagNodeTree } from "@bbob/types";

describe('Parser', () => {
  const expectOutput = (ast: TagNodeTree, output: Partial<TagNodeTree>) => {
    expect(ast).toBeInstanceOf(Array);
    const mappedAst = Array.isArray(ast) ? ast.map(item => {
      if (typeof item === 'object' && typeof item.toJSON === 'function') {
        return item.toJSON()
      }

      return item

    }) : ast
    expect(mappedAst).toMatchObject(output as {} | TagNode[]);
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
        start: {
          from: 0,
          to: 17,
        },
        end: {
          from: 24,
          to: 31,
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
        start: {
          from: 0,
          to: 5,
        },
        end: {
          from: 12,
          to: 18,
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
          start: {
            from: 0,
            to: 15,
          },
          end: {
            from: 25,
            to: 30,
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
          start: {
            from: 7,
            to: 11,
          },
          end: {
            from: 12,
            to: 17,
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
          start: {
            from: 81,
            to: 85,
          },
          end: {
            from: 86,
            to: 91,
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
          start: {
            from: 0,
            to: 15,
          },
          end: {
            from: 25,
            to: 30,
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
          start: {
            from: 0,
            to: 6,
          },
          end: {
            from: 25,
            to: 32,
          },
        }
      ];

      expectOutput(ast, output);
    });

    test('nesting similar free tags [code][codeButton]text[/codeButton][code]', () => {
      const ast = parse('[code][codeButton]text[/codeButton][code]');
      const output = [
        {
          tag: 'code',
          attrs: {},
          content: [
            '[',
            'codeButton]',
            'text',
            '[',
            '/codeButton]'
          ]
        }
      ];

      expectOutput(ast, output);
    })
  });

  describe('caseFreeTags', () => {
    test('default case tags', () => {
      const ast = parse('[h1 name=value]Foo[/H1]', {
        caseFreeTags: false
      });
      const output = [
        {
          tag: 'h1',
          attrs: {
            name: 'value'
          },
          content: [],
          start: {
            from: 0,
            to: 15,
          }
        },
        "Foo",
        "[/H1]"
      ];

      expectOutput(ast, output);
    });

    test('case free tags', () => {
      const ast = parse('[h1 name=value]Foo[/H1]', {
        caseFreeTags: true
      });
      const output = [
        {
          tag: 'h1',
          attrs: {
            name: 'value'
          },
          content: [
            "Foo"
          ],
          start: {
            from: 0,
            to: 15,
          },
          end: {
            from: 18,
            to: 23,
          },
        }
      ];

      expectOutput(ast, output);
    });
  })

  test('parse inconsistent tags', () => {
    const ast = parse('[h1 name=value]Foo [Bar] /h1]');
    const output = [
      {
        attrs: {
          name: 'value'
        },
        tag: 'h1',
        content: [],
        start: {
          from: 0,
          to: 15,
        },
      },
      'Foo',
      ' ',
      {
        tag: 'bar',
        attrs: {},
        content: [],
        start: {
          from: 19,
          to: 24,
        },
      },
      ' ',
      '/h1]',
    ];

    expectOutput(ast, output);
  });

  test('parse closed tag', () => {
    const ast = parse('[/h1]');
    const output = [
      '[/h1]',
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
        start: {
          from: 0,
          to: 38,
        },
        end: {
          from: 42,
          to: 48,
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
        start: {
          from: 0,
          to: 64,
        },
        end: {
          from: 68,
          to: 74,
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
        start: {
          from: 0,
          to: 38,
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
        start: {
          from: 0,
          to: 18,
        },
        end: {
          from: 22,
          to: 31,
        },
      },
      {
        tag: 'mytag2',
        attrs: {
          size: '16',
        },
        content: ['Tag2'],
        start: {
          from: 31,
          to: 49,
        },
        end: {
          from: 53,
          to: 62,
        },
      },
      {
        tag: 'mytag3',
        attrs: {},
        content: ['Tag3'],
        start: {
          from: 62,
          to: 70,
        },
        end: {
          from: 74,
          to: 83,
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
        start: {
          from: 0,
          to: 17,
        },
        end: {
          from: 24,
          to: 31,
        },
      },
      ' ',
      {
        tag: 'textarea',
        attrs: {
          disabled: 'disabled',
        },
        content: ['world'],
        start: {
          from: 0,
          to: 17,
        },
        end: {
          from: 24,
          to: 31,
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
        start: {
          from: 0,
          to: 66,
        },
        end: {
          from: 69,
          to: 75,
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
                end: {
                  to: 147,
                  from: 143,
                },
                start: {
                  "to": 120,
                  "from": 117,
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
            end: {
              "to": 170,
              "from": 166,
            },
            start: {
              "to": 104,
              "from": 101,
            },
            tag: "b",
          },
          "\n",
          "      ",
        ],
        end: {
          "to": 187,
          "from": 177,
        },
        start: {
          "to": 76,
          "from": 16,
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
            start: {
              from: 82,
              to: 164,
            },
            end: {
              from: 164,
              to: 173,
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
        start: {
          from: 0,
          to: 73,
        },
        end: {
          from: 196,
          to: 202,
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
        start: {
          from: 0,
          to: 105,
        },
        end: {
          from: 109,
          to: 115,
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
            start: {
              from: 0,
              to: 7,
            },
            end: {
              from: 11,
              to: 19,
            },
          },
          {
            tag: 'color', attrs: { red: 'red' }, content: ['test'],
            start: {
              from: 19,
              to: 30,
            },
            end: {
              from: 34,
              to: 42,
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
            start: {
              from: 74,
              to: 83,
            },
            end: {
              from: 86,
              to: 92,
            },
          }
        ]
    );
  });

  test('parse with lost closing tag on from', () => {
    const str = `[quote]xxxsdfasdf[quote]some[/quote][color=red]test[/color]sdfasdfasdf[url=xxx]xxx[/url]`;

    expectOutput(
        parse(str),
        [
          '[quote]',
          'xxxsdfasdf',
          {
            tag: 'quote', attrs: {}, content: ['some'],
            start: {
              from: 17,
              to: 24,
            },
            end: {
              from: 28,
              to: 36,
            },
          },
          {
            tag: 'color', attrs: { red: 'red' }, content: ['test'],
            start: {
              from: 36,
              to: 47,
            },
            end: {
              from: 51,
              to: 59,
            },
          },
          'sdfasdfasdf',
          {
            tag: 'url', attrs: { xxx: 'xxx' }, content: ['xxx'],
            start: {
              from: 70,
              to: 79,
            },
            end: {
              from: 82,
              to: 88,
            },
          }
        ]
    );
  });

  test('parse with lost closing tag on to', () => {
    const str = `[quote]some[/quote][color=red]test[/color]sdfasdfasdf[url=xxx]xxx[/url][quote]xxxsdfasdf`;

    expectOutput(
        parse(str),
        [
          {
            tag: 'quote', attrs: {}, content: ['some'],
            start: {
              from: 0,
              to: 7,
            },
            end: {
              from: 11,
              to: 19,
            },
          },
          {
            tag: 'color', attrs: { red: 'red' }, content: ['test'],
            start: {
              from: 19,
              to: 30,
            },
            end: {
              from: 34,
              to: 42,
            },
          },
          'sdfasdfasdf',
          {
            tag: 'url', attrs: { xxx: 'xxx' }, content: ['xxx'],
            start: {
              from: 53,
              to: 62,
            },
            end: {
              from: 65,
              to: 71,
            },
          },
          '[quote]',
          'xxxsdfasdf',
        ]
    );
  });

  test('parse with url in tag content', () => {
    const input = parse('[img]https://tw.greywool.com/i/e3Ph5.png[/img]');

    expectOutput(input, [
      {
        tag: 'img',
        attrs: {},
        content: ['https://tw.greywool.com/i/e3Ph5.png'],
        start: {
          from: 0,
          to: 5,
        },
        end: {
          from: 40,
          to: 46,
        },
      },
    ]);
  });

  test('parse invalid tags', () => {
    const input = parse('[b]Press Release[/b] [statement redacted] [i]This is more content[/i]', {
      whitespaceInTags: false
    })

    expectOutput(input, [
      {
        tag: 'b',
        attrs: {},
        content: [
          'Press',
          ' ',
          'Release'
        ],
      },
      ' ',
      '[',
      'statement',
      ' ',
      'redacted]',
      ' ',
      {
        tag: 'i',
        attrs: {},
        content: [
          'This',
          ' ',
          'is',
          ' ',
          'more',
          ' ',
          'content'
        ],
      },
    ]);
  })

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
          start: {
            from: 0,
            to: 49,
          },
          end: {
            from: 78,
            to: 87,
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
          start: {
            from: 0,
            to: 50,
          },
          end: {
            from: 71,
            to: 80,
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
          start: {
            from: 0,
            to: 48,
          },
          end: {
            from: 76,
            to: 85,
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

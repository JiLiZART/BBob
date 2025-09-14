import { TYPE_ID, VALUE_ID, TYPE_WORD, TYPE_TAG, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_SPACE, TYPE_NEW_LINE, LINE_ID, COLUMN_ID, START_POS_ID, END_POS_ID } from '../src/Token';
import { createLexer } from '../src/lexer';
import { parse } from "../src";

const TYPE = {
  WORD: TYPE_WORD,
  TAG: TYPE_TAG,
  ATTR_NAME: TYPE_ATTR_NAME,
  ATTR_VALUE: TYPE_ATTR_VALUE,
  SPACE: TYPE_SPACE,
  NEW_LINE: TYPE_NEW_LINE,
};

const TYPE_NAMES = Object.fromEntries(Object.keys(TYPE).map((key: keyof typeof TYPE) => [TYPE[key], key]));

const tokenize = (input: string) => (createLexer(input).tokenize());
const tokenizeEscape = (input: string) => (createLexer(input, { enableEscapeTags: true }).tokenize());
const tokenizeContextFreeTags = (input: string, tags: string[] = []) => (createLexer(input, { contextFreeTags: tags }).tokenize());

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeMatchOutput(expected: Array<unknown>): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeMatchOutput(tokens, output) {
    if (tokens.length !== output.length) {
      return {
        message: () =>
            `expected tokens length ${tokens.length} to be ${output.length}`,
        pass: false,
      };
    }

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];
      const [type, value, col, row, startPos, endPos] = output[idx];

      if (typeof token !== 'object') {
        return {
          message: () =>
              `token must to be Object`,
          pass: false,
        };
      }

      if (token[TYPE_ID] !== type) {
        return {
          message: () =>
              `expected token type ${TYPE_NAMES[type]} but received ${TYPE_NAMES[token[TYPE_ID]]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }

      if (token[VALUE_ID] !== value) {
        return {
          message: () =>
              `expected token value ${value} but received ${token[VALUE_ID]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }

      if (token[LINE_ID] !== row) {
        return {
          message: () =>
              `expected token row ${row} but received ${token[LINE_ID]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }

      if (token[COLUMN_ID] !== col) {
        return {
          message: () =>
              `expected token col ${col} but received ${token[COLUMN_ID]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }

      if (type === TYPE.TAG && token[START_POS_ID] !== startPos) {
        return {
          message: () =>
              `expected token start pos ${startPos} but received ${token[START_POS_ID]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }

      if (type === TYPE.TAG && token[END_POS_ID] !== endPos) {
        return {
          message: () =>
              `expected token end pos ${endPos} but received ${token[END_POS_ID]} for ${JSON.stringify(output[idx])}`,
          pass: false,
        };
      }
    }

    return {
      message: () =>
          `no valid output`,
      pass: true,
    };
  },
});

describe('lexer', () => {
  test('single tag', () => {
    const input = '[SingleTag]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'SingleTag', 0, 0, 0, 11],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('single tag with params', () => {
    const input = '[user=111]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'user', 0, 0, 0, 10],
      [TYPE.ATTR_VALUE, '111', 6, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('paired tag with single param', () => {
    const input = '[url=someval]GET[/url]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', 0, 0, 0, 13],
      [TYPE.ATTR_VALUE, 'someval', 5, 0],
      [TYPE.WORD, 'GET', 13, 0],
      [TYPE.TAG, '/url', 17, 0, 16, 22],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('single fake tag', () => {
    const input = '[ user=111]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', 0, 0, 0],
      [TYPE.SPACE, ' ', 1, 0, 1],
      [TYPE.WORD, 'user=111]', 2, 0, 2],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('single tag with spaces', () => {
    const input = '[Single Tag]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'Single Tag', 0, 0, 0, 12],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  // @TODO: this is breaking change behavior
  test.skip('tags with single attrs like disabled', () => {
    const input = '[textarea disabled]world[/textarea]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'textarea', 0, 0],
      [TYPE.ATTR_VALUE, 'disabled', 10, 0],
      [TYPE.WORD, 'world"', 19, 0],
      [TYPE.TAG, '/textarea', 25, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tags with single word and camel case params', () => {
    const input = `[url href="/groups/123/" isNowrap=true isTextOverflow=true state=primary]
        [avatar href="/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff" size=xs][/avatar]
         Group Name Go[/url]    `;
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'url', 0, 0, 0, 73],
      [TYPE.ATTR_NAME, 'href', 5, 0, 5],
      [TYPE.ATTR_VALUE, '/groups/123/', 10, 0, 10],
      [TYPE.ATTR_NAME, 'isNowrap', 25, 0, 25],
      [TYPE.ATTR_VALUE, 'true', 34, 0, 34],
      [TYPE.ATTR_NAME, 'isTextOverflow', 39, 0, 39],
      [TYPE.ATTR_VALUE, 'true', 54, 0, 54],
      [TYPE.ATTR_NAME, 'state', 59, 0, 59],
      [TYPE.ATTR_VALUE, 'primary', 65, 0, 65],
      [TYPE.NEW_LINE, '\n', 73, 0, 73],
      [TYPE.SPACE, '        ', 0, 1, 74],
      [TYPE.TAG, 'avatar', 8, 1, 82, 164],
      [TYPE.ATTR_NAME, 'href', 16, 1, 90],
      [TYPE.ATTR_VALUE, '/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff', 21, 1, 95],
      [TYPE.ATTR_NAME, 'size', 82, 1, 156],
      [TYPE.ATTR_VALUE, 'xs', 87, 1, 161],
      [TYPE.TAG, '/avatar', 90, 1, 164, 173],
      [TYPE.NEW_LINE, '\n', 100, 1, 173],
      [TYPE.SPACE, '         ', 0, 2, 174],
      [TYPE.WORD, 'Group', 9, 2, 184],
      [TYPE.SPACE, ' ', 14, 2, 189],
      [TYPE.WORD, 'Name', 15, 2, 190],
      [TYPE.SPACE, ' ', 19, 2, 194],
      [TYPE.WORD, 'Go', 20, 2, 195],
      [TYPE.TAG, '/url', 22, 2, 196, 202],
      [TYPE.SPACE, '    ', 28, 2, 203],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('string with quotemarks', () => {
    const input = '"Someone Like You" by Adele';
    const tokens = tokenize(input);

    const output = [
      [TYPE.WORD, '"Someone', 0, 0],
      [TYPE.SPACE, ' ', 8, 0],
      [TYPE.WORD, 'Like', 9, 0],
      [TYPE.SPACE, ' ', 13, 0],
      [TYPE.WORD, 'You"', 14, 0],
      [TYPE.SPACE, ' ', 18, 0],
      [TYPE.WORD, 'by', 19, 0],
      [TYPE.SPACE, ' ', 21, 0],
      [TYPE.WORD, 'Adele', 22, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tags in brakets', () => {
    const input = '[ [h1]G[/h1] ]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.WORD, '[', 0, 0],
      [TYPE.SPACE, ' ', 1, 0],
      [TYPE.TAG, 'h1', 2, 0, 2, 6],
      [TYPE.WORD, 'G', 6, 0],
      [TYPE.TAG, '/h1', 7, 0, 7, 12],
      [TYPE.SPACE, ' ', 12, 0],
      [TYPE.WORD, ']', 13, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tag as param', () => {
    const input = '[color="#ff0000"]Text[/color]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'color', 0, 0, 0, 17],
      [TYPE.ATTR_VALUE, '#ff0000', 7, 0],
      [TYPE.WORD, 'Text', 17, 0],
      [TYPE.TAG, '/color', 21, 0, 21, 29],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tag with quotemark params with spaces', () => {
    const input = '[url text="Foo Bar" text2="Foo Bar 2"]Text[/url]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', 0, 0, 0, 38],
      [TYPE.ATTR_NAME, 'text', 5, 0],
      [TYPE.ATTR_VALUE, 'Foo Bar', 10, 0],
      [TYPE.ATTR_NAME, 'text2', 20, 0],
      [TYPE.ATTR_VALUE, 'Foo Bar 2', 26, 0],
      [TYPE.WORD, 'Text', 38, 0],
      [TYPE.TAG, '/url', 42, 0, 42, 48],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tag with escaped quotemark param', () => {
    const input = `[url text="Foo \\"Bar"]Text[/url]`;
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', 0, 0, 0, 22],
      [TYPE.ATTR_NAME, 'text', 5, 0],
      [TYPE.ATTR_VALUE, 'Foo "Bar', 10, 0],
      [TYPE.WORD, 'Text', 22, 0],
      [TYPE.TAG, '/url', 26, 0, 26, 32],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('tag param without quotemarks', () => {
    const input = '[style color=#ff0000]Text[/style]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'style', 0, 0, 0, 21],
      [TYPE.ATTR_NAME, 'color', 7, 0],
      [TYPE.ATTR_VALUE, '#ff0000', 13, 0],
      [TYPE.WORD, 'Text', 21, 0],
      [TYPE.TAG, '/style', 26, 0, 25, 33],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('list tag with items', () => {
    const input = `[list]
   [*] Item 1.
   [*] Item 2.
   [*] Item 3.
[/list]`;

    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'list', 0, 0, 0, 6],
      [TYPE.NEW_LINE, '\n', 6, 0],
      [TYPE.SPACE, '   ', 0, 1],
      [TYPE.TAG, '*', 3, 1, 10, 13],
      [TYPE.SPACE, ' ', 6, 1],
      [TYPE.WORD, 'Item', 7, 1],
      [TYPE.SPACE, ' ', 11, 1],
      [TYPE.WORD, '1.', 12, 1],
      [TYPE.NEW_LINE, '\n', 14, 1],
      [TYPE.SPACE, '   ', 0, 2],
      [TYPE.TAG, '*', 3, 2, 25, 28],
      [TYPE.SPACE, ' ', 6, 2],
      [TYPE.WORD, 'Item', 7, 2],
      [TYPE.SPACE, ' ', 11, 2],
      [TYPE.WORD, '2.', 12, 2],
      [TYPE.NEW_LINE, '\n', 14, 2],
      [TYPE.SPACE, '   ', 0, 3],
      [TYPE.TAG, '*', 3, 3, 40, 43],
      [TYPE.SPACE, ' ', 6, 3],
      [TYPE.WORD, 'Item', 7, 3],
      [TYPE.SPACE, ' ', 11, 3],
      [TYPE.WORD, '3.', 12, 3],
      [TYPE.NEW_LINE, '\n', 14, 3],
      [TYPE.TAG, '/list', 0, 4, 52, 59],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('few tags without spaces', () => {
    const input = '[mytag1 size="15"]Tag1[/mytag1][mytag2 size="16"]Tag2[/mytag2][mytag3]Tag3[/mytag3]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'mytag1', 0, 0, 0, 18],
      [TYPE.ATTR_NAME, 'size', 8, 0],
      [TYPE.ATTR_VALUE, '15', 13, 0],
      [TYPE.WORD, 'Tag1', 18, 0],
      [TYPE.TAG, '/mytag1', 22, 0, 22, 31],
      [TYPE.TAG, 'mytag2', 31, 0, 31, 49],
      [TYPE.ATTR_NAME, 'size', 39, 0],
      [TYPE.ATTR_VALUE, '16', 44, 0],
      [TYPE.WORD, 'Tag2', 49, 0],
      [TYPE.TAG, '/mytag2', 53, 0, 53, 62],
      [TYPE.TAG, 'mytag3', 62, 0, 62, 70],
      [TYPE.WORD, 'Tag3', 70, 0],
      [TYPE.TAG, '/mytag3', 74, 0, 74, 83],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('bad tags as texts', () => {
    const inputs = [
      '[]',
      '[=]',
      '![](image.jpg)',
      'x html([a. title][, alt][, classes]) x',
      '[/y]',
      '[sc',
      '[sc / [/sc]',
      '[sc arg="val',
    ];

    const asserts = [
      [
        [TYPE.WORD, '[', 0, 0],
        [TYPE.WORD, ']', 1, 0]
      ],
      [
        [TYPE.WORD, '[', 0, 0],
        [TYPE.WORD, '=]', 1, 0]
      ],
      [
        [TYPE.WORD, '!', 0, 0],
        [TYPE.WORD, '[', 1, 0],
        [TYPE.WORD, '](image.jpg)', 2, 0],
      ],
      [
        [TYPE.WORD, 'x', 0, 0],
        [TYPE.SPACE, ' ', 1, 0],
        [TYPE.WORD, 'html(', 2, 0],
        [TYPE.TAG, 'a. title', 7, 0, 7, 17],
        [TYPE.TAG, ', alt', 17, 0, 17, 24],
        [TYPE.TAG, ', classes', 24, 0, 24, 35],
        [TYPE.WORD, ')', 35, 0],
        [TYPE.SPACE, ' ', 36, 0],
        [TYPE.WORD, 'x', 37, 0],
      ],
      [
        [TYPE.TAG, '/y', 0, 0, 0, 4]
      ],
      [
        [TYPE.WORD, '[', 0, 0],
        [TYPE.WORD, 'sc', 1, 0]
      ],
      [
        // [sc /
        [TYPE.WORD, '[', 0, 0],
        [TYPE.WORD, 'sc', 1, 0],
        [TYPE.SPACE, ' ', 3, 0],
        [TYPE.WORD, '/', 4, 0],
        [TYPE.SPACE, ' ', 5, 0],
        [TYPE.TAG, '/sc', 6, 0, 6, 11]
      ],
      [
        [TYPE.WORD, '[', 0, 0],
        [TYPE.WORD, 'sc', 1, 0],
        [TYPE.SPACE, ' ', 3, 0],
        [TYPE.WORD, 'arg="val', 4, 0],
      ]
    ];

    inputs.forEach((input, idx) => {
      const tokens = tokenize(input);
      const output = asserts[idx];

      expect(tokens).toBeMatchOutput(output);
    });
  });

  test('bad unclosed tag', () => {
    const input = `[Finger Part A [Finger]`;
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', 0, 0],
      [TYPE.WORD, 'Finger', 1, 0],
      [TYPE.SPACE, ' ', 7, 0],
      [TYPE.WORD, 'Part', 8, 0],
      [TYPE.SPACE, ' ', 12, 0],
      [TYPE.WORD, 'A', 13, 0],
      [TYPE.SPACE, ' ', 14, 0],
      [TYPE.TAG, 'Finger', 15, 0, 15, 23]
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('no close tag', () => {
    const input = '[Finger Part A';
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', 0, 0],
      [TYPE.WORD, 'Finger', 1, 0],
      [TYPE.SPACE, ' ', 7, 0],
      [TYPE.WORD, 'Part', 8, 0],
      [TYPE.SPACE, ' ', 12, 0],
      [TYPE.WORD, 'A', 13, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('escaped tag', () => {
    const input = '\\[b\\]test\\[';
    const tokens = tokenizeEscape(input);

    const output = [
      [TYPE.WORD, '[', 0, 0],
      [TYPE.WORD, 'b', 2, 0],
      [TYPE.WORD, ']', 3, 0],
      [TYPE.WORD, 'test', 5, 0],
      [TYPE.WORD, '[', 9, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('escaped tag and escaped backslash', () => {
    const input = '\\\\\\[b\\\\\\]test\\\\\\[/b\\\\\\]';
    const tokens = tokenizeEscape(input);
    const output = [
      [TYPE.WORD, '\\', 0, 0],
      [TYPE.WORD, '[', 2, 0],
      [TYPE.WORD, 'b', 4, 0],
      [TYPE.WORD, '\\', 5, 0],
      [TYPE.WORD, ']', 7, 0],
      [TYPE.WORD, 'test', 9, 0],
      [TYPE.WORD, '\\', 13, 0],
      [TYPE.WORD, '[', 15, 0],
      [TYPE.WORD, '/b', 17, 0],
      [TYPE.WORD, '\\', 19, 0],
      [TYPE.WORD, ']', 21, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('context free tag [code]', () => {
    const input = '[code] [b]some string[/b][/code]';
    const tokens = tokenizeContextFreeTags(input, ['code']);
    const output = [
      [TYPE.TAG, 'code', 0, 0, 0, 6],
      [TYPE.SPACE, ' ', 6, 0],
      [TYPE.WORD, '[', 7, 0],
      [TYPE.WORD, 'b]some', 8, 0],
      [TYPE.SPACE, ' ', 14, 0],
      [TYPE.WORD, 'string', 15, 0],
      [TYPE.WORD, '[', 21, 0],
      [TYPE.WORD, '/b]', 22, 0],
      [TYPE.TAG, '/code', 25, 0, 25, 32],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('context free tag case insensitive [CODE]', () => {
    const tokens = tokenizeContextFreeTags('[CODE] [b]some string[/b][/CODE]', ['code']);

    const output = [
      [TYPE.TAG, 'CODE', 0, 0, 0, 6],
      [TYPE.SPACE, ' ', 6, 0],
      [TYPE.WORD, '[', 7, 0],
      [TYPE.WORD, 'b]some', 8, 0],
      [TYPE.SPACE, ' ', 14, 0],
      [TYPE.WORD, 'string', 15, 0],
      [TYPE.WORD, '[', 21, 0],
      [TYPE.WORD, '/b]', 22, 0],
      [TYPE.TAG, '/CODE', 25, 0, 25, 32],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  test('bad closed tag with escaped backslash', () => {
    const input = `[b]test[\\b]`;
    const tokens = tokenizeEscape(input);
    const output = [
      [TYPE.TAG, 'b', 0, 0, 0, 3],
      [TYPE.WORD, 'test', 3, 0],
      [TYPE.WORD, '[', 7, 0],
      [TYPE.WORD, '\\', 8, 0],
      [TYPE.WORD, 'b]', 9, 0],
    ];

    expect(tokens).toBeMatchOutput(output);
  });

  describe('html', () => {
    const tokenizeHTML = (input: string) => createLexer(input, { openTag: '<', closeTag: '>' }).tokenize();

    test('normal attributes', () => {
      const content = `<button id="test0" class="value0" title="value1">class="value0" title="value1"</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 0, 0, 0, 49],
        [TYPE.ATTR_NAME, 'id', 8, 0],
        [TYPE.ATTR_VALUE, 'test0', 11, 0],
        [TYPE.ATTR_NAME, 'class', 19, 0],
        [TYPE.ATTR_VALUE, 'value0', 25, 0],
        [TYPE.ATTR_NAME, 'title', 34, 0],
        [TYPE.ATTR_VALUE, 'value1', 40, 0],
        [TYPE.WORD, "class=\"value0\"", 49, 0],
        [TYPE.SPACE, " ", 63, 0],
        [TYPE.WORD, "title=\"value1\"", 64, 0],
        [TYPE.TAG, '/button', 78, 0, 78, 87]
      ];

      expect(tokens).toBeMatchOutput(output);
    });

    test('attributes with no quotes or value', () => {
      const content = `<button id="test1" class=value2 disabled>class=value2 disabled</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 0, 0, 0, 41],
        [TYPE.ATTR_NAME, 'id', 8, 0],
        [TYPE.ATTR_VALUE, 'test1', 11, 0],
        [TYPE.ATTR_NAME, 'class', 19, 0],
        [TYPE.ATTR_VALUE, 'value2', 25, 0],
        [TYPE.ATTR_VALUE, 'disabled', 32, 0],
        [TYPE.WORD, "class=value2", 41, 0],
        [TYPE.SPACE, " ", 54, 0],
        [TYPE.WORD, "disabled", 55, 0],
        [TYPE.TAG, '/button', 63, 0, 62, 71]
      ];

      expect(tokens).toBeMatchOutput(output);
    });

    test('attributes with no space between them. No valid, but accepted by the browser', () => {
      const content = `<button id="test2" class="value4"title="value5">class="value4"title="value5"</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 0, 0, 0, 48],
        [TYPE.ATTR_NAME, 'id', 8, 0],
        [TYPE.ATTR_VALUE, 'test2', 11, 0],
        [TYPE.ATTR_NAME, 'class', 19, 0],
        [TYPE.ATTR_VALUE, 'value4', 25, 0],
        [TYPE.ATTR_NAME, 'title', 34, 0],
        [TYPE.ATTR_VALUE, 'value5', 39, 0],
        [TYPE.WORD, "class=\"value4\"title=\"value5\"", 48, 0],
        [TYPE.TAG, '/button', 76, 0, 76, 85]
      ];

      expect(tokens).toBeMatchOutput(output);
    });

    test.skip('style tag', () => {
      const content = `<style type="text/css">
<!--
p{font-family:geneva,helvetica,arial,"lucida sans",sans-serif}
p{font-size:10pt}
p{color:#333}
span{font-family:geneva,helvetica,arial,"lucida sans",sans-serif}
span{font-size:10pt}
.sp2{font-size:2px}
div{font-family:geneva,helvetica,arial,"lucida sans",sans-serif}
div{font-size:10pt}
div.sitelinks{padding:0px 10px 0px 10px;font-size:9pt}
input{font-family:geneva,helvetica,arial,"lucida sans",sans-serif}
input{padding:0px;margin:0px;font-size:9pt}
input.medium{width:100px;height:18px}
input.buttonred{cursor:hand;font-family:verdana;background:#d12124;color:#fff;height:1.4em;font-weight:bold;font-size:9pt;padding:0px 2px;margin:0px;border:0px none #000}
-->
</style>`;
      const tokens = tokenizeHTML(content);
      expect(tokens).toBeMatchOutput([]);
    });

    test.skip('script tag', () => {
      const content = `<script language="JavaScript" type="text/javascript">
		<!--//
		if ((navigator.platform=='MacPPC')&&(navigator.appVersion.substr(17,8) != "MSIE 5.0")) {document.write('<LINK rel="stylesheet" href="styles/main-3.css" type="text/css">')}
		if (screen.width > 1200)	{document.write('<LINK rel="stylesheet" href="styles/main-3.css" type="text/css">')}
		//-->
	</script>`;
      const tokens = tokenizeHTML(content);
      expect(tokens).toBeMatchOutput([]);
    });
  });
});

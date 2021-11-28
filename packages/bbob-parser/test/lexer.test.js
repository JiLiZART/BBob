import { TYPE_ID, VALUE_ID, TYPE_WORD, TYPE_TAG, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_SPACE, TYPE_NEW_LINE} from '../src/Token'
import { createLexer } from '../src/lexer'

const TYPE = {
  WORD: TYPE_WORD,
  TAG: TYPE_TAG,
  ATTR_NAME: TYPE_ATTR_NAME,
  ATTR_VALUE: TYPE_ATTR_VALUE,
  SPACE: TYPE_SPACE,
  NEW_LINE: TYPE_NEW_LINE,
};

const TYPE_NAMES = Object.fromEntries(Object.keys(TYPE).map(key => [TYPE[key], key]));

const tokenize = input => (createLexer(input).tokenize());
const tokenizeEscape = input => (createLexer(input, { enableEscapeTags: true }).tokenize());

describe('lexer', () => {
  expect.extend({
    toBeMantchOutput(tokens, output) {
      if (tokens.length !== output.length) {
        return {
          message: () =>
              `expected tokens length ${tokens.length} to be ${output.length}`,
          pass: false,
        };
      }

      for (let idx = 0; idx < tokens.length; idx++) {
        const token = tokens[idx];
        const [type, value] = output[idx];

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
                `expected token type ${TYPE_NAMES[type]} but recieved ${TYPE_NAMES[token[TYPE_ID]]} for ${JSON.stringify(output[idx])}`,
            pass: false,
          };
        }

        if (token[VALUE_ID] !== value) {
          return {
            message: () =>
                `expected token value ${value} but recieved ${token[VALUE_ID]} for ${JSON.stringify(output[idx])}`,
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

  test('single tag', () => {
    const input = '[SingleTag]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'SingleTag', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('single tag with params', () => {
    const input = '[user=111]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'user', '0', '0'],
      [TYPE.ATTR_VALUE, '111', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('paired tag with single param', () => {
    const input = '[url=someval]GET[/url]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', '0', '0'],
      [TYPE.ATTR_VALUE, 'someval', '0', '0'],
      [TYPE.WORD, 'GET', '0', '0'],
      [TYPE.TAG, '/url', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('single fake tag', () => {
    const input = '[ user=111]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'user=111]', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('single tag with spaces', () => {
    const input = '[Single Tag]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'Single Tag', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  // @TODO: this is breaking change behavior
  test.skip('tags with single attrs like disabled', () => {
    const input = '[textarea disabled]world[/textarea]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'textarea', '0', '0'],
      [TYPE.ATTR_VALUE, 'disabled', '0', '0'],
      [TYPE.WORD, 'world"', '0', '0'],
      [TYPE.TAG, '/textarea', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tags with single word and camel case params', () => {
    const input = `[url href="/groups/123/" isNowrap=true isTextOverflow=true state=primary]
        [avatar href="/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff" size=xs][/avatar]
         Group Name Go[/url]    `;
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'url', '0', '0'],
      [TYPE.ATTR_NAME, 'href', '0', '0'],
      [TYPE.ATTR_VALUE, '/groups/123/', '0', '0'],
      [TYPE.ATTR_NAME, 'isNowrap', '0', '0'],
      [TYPE.ATTR_VALUE, 'true', '0', '0'],
      [TYPE.ATTR_NAME, 'isTextOverflow', '0', '0'],
      [TYPE.ATTR_VALUE, 'true', '0', '0'],
      [TYPE.ATTR_NAME, 'state', '0', '0'],
      [TYPE.ATTR_VALUE, 'primary', '0', '0'],
      [TYPE.NEW_LINE, '\n', '0', '0'],
      [TYPE.SPACE, '        ', '0', '0'],
      [TYPE.TAG, 'avatar', '0', '0'],
      [TYPE.ATTR_NAME, 'href', '0', '0'],
      [TYPE.ATTR_VALUE, '/avatar/4/3/b/1606.jpg@20x20?cache=1561462725&bgclr=ffffff', '0', '0'],
      [TYPE.ATTR_NAME, 'size', '0', '0'],
      [TYPE.ATTR_VALUE, 'xs', '0', '0'],
      [TYPE.TAG, '/avatar', '0', '0'],
      [TYPE.NEW_LINE, '\n', '0', '0'],
      [TYPE.SPACE, '         ', '0', '0'],
      [TYPE.WORD, 'Group', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'Name', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'Go', '0', '0'],
      [TYPE.TAG, '/url', '0', '0'],
      [TYPE.SPACE, '    ', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('string with quotemarks', () => {
    const input = '"Someone Like You" by Adele';
    const tokens = tokenize(input);

    const output = [
      [TYPE.WORD, '"Someone', '0', '0'],
      [TYPE.SPACE, ' ', '8', '0'],
      [TYPE.WORD, 'Like', '8', '0'],
      [TYPE.SPACE, ' ', '13', '0'],
      [TYPE.WORD, 'You"', '13', '0'],
      [TYPE.SPACE, ' ', '18', '0'],
      [TYPE.WORD, 'by', '18', '0'],
      [TYPE.SPACE, ' ', '21', '0'],
      [TYPE.WORD, 'Adele', '21', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tags in brakets', () => {
    const input = '[ [h1]G[/h1] ]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.SPACE, ' ', '1', '0'],
      [TYPE.TAG, 'h1', '2', '0'],
      [TYPE.WORD, 'G', '1', '0'],
      [TYPE.TAG, '/h1', '7', '0'],
      [TYPE.SPACE, ' ', '12', '0'],
      [TYPE.WORD, ']', '7', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tag as param', () => {
    const input = '[color="#ff0000"]Text[/color]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'color', '0', '0'],
      [TYPE.ATTR_VALUE, '#ff0000', '6', '0'],
      [TYPE.WORD, 'Text', '17', '0'],
      [TYPE.TAG, '/color', '21', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tag with quotemark params with spaces', () => {
    const input = '[url text="Foo Bar" text2="Foo Bar 2"]Text[/url]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', '0', '0'],
      [TYPE.ATTR_NAME, 'text', '4', '0'],
      [TYPE.ATTR_VALUE, 'Foo Bar', '9', '0'],
      [TYPE.ATTR_NAME, 'text2', '4', '0'],
      [TYPE.ATTR_VALUE, 'Foo Bar 2', '9', '0'],
      [TYPE.WORD, 'Text', '20', '0'],
      [TYPE.TAG, '/url', '24', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tag with escaped quotemark param', () => {
    const input = `[url text="Foo \\"Bar"]Text[/url]`;
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', '0', '0'],
      [TYPE.ATTR_NAME, 'text', '4', '0'],
      [TYPE.ATTR_VALUE, 'Foo "Bar', '9', '0'],
      [TYPE.WORD, 'Text', '22', '0'],
      [TYPE.TAG, '/url', '26', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('tag param without quotemarks', () => {
    const input = '[style color=#ff0000]Text[/style]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'style', '0', '0'],
      [TYPE.ATTR_NAME, 'color', '6', '0'],
      [TYPE.ATTR_VALUE, '#ff0000', '12', '0'],
      [TYPE.WORD, 'Text', '21', '0'],
      [TYPE.TAG, '/style', '25', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('list tag with items', () => {
    const input = `[list]
   [*] Item 1.
   [*] Item 2.
   [*] Item 3.
[/list]`;

    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'list', '0', '0'],
      [TYPE.NEW_LINE, '\n', '6', '0'],
      [TYPE.SPACE, '   ', '0', '1'],
      [TYPE.TAG, '*', '3', '1'],
      [TYPE.SPACE, ' ', '6', '1'],
      [TYPE.WORD, 'Item', '7', '1'],
      [TYPE.SPACE, ' ', '11', '1'],
      [TYPE.WORD, '1.', '11', '1'],
      [TYPE.NEW_LINE, '\n', '14', '1'],
      [TYPE.SPACE, '   ', '0', '2'],
      [TYPE.TAG, '*', '3', '2'],
      [TYPE.SPACE, ' ', '6', '2'],
      [TYPE.WORD, 'Item', '14', '1'],
      [TYPE.SPACE, ' ', '11', '2'],
      [TYPE.WORD, '2.', '11', '2'],
      [TYPE.NEW_LINE, '\n', '14', '2'],
      [TYPE.SPACE, '   ', '0', '3'],
      [TYPE.TAG, '*', '3', '3'],
      [TYPE.SPACE, ' ', '6', '3'],
      [TYPE.WORD, 'Item', '14', '2'],
      [TYPE.SPACE, ' ', '11', '3'],
      [TYPE.WORD, '3.', '11', '3'],
      [TYPE.NEW_LINE, '\n', '14', '3'],
      [TYPE.TAG, '/list', '0', '4'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('few tags without spaces', () => {
    const input = '[mytag1 size="15"]Tag1[/mytag1][mytag2 size="16"]Tag2[/mytag2][mytag3]Tag3[/mytag3]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'mytag1', 0, 0],
      [TYPE.ATTR_NAME, 'size', 0, 0],
      [TYPE.ATTR_VALUE, '15', 0, 0],
      [TYPE.WORD, 'Tag1', 0, 0],
      [TYPE.TAG, '/mytag1', 0, 0],
      [TYPE.TAG, 'mytag2', 0, 0],
      [TYPE.ATTR_NAME, 'size', 0, 0],
      [TYPE.ATTR_VALUE, '16', 0, 0],
      [TYPE.WORD, 'Tag2', 0, 0],
      [TYPE.TAG, '/mytag2', 0, 0],
      [TYPE.TAG, 'mytag3', 0, 0],
      [TYPE.WORD, 'Tag3', 0, 0],
      [TYPE.TAG, '/mytag3', 0, 0],
    ];

    expect(tokens).toBeMantchOutput(output);
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
        [TYPE.WORD, '[', '0', '0'],
        [TYPE.WORD, ']', '0', '0']
      ],
      [
        [TYPE.WORD, '[', '0', '0'],
        [TYPE.WORD, '=]', '0', '0']
      ],
      [
        [TYPE.WORD, '!', '0', '0'],
        [TYPE.WORD, '[', '1', '0'],
        [TYPE.WORD, '](image.jpg)', '1', '0'],
        // [TYPE.WORD, '', '1', '0'],
      ],
      [
        [TYPE.WORD, 'x', '0', '0'],
        [TYPE.SPACE, ' ', '1', '0'],
        [TYPE.WORD, 'html(', '1', '0'],
        [TYPE.TAG, 'a. title', '7', '0'],
        [TYPE.TAG, ', alt', '17', '0'],
        [TYPE.TAG, ', classes', '24', '0'],
        [TYPE.WORD, ')', '7', '0'],
        [TYPE.SPACE, ' ', '36', '0'],
        [TYPE.WORD, 'x', '36', '0'],
      ],
      [
        [TYPE.TAG, '/y', '0', '0']
      ],
      [
        [TYPE.WORD, '[', '0', '0'],
        [TYPE.WORD, 'sc', '0', '0']
      ],
      [
        // [sc /
        [TYPE.WORD, '[', '0', '0'],
        [TYPE.WORD, 'sc', '0', '0'],
        [TYPE.SPACE, ' ', '0', '0'],
        [TYPE.WORD, '/', '0', '0'],
        [TYPE.SPACE, ' ', '0', '0'],
        [TYPE.TAG, '/sc', '0', '0']
      ],
      [
        [TYPE.WORD, '[', '0', '0'],
        [TYPE.WORD, 'sc', '0', '0'],
        [TYPE.SPACE, ' ', '0', '0'],
        [TYPE.WORD, 'arg="val', '0', '0'],
      ]
    ];

    inputs.forEach((input, idx) => {
      const tokens = tokenize(input);
      const output = asserts[idx];

      expect(tokens).toBeMantchOutput(output);
    });
  });

  test('bad unclosed tag', () => {
    const input = `[Finger Part A [Finger]`;
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.WORD, 'Finger', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'Part', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'A', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.TAG, 'Finger', '0', '0']
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('no close tag', () => {
    const input = '[Finger Part A';
    const tokens = tokenize(input);
    const output = [
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.WORD, 'Finger', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'Part', '0', '0'],
      [TYPE.SPACE, ' ', '0', '0'],
      [TYPE.WORD, 'A', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('escaped tag', () => {
    const input = '\\[b\\]test\\[';
    const tokens = tokenizeEscape(input);

    const output = [
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.WORD, 'b', '0', '0'],
      [TYPE.WORD, ']', '0', '0'],
      [TYPE.WORD, 'test', '0', '0'],
      [TYPE.WORD, '[', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('escaped tag and escaped backslash', () => {
    const input = '\\\\\\[b\\\\\\]test\\\\\\[/b\\\\\\]';
    const tokens = tokenizeEscape(input);
    const output = [
      [TYPE.WORD, '\\', '0', '0'],
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.WORD, 'b', '0', '0'],
      [TYPE.WORD, '\\', '0', '0'],
      [TYPE.WORD, ']', '0', '0'],
      [TYPE.WORD, 'test', '0', '0'],
      [TYPE.WORD, '\\', '0', '0'],
      [TYPE.WORD, '[', '0', '0'],
      [TYPE.WORD, '/b', '0', '0'],
      [TYPE.WORD, '\\', '0', '0'],
      [TYPE.WORD, ']', '0', '0'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  test('bad closed tag with escaped backslash', () => {
    const input = `[b]test[\\b]`;
    const tokens = tokenizeEscape(input);
    const output = [
      [TYPE.TAG, 'b', '0', '3'],
      [TYPE.WORD, 'test', '0', '7'],
      [TYPE.WORD, '[', '0', '8'],
      [TYPE.WORD, '\\', '0', '9'],
      [TYPE.WORD, 'b]', '0', '11'],
    ];

    expect(tokens).toBeMantchOutput(output);
  });

  describe('html', () => {
    const tokenizeHTML = input => createLexer(input, { openTag: '<', closeTag: '>' }).tokenize();

    test('normal attributes', () => {
      const content = `<button id="test0" class="value0" title="value1">class="value0" title="value1"</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 2, 0],
        [TYPE.ATTR_NAME, 'id', 2, 0],
        [TYPE.ATTR_VALUE, 'test0', 2, 0],
        [TYPE.ATTR_NAME, 'class', 2, 0],
        [TYPE.ATTR_VALUE, 'value0', 2, 0],
        [TYPE.ATTR_NAME, 'title', 2, 0],
        [TYPE.ATTR_VALUE, 'value1', 2, 0],
        [TYPE.WORD, "class=\"value0\"", 2, 0],
        [TYPE.SPACE, " ", 2, 0],
        [TYPE.WORD, "title=\"value1\"", 2, 0],
        [TYPE.TAG, '/button', 2, 0]
      ];

      expect(tokens).toBeMantchOutput(output);
    });

    test('attributes with no quotes or value', () => {
      const content = `<button id="test1" class=value2 disabled>class=value2 disabled</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 2, 0],
        [TYPE.ATTR_NAME, 'id', 2, 0],
        [TYPE.ATTR_VALUE, 'test1', 2, 0],
        [TYPE.ATTR_NAME, 'class', 2, 0],
        [TYPE.ATTR_VALUE, 'value2', 2, 0],
        [TYPE.ATTR_VALUE, 'disabled', 2, 0],
        [TYPE.WORD, "class=value2", 2, 0],
        [TYPE.SPACE, " ", 2, 0],
        [TYPE.WORD, "disabled", 2, 0],
        [TYPE.TAG, '/button', 2, 0]
      ];

      expect(tokens).toBeMantchOutput(output);
    });

    test('attributes with no space between them. No valid, but accepted by the browser', () => {
      const content = `<button id="test2" class="value4"title="value5">class="value4"title="value5"</button>`;
      const tokens = tokenizeHTML(content);
      const output = [
        [TYPE.TAG, 'button', 2, 0],
        [TYPE.ATTR_NAME, 'id', 2, 0],
        [TYPE.ATTR_VALUE, 'test2', 2, 0],
        [TYPE.ATTR_NAME, 'class', 2, 0],
        [TYPE.ATTR_VALUE, 'value4', 2, 0],
        [TYPE.ATTR_NAME, 'title', 2, 0],
        [TYPE.ATTR_VALUE, 'value5', 2, 0],
        [TYPE.WORD, "class=\"value4\"title=\"value5\"", 2, 0],
        [TYPE.TAG, '/button', 2, 0]
      ];

      expect(tokens).toBeMantchOutput(output);
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
</style>`
      const tokens = tokenizeHTML(content);
      const output = [];

      expect(tokens).toBeMantchOutput(output);
    });

    test.skip('script tag', () => {
      const content = `<script language="JavaScript" type="text/javascript">
		<!--//
		if ((navigator.platform=='MacPPC')&&(navigator.appVersion.substr(17,8) != "MSIE 5.0")) {document.write('<LINK rel="stylesheet" href="styles/main-3.css" type="text/css">')}
		if (screen.width > 1200)	{document.write('<LINK rel="stylesheet" href="styles/main-3.css" type="text/css">')}
		//-->
	</script>`;
      const tokens = tokenizeHTML(content);
      const output = [];

      expect(tokens).toBeMantchOutput(output);
    })
  })
});

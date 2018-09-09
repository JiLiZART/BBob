const Token = require('../src/Token');
const { createLexer } = require('../src/lexer');

const TYPE = {
  WORD: Token.TYPE_WORD,
  TAG: Token.TYPE_TAG,
  ATTR_NAME: Token.TYPE_ATTR_NAME,
  ATTR_VALUE: Token.TYPE_ATTR_VALUE,
  SPACE: Token.TYPE_SPACE,
  NEW_LINE: Token.TYPE_NEW_LINE,
};

const tokenize = input => (createLexer(input).tokenize());

describe('lexer', () => {
  const expectOutput = (output, tokens) => {
    expect(tokens).toBeInstanceOf(Array);
    output.forEach((token, idx) => {
      expect(tokens[idx]).toBeInstanceOf(Object);
      expect(tokens[idx].type).toEqual(token[0]);
      expect(tokens[idx].value).toEqual(token[1]);
    });
  };

  test('tokenize single tag', () => {
    const input = '[SingleTag]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'SingleTag', '0', '0'],
    ];

    expectOutput(output, tokens);
  });

  test('tokenize single tag with spaces', () => {
    const input = '[Single Tag]';
    const tokens = tokenize(input);

    const output = [
      [TYPE.TAG, 'Single Tag', '0', '0'],
    ];

    expectOutput(output, tokens);
  });

  test('tokenize string with quotemarks', () => {
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

    expectOutput(output, tokens);
  });

  test('tokenize tags in brakets', () => {
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

    expectOutput(output, tokens);
  });

  test('tokenize tag as param', () => {
    const input = '[color="#ff0000"]Text[/color]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'color', '0', '0'],
      [TYPE.ATTR_VALUE, '#ff0000', '6', '0'],
      [TYPE.WORD, 'Text', '17', '0'],
      [TYPE.TAG, '/color', '21', '0'],
    ];

    expectOutput(output, tokens);
  });

  test('tokenize tag with quotemark params with spaces', () => {
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

    expectOutput(output, tokens);
  });

  test('tokenize tag with escaped quotemark param', () => {
    const input = `[url text="Foo \\"Bar"]Text[/url]`;
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'url', '0', '0'],
      [TYPE.ATTR_NAME, 'text', '4', '0'],
      [TYPE.ATTR_VALUE, 'Foo "Bar', '9', '0'],
      [TYPE.WORD, 'Text', '22', '0'],
      [TYPE.TAG, '/url', '26', '0'],
    ];

    expectOutput(output, tokens);
  });

  test('tokenize tag param without quotemarks', () => {
    const input = '[style color=#ff0000]Text[/style]';
    const tokens = tokenize(input);
    const output = [
      [TYPE.TAG, 'style', '0', '0'],
      [TYPE.ATTR_NAME, 'color', '6', '0'],
      [TYPE.ATTR_VALUE, '#ff0000', '12', '0'],
      [TYPE.WORD, 'Text', '21', '0'],
      [TYPE.TAG, '/style', '25', '0'],
    ];

    expectOutput(output, tokens);
  });

  test('tokenize list tag with items', () => {
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

    expectOutput(output, tokens);
  });

  test('tokenize bad tags as texts', () => {
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
        [TYPE.WORD, ']', '1', '0'],
        [TYPE.WORD, '(image.jpg)', '1', '0'],
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
        [TYPE.TAG, 'sc', '0', '0']
      ],
      [
        [TYPE.TAG, 'sc / [/sc', '0', '0']
      ],
      [
        [TYPE.TAG, 'sc', '0', '0'],
        [TYPE.ATTR_NAME, 'arg', '0', '0'],
        [TYPE.ATTR_VALUE, 'val', '0', '0']
      ]
    ];

    inputs.forEach((input, idx) => {
      const tokens = tokenize(input);

      expectOutput(asserts[idx], tokens);
    });
  });
});

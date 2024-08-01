import Token, { TYPE_WORD, TYPE_TAG, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_SPACE, TYPE_NEW_LINE } from '../src/Token';

describe('Token', () => {
  test('isEmpty', () => {
    const token = new Token();

    expect(token.isEmpty()).toBeTruthy();
  });
  test('isText', () => {
    const token = new Token(TYPE_WORD);

    expect(token.isText()).toBeTruthy();
  });
  test('isTag', () => {
    const token = new Token(TYPE_TAG);

    expect(token.isTag()).toBeTruthy();
  });
  test('isAttrName', () => {
    const token = new Token(TYPE_ATTR_NAME);

    expect(token.isAttrName()).toBeTruthy();
  });
  test('isAttrValue', () => {
    const token = new Token(TYPE_ATTR_VALUE);

    expect(token.isAttrValue()).toBeTruthy();
  });
  test('isStart', () => {
    const token = new Token(TYPE_TAG, 'my-tag');

    expect(token.isStart()).toBeTruthy();
  });
  test('isEnd', () => {
    const token = new Token(TYPE_TAG, '/my-tag');

    expect(token.isEnd()).toBeTruthy();
  });
  test('getName', () => {
    const token = new Token(TYPE_TAG, '/my-tag');

    expect(token.getName()).toBe('my-tag');
  });
  test('getValue', () => {
    const token = new Token(TYPE_TAG, '/my-tag');

    expect(token.getValue()).toBe('/my-tag');
  });
  test('getLine', () => {
    const token = new Token(TYPE_TAG, '/my-tag', 12);

    expect(token.getLine()).toBe(12);
  });
  test('getColumn', () => {
    const token = new Token(TYPE_TAG, '/my-tag', 12, 14);

    expect(token.getColumn()).toBe(14);
  });
  test('getStartPos', () => {
    const token = new Token(TYPE_TAG, 'my-tag', 12, 14, 50);

    expect(token.getStart()).toBe(50);
  });
  test('getEndPos', () => {
    const token = new Token(TYPE_TAG, 'my-tag', 12, 14, 50, 60);

    expect(token.getEnd()).toBe(60);
  });
  test('toString', () => {
    const tokenEnd = new Token(TYPE_TAG, '/my-tag', 12, 14);

    expect(tokenEnd.toString()).toBe('[/my-tag]');

    const tokenStart = new Token(TYPE_TAG, 'my-tag', 12, 14);

    expect(tokenStart.toString()).toBe('[my-tag]');
  });
});

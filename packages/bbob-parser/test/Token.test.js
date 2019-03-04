import Token from '../src/Token'

describe('Token', () => {
  test('isEmpty', () => {
    const token = new Token();

    expect(token.isEmpty()).toBeTruthy()
  });
  test('isText', () => {
    const token = new Token('word');

    expect(token.isText()).toBeTruthy();
  });
  test('isTag', () => {
    const token = new Token('tag');

    expect(token.isTag()).toBeTruthy();
  });
  test('isAttrName', () => {
    const token = new Token('attr-name');

    expect(token.isAttrName()).toBeTruthy();
  });
  test('isAttrValue', () => {
    const token = new Token('attr-value');

    expect(token.isAttrValue()).toBeTruthy();
  });
  test('isStart', () => {
    const token = new Token('tag', 'my-tag');

    expect(token.isStart()).toBeTruthy();
  });
  test('isEnd', () => {
    const token = new Token('tag', '/my-tag');

    expect(token.isEnd()).toBeTruthy();
  });
  test('getName', () => {
    const token = new Token('tag', '/my-tag');

    expect(token.getName()).toBe('my-tag');
  });
  test('getValue', () => {
    const token = new Token('tag', '/my-tag');

    expect(token.getValue()).toBe('/my-tag');
  });
  test('getLine', () => {
    const token = new Token('tag', '/my-tag', 12);

    expect(token.getLine()).toBe(12);
  });
  test('getColumn', () => {
    const token = new Token('tag', '/my-tag', 12, 14);

    expect(token.getColumn()).toBe(14);
  });
  test('toString', () => {
    const tokenEnd = new Token('tag', '/my-tag', 12, 14);

    expect(tokenEnd.toString()).toBe('[/my-tag]');

    const tokenStart = new Token('tag', 'my-tag', 12, 14);

    expect(tokenStart.toString()).toBe('[my-tag]');
  });
});

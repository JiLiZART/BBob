import {
  attrsToString,
  attrValue,
  appendToNode,
  getNodeLength,
  getUniqAttr,
  isTagNode,
  isStringNode,
  isEOL,
} from '../src';

describe('@bbob/plugin-helper/helpers', () => {
  test('appendToNode', () => {
    const value = 'test';
    const node = { content: [] };

    appendToNode(node, value);
    expect(node.content.pop()).toBe(value);
  });

  test('getNodeLength', () => {
    const node = {
      tag: 'test',
      content: [
        '123',
        {
          tag: 'test2',
          content: ['123']
        }
      ]
    };

    expect(getNodeLength(node)).toBe(6)
  });

  test('isTagNode', () => {
    const node = {
      tag: 'test',
      content: []
    };

    expect(isTagNode(node)).toBe(true)
  });

  test('isStringNode', () => {
    const node = {
      tag: 'test',
      content: ['123']
    };

    expect(isStringNode(node.content[0])).toBe(true);
  });

  test('attrValue boolean', () => {
    expect(attrValue('test', true)).toBe('test');
  });

  test('attrValue number', () => {
    expect(attrValue('test', 123)).toBe('test="123"');
  });

  test('attrValue string', () => {
    expect(attrValue('test', 'hello')).toBe('test="hello"');
  });

  test('attrValue object', () => {
    const attrs = { tag: 'test' };

    expect(attrValue('test', attrs)).toBe('test="{&quot;tag&quot;:&quot;test&quot;}"');
  });

  test('isEOL', () => {
    expect(isEOL('\n')).toBe(true)
  });

  test('attrsToString', () => {
    expect(attrsToString({
      tag: 'test',
      foo: 'bar',
      disabled: true
    })).toBe(` tag="test" foo="bar" disabled`)
  });

  test('attrsToString undefined', () => {
    expect(attrsToString(undefined)).toBe('')
  });

  describe('attrsToString escape', () => {
    test(`javascript:alert("hello")`, () => {
      expect(attrsToString({
        onclick: `javascript:alert('hello')`,
        href: `javascript:alert('hello')`,
      })).toBe(` onclick="javascript%3Aalert(&#039;hello&#039;)" href="javascript%3Aalert(&#039;hello&#039;)"`)
    });
    test(`JAVASCRIPT:alert("hello")`, () => {
      expect(attrsToString({
        onclick: `JAVASCRIPT:alert('hello')`,
        href: `JAVASCRIPT:alert('hello')`,
      })).toBe(` onclick="JAVASCRIPT%3Aalert(&#039;hello&#039;)" href="JAVASCRIPT%3Aalert(&#039;hello&#039;)"`)
    });
    test(`<tag>`, () => {
      expect(attrsToString({
        onclick: `<tag>`,
        href: `<tag>`,
      })).toBe(` onclick="&lt;tag&gt;" href="&lt;tag&gt;"`)
    });
  });

  test('getUniqAttr with unq attr', () => {
    expect(getUniqAttr({foo: true, 'http://bar.com': 'http://bar.com'})).toBe('http://bar.com')
  });

  test('getUniqAttr without unq attr', () => {
    expect(getUniqAttr({foo: true})).toBe(null)
  })
});

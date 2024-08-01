import { TagNode } from '../src'

describe('@bbob/plugin-helper/TagNode', () => {
  test('create', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello'], {from: 0, to: 10});

    expect(tagNode).toBeInstanceOf(TagNode)
  });

  test('isOf', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(TagNode.isOf(tagNode, 'test')).toBe(true);
  });

  test('attr', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    tagNode.attr('foo', 'bar')

    expect(tagNode.attrs.foo).toBe('bar');
  });

  test('append', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    tagNode.append('World')

    expect(tagNode.content).toEqual(['Hello', 'World']);
  });

  test('length', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello', 'World']);

    expect(tagNode.length).toEqual('HelloWorld'.length);
  });

  test('toTagNode', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello'], {from: 0, to: 10});
    tagNode.setEnd({from: 20, to: 27});
    const newTagNode = tagNode.toTagNode()

    expect(newTagNode !== tagNode).toBe(true);
    expect(newTagNode.tag).toEqual(tagNode.tag);
    expect(newTagNode.content).toEqual(tagNode.content);
    expect(newTagNode.start).toEqual(tagNode.start);
    expect(newTagNode.end).toEqual(tagNode.end);
  });

  test('null content', () => {
    const tagNode = TagNode.create('img');

    expect(String(tagNode)).toBe('[img]');
  });

  test('array content', () => {
    const tagNode = TagNode.create('img', {}, []);

    expect(String(tagNode)).toBe('[img]');
  });

  test('setStart', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);
    tagNode.setStart({from: 0, to: 10});

    expect(tagNode.start).toEqual({from: 0, to: 10});
  });

  test('setEnd', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);
    tagNode.setEnd({from: 20, to: 27});

    expect(tagNode.end).toEqual({from: 20, to: 27});
  });

  describe('toString', () => {
    test('tag with content and params', () => {
      const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

      expect(String(tagNode)).toBe('[test test="1"]Hello[/test]');
    });

    test('tag with content and uniq attr', () => {
      const tagNode = TagNode.create('test', {test: 'test'}, ['Hello']);

      expect(String(tagNode)).toBe('[test="test"]Hello[/test]');
    });

    test('tag without content', () => {
      const tagNode = TagNode.create('test');

      expect(String(tagNode)).toBe('[test]');
    });

    test('tag without content', () => {
      const tagNode = TagNode.create('test', {}, 'Content');

      expect(String(tagNode)).toBe('[test]Content[/test]');
    });

    test('tag with snakeCase', () => {
      const tagNode = TagNode.create('snakeCaseTag');

      expect(String(tagNode)).toBe('[snakeCaseTag]');
    });
  })
});

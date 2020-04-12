import TagNode from '../src/TagNode'

describe('@bbob/plugin-helper/lib/TagNode', () => {
  test('create', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(tagNode).toBeInstanceOf(TagNode)
  });

  test('isOf', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(TagNode.isOf(tagNode, 'test')).toBe(true);
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

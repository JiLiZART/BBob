const TagNode = require('../lib/TagNode');

describe('@bbob/plugin-helper/lib/TagNode', () => {
  test('create', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(tagNode).toBeInstanceOf(TagNode)
  });

  test('isOf', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(TagNode.isOf(tagNode, 'test')).toBe(true);
  });

  test('toString', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(String(tagNode)).toBe('[test]Hello[/test]');
  });
});

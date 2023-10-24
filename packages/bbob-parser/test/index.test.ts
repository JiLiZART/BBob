import { TagNode } from "../src/index";

describe('index', () => {
  test('tag with content and params', () => {
    const tagNode = TagNode.create('test', {test: 1}, ['Hello']);

    expect(String(tagNode)).toBe('[test test="1"]Hello[/test]');
  });
})

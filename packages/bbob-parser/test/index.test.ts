import { TagNode } from "../src/index";

describe('index', () => {
  test('tag with content and params', () => {
    const attrs = {test: 1}
    const tagNode = TagNode.create('test', attrs, ['Hello']);

    expect(String(tagNode)).toBe('[test test="1"]Hello[/test]');
  });
})

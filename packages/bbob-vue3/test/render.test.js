import { render } from "../src";

describe('@bbob/vue3 render', () => {

  const createElement = (tagName, props, children) => {
    return { tagName, props, children }
  }

  test('render simple b tag', () => {
    const html = render(createElement, '[b]bolded text[/b]');

    expect(html).toStrictEqual([
      {
        "children": ["bolded", " ", "text"],
        "props": { "class": undefined, "key": 0, "style": undefined },
        "tagName": "b"
      }
    ])
  })
  test('render self closed b tag', () => {
    const html = render(createElement, '[b][/b]');

    expect(html).toStrictEqual([
      {
        "children": undefined,
        "props": { "class": undefined, "key": 0, "style": undefined },
        "tagName": "b"
      }
    ])
  })
  test('render simple text nodes', () => {
    const html = render(createElement, 'some example words');

    expect(html).toStrictEqual([
      "some", " ", "example", " ", "words"
    ])
  })
})

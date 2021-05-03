import preset, { createTags, tagAttr } from '../src'

describe('@bbob/preset-vue', () => {
  test('is a function', () => {
    expect(preset).toBeInstanceOf(Function)
  })

  test('createTags', () => {
    const defFn = jest.fn(() => ({}))
    const defTags = {
      b: defFn,
      i: defFn,
      u: defFn,
      s: defFn,
    }
    const tags = createTags(defTags)

    expect(tags.b()).toEqual(tagAttr({ fontWeight: 'bold' }))
    expect(tags.i()).toEqual(tagAttr({ fontStyle: 'italic' }))
    expect(tags.u()).toEqual(tagAttr({ textDecoration: 'underline' }))
    expect(tags.s()).toEqual(tagAttr({ textDecoration: 'line-through' }))
  })
});

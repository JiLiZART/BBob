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
    const args = [{tag: 'test'}]

    expect(tags.b?.({tag: 'b'}, ...args)).toEqual(tagAttr({ fontWeight: 'bold' }))
    expect(tags.i?.({tag: 'i'}, ...args)).toEqual(tagAttr({ fontStyle: 'italic' }))
    expect(tags.u?.({tag: 'u'}, ...args)).toEqual(tagAttr({ textDecoration: 'underline' }))
    expect(tags.s?.({tag: 's'}, ...args)).toEqual(tagAttr({ textDecoration: 'line-through' }))
  })
});

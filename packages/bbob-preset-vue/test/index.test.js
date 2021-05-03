import preset, { createTags } from '../src'

describe('@bbob/preset-vue', () => {
  test('is a function', () => {
    expect(preset).toBeInstanceOf(Function)
  })

  test('createTags', () => {
    const tags = createTags()

    expect(tags.b).toBeInstanceOf(Function)
    expect(tags.i).toBeInstanceOf(Function)
    expect(tags.u).toBeInstanceOf(Function)
    expect(tags.s).toBeInstanceOf(Function)
  })
});

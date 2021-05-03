import { createPreset } from '../src/index';

describe('@bbob/preset', () => {
  const presetFactory = (defTags) => {
    const processor = jest.fn((tags, tree, core, options) => tags)

    return [createPreset(defTags, processor), processor];
  }

  test('create', () => {
    const defTags = { test: true }
    const options = { foo: 'bar' }
    const tree = []
    const [preset, processor] = presetFactory(defTags);

    expect(preset.extend)
      .toBeDefined();
    expect(preset)
      .toBeInstanceOf(Function);

    expect(preset(options)(tree)).toEqual(defTags);

    expect(processor.mock.calls.length).toBe(1);
  });
  test('extend', () => {
    const defTags = { foo: true }
    const extendedTags = { bar: true }
    const options = { foo: 'bar' }
    const tree = []
    const [preset, processor] = presetFactory(defTags);
    const newPreset = preset.extend(tags => ({ ...tags, ...extendedTags }));

    expect(preset)
      .toBeInstanceOf(Function);
    expect(newPreset)
      .toBeInstanceOf(Function);

    expect(newPreset(options)(tree)).toEqual({...defTags, ...extendedTags});

    expect(processor.mock.calls.length).toBe(1);
  });
  test('pass options', () => {
    const [preset, processor] = presetFactory({ test: true });
    const newPreset = preset.extend((tags, options) => ({ bar: true }));

    const instance = preset({ foo: 'bar' });
    const instance2 = newPreset({ some: true });

    expect(instance.options)
      .toEqual({ foo: 'bar' });
    expect(instance2.options)
      .toEqual({ some: true });
  });
});

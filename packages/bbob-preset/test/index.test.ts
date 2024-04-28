import { createPreset, PresetTagsDefinition } from '../src';
import { BBobCoreOptions, createTree } from '@bbob/core'

describe('@bbob/preset', () => {
  const presetFactory = <Tags extends PresetTagsDefinition = PresetTagsDefinition>(defTags: Tags) => {
    const processor = jest.fn((tags, tree, core, options) => tags)
    const preset = createPreset<Tags>(defTags, processor)

    return {
      preset,
      processor,
      core: {} as BBobCoreOptions
    }
  }

  test('create', () => {
    const defTags = { test: () => ({ tag: 'test' }) }
    const options = { foo: 'bar' }
    const tree = createTree([], {})
    const { preset, processor } = presetFactory(defTags);

    expect(preset.extend)
      .toBeDefined();
    expect(preset)
      .toBeInstanceOf(Function);

    expect(preset(options)(tree)).toEqual(defTags);

    expect(processor.mock.calls.length).toBe(1);
  });
  test('extend', () => {
    const defTags = { foo: () => ({ tag: 'foo'}) }
    const extendedTags = { bar: () =>({tag:  'bar'}) }
    const options = { foo: 'bar' }
    const tree = createTree([], {})
    const { preset, processor, core } = presetFactory(defTags);
    const newPreset = preset.extend(tags => ({ ...tags, ...extendedTags }));

    expect(preset)
      .toBeInstanceOf(Function);
    expect(newPreset)
      .toBeInstanceOf(Function);

    const newPresetRes = newPreset(options)

    expect(newPresetRes(tree)).toEqual({...defTags, ...extendedTags});

    expect(processor.mock.calls.length).toBe(1);
  });
  test('pass options', () => {
    const { preset } = presetFactory({ test: () => ({tag: 'test'}) });
    const newPreset = preset.extend((tags, options) => ({ bar: () => ({tag: 'bar'}) }));

    const instance = preset({ foo: 'bar' });
    const instance2 = newPreset({ some: 'some' });

    expect(instance.options)
      .toEqual({ foo: 'bar' });
    expect(instance2.options)
        .toEqual({ some: 'some' })
  });
});

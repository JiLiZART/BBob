import { createPreset } from '../src/index';

describe('@bbob/preset', () => {
  test('create', () => {
    const preset = createPreset({ test: true });

    expect(preset.extend)
      .toBeDefined();
    expect(preset)
      .toBeInstanceOf(Function);
  });
  test('extend', () => {
    const preset = createPreset({ foo: true });
    const newPreset = preset.extend(props => ({ bar: true }));

    expect(preset)
      .toBeInstanceOf(Function);
    expect(newPreset)
      .toBeInstanceOf(Function);
  });
  test('pass options', () => {
    const preset = createPreset({ test: true });
    const newPreset = preset.extend((props, options) => ({ bar: true }));

    const instance = preset({ foo: 'bar' });
    const instance2 = newPreset({ some: true });

    expect(instance.options)
      .toEqual({ foo: 'bar' });
    expect(instance2.options)
      .toEqual({ some: true });
  });
});

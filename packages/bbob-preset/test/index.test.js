import {createPreset} from "../src/index";

describe('@bbob/preset', () => {
  test('create', () => {
    const preset = createPreset({ test: true });

    expect(preset.extend).toBeDefined();
    expect(preset).toBeInstanceOf(Function);
  });
  test('extend', () => {
    const preset = createPreset({ foo: true });
    const newPreset = preset.extend(props => ({ bar: true }));

    expect(preset).toBeInstanceOf(Function);
    expect(newPreset).toBeInstanceOf(Function);
  });
});

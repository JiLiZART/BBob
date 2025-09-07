import { testEnvironment } from 'jest.config';
import preset from '../src'

describe('@bbob/preset-react', () => {
  test('is a function', () => {
    expect(preset).toBeInstanceOf(Function)
  })

  test('is parses color tag correctly', () => {
    const fn = preset();

    const result = fn.tags.color?.({ tag: 'color', attrs: { color: 'red' } });
    
    expect(result).toEqual({
      tag: 'span',
      attrs: { style: { color: 'red' } },
      children: [],
    });
  });
});

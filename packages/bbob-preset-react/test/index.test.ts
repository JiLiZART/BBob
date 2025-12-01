import bbob from '@bbob/core';
import preset from '../src'

const instance = bbob(preset())

const createTag = (content: string[], style: Record<string, string>) => {
  return {
    "attrs": { "style": style },
    "content": content,
    "tag": "span",
    "end": undefined,
    "start": undefined,
  }
}

describe('@bbob/preset-react', () => {
  test('is a function', () => {
    expect(preset).toBeInstanceOf(Function)
  })

  test('is parses [b] tag correctly', () => {
    const res = instance.process('[b]bold[/b]')
    const tags = [...res.tree]

    expect(tags).toEqual([createTag(["bold"], { fontWeight: 'bold' })]);
  });
  test('is parses [i] tag correctly', () => {
    const res = instance.process('[i]italic[/i]')
    const tags = [...res.tree]

    expect(tags).toEqual([createTag(["italic"], { fontStyle: 'italic' })]);
  });
  test('is parses [u] tag correctly', () => {
    const res = instance.process('[u]underline[/u]')
    const tags = [...res.tree]

    expect(tags).toEqual([createTag(["underline"], { textDecoration: 'underline' })]);
  });
  test('is parses [s] tag correctly', () => {
    const res = instance.process('[s]strike[/s]')
    const tags = [...res.tree]

    expect(tags).toEqual([createTag(["strike"], { textDecoration: 'line-through' })]);
  });
  test('is parses [color] tag correctly', () => {
    const res = instance.process('[color=#ff0000]This text should be red[/color]')
    const tags = [...res.tree]

    expect(tags).toEqual([createTag(["This", " ", "text", " ", "should", " ", "be", " ", "red"], { color: '#ff0000' })]);
  });
});

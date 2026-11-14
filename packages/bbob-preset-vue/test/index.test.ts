import bbob from '@bbob/core';
import type { PresetTagFunction } from "@bbob/types";

import preset, { createTags, tagAttr } from '../src'

const tagFactory = (tag: string): PresetTagFunction => jest.fn((...args) => ({ tag }))
const createTag = (tag: string, style: Record<string, string>) => ({ tag, ...tagAttr(style)})

describe('@bbob/preset-vue', () => {
  test('is a function', () => {
    expect(preset).toBeInstanceOf(Function)
  })

  test('createTags', () => {
    const defTags = {
      b: tagFactory('b'),
      i: tagFactory('i'),
      u: tagFactory('u'),
      s: tagFactory('s'),
    }
    const tags = createTags(defTags)
    const args = [{tag: 'test'}]

    expect(tags.b?.({tag: 'b'}, ...args)).toEqual(createTag('b',{ fontWeight: 'bold' }))
    expect(tags.i?.({tag: 'i'}, ...args)).toEqual(createTag('i',{ fontStyle: 'italic' }))
    expect(tags.u?.({tag: 'u'}, ...args)).toEqual(createTag('u',{ textDecoration: 'underline' }))
    expect(tags.s?.({tag: 's'}, ...args)).toEqual(createTag('s',{ textDecoration: 'line-through' }))
  })

  test('GHSA-69g8-5v35-g33w: [img] drops non allow-listed attributes', () => {
    const res = bbob(preset()).process('[img width=10 onerror="alert(1)" onLoad="alert(1)"]x[/img]', {
      render: (content) => String(content),
    })
    const [img] = [...res.tree] as { tag: string, attrs: Record<string, unknown> }[]

    expect(img.tag).toBe('img')
    expect(img.attrs).toEqual({ width: '10', src: 'x' })
  });
});

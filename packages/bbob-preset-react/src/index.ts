import presetHTML5 from '@bbob/preset-html5';
import type { PresetTagsDefinition } from '@bbob/preset';

const tagAttr = (style: Record<string, string>) => ({
  attrs: {
    style,
  },
});

export default presetHTML5.extend((tags: PresetTagsDefinition<'b' | 'i' | 'u' | 's'>) => ({
  ...tags,

  b: (...args) => ({
    ...tags.b(...args),
    ...tagAttr({ fontWeight: 'bold' }),
  }),

  i: (...args) => ({
    ...tags.i(...args),
    ...tagAttr({ fontStyle: 'italic' }),
  }),

  u: (...args) => ({
    ...tags.u(...args),
    ...tagAttr({ textDecoration: 'underline' }),
  }),

  s: (...args) => ({
    ...tags.s(...args),
    ...tagAttr({ textDecoration: 'line-through' }),
  }),
}));

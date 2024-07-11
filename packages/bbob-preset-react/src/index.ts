import presetHTML5 from '@bbob/preset-html5';

import type { PresetTagsDefinition } from '@bbob/types';

const tagAttr = (style: Record<string, string>) => ({
  attrs: {
    style,
  },
});

const presetReact = presetHTML5.extend<PresetTagsDefinition>((tags) => ({
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

export default presetReact;

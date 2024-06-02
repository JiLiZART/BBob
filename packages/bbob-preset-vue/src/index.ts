import presetHTML5 from '@bbob/preset-html5';

import type { PresetTagsDefinition } from '@bbob/types';

export const tagAttr = (style: Record<string, string>) => ({
  attrs: {
    style,
  },
});

export const createTags = (tags: PresetTagsDefinition<string>) => {
  const newTags: PresetTagsDefinition<string> = {
    b: (...args) => ({
      ...tags.b?.(...args),
      ...tagAttr({ fontWeight: 'bold' }),
    }),

    i: (...args) => ({
      ...tags.i?.(...args),
      ...tagAttr({ fontStyle: 'italic' }),
    }),

    u: (...args) => ({
      ...tags.u?.(...args),
      ...tagAttr({ textDecoration: 'underline' }),
    }),

    s: (...args) => ({
      ...tags.s?.(...args),
      ...tagAttr({ textDecoration: 'line-through' }),
    }),
  }

  return newTags
};

const presetVue = presetHTML5.extend((tags: PresetTagsDefinition<string>) => ({
  ...tags,
  ...createTags(tags),
}));

export default presetVue;

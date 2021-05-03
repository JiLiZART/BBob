import presetHTML5 from '@bbob/preset-html5';

const tagAttr = (style) => ({
  attrs: {
    style,
  },
});

export const createTags = (tags) => ({
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
});

export default presetHTML5.extend((tags) => ({
  ...tags,
  ...createTags(tags),
}));

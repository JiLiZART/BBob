import presetHTML5 from '@bbob/preset-html5';

export default presetHTML5.extend(tags => ({
  ...tags,

  b: (...args) => ({
    ...tags.b(...args),
    attrs: {
      style: { fontWeight: 'bold' },
    },
  }),

  i: (...args) => ({
    ...tags.b(...args),
    attrs: {
      style: { fontStyle: 'italic' },
    },
  }),

  u: (...args) => ({
    ...tags.b(...args),
    attrs: {
      style: { textDecoration: 'underline' },
    },
  }),

  s: (...args) => ({
    ...tags.b(...args),
    attrs: {
      style: { textDecoration: 'line-through' },
    },
  }),
}));

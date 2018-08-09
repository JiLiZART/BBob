const presetHTML5 = require('@bbob/preset-html5');

module.exports = presetHTML5.extend(tags => ({
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

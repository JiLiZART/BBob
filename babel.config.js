module.exports = {
  presets: [
    '@babel/preset-react',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            targets: {
              node: true,
            },
          },
        ],
      ],
    },
    // src/index.js ==> lib/index.js
    commonjs: {
      presets: [
        [
          '@babel/preset-env',
          { loose: true, modules: 'commonjs' },
        ],
      ],
    },
    // src/index.js ==> es/index.js
    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            targets: {
              esmodules: true,
            },
          },
        ],
      ],
    },
    // src/index.js ==> dist/index.js
    rollup: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true,
            targets: '> 0.25%, not dead',
          },
        ],
      ],
    },
  },
};

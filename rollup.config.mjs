import { defineConfig } from 'rollup';

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import { minify } from 'rollup-plugin-swc3'

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(`${process.cwd()}/package.json`);
const { NODE_ENV } = process.env;

const baseConfig = {
  input: pkg.module,
  external: ['react', 'vue', 'prop-types'],
  output: {
    file: pkg.browser,
    name: pkg.browserName,
    format: 'umd',
    exports: 'named',
    globals: {
      react: 'React',
      vue: 'Vue',
      'prop-types': 'PropTypes',
    },
  },
  plugins: [
    resolve(),
    commonjs({
      transformMixedEsModules: true,
      requireReturnsDefault: true,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ],
};

// only for dist
export default defineConfig([
  baseConfig,
  {
    ...baseConfig,
    output: {
      ...baseConfig.output,
      file: pkg.browser.replace('.js', '.min.js'),
    },
    plugins: [
      ...baseConfig.plugins,
      minify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          inline: true,
          keep_classnames: true,
        },
      }),
    ],
  },
]);

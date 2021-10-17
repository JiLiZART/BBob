import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import swc from 'rollup-plugin-swc';

const pkg = require(`${process.cwd()}/package.json`);
const { NODE_ENV } = process.env;

const baseConfig = {
  input: 'src/index.js',
  external: ['react', 'vue'],
  output: {
    file: pkg.browser,
    format: 'umd',
    name: pkg.browserName,
    exports: 'named',
    globals: {
      react: 'React',
      vue: 'Vue',
    },
  },
  plugins: [
    resolve(),
    swc(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    commonjs(),
    // gzip(),
  ],
};

// only for dist
export default [
  baseConfig,
  {
    ...baseConfig,
    output: {
      ...baseConfig.output,
      file: pkg.browser.replace('.js', '.min.js'),
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
];

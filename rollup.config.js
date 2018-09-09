import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const pkg = require(`${process.cwd()}/package.json`);
const env = process.env.NODE_ENV;

const globals = {
  react: 'React',
  vue: 'Vue',
};
const external = ['react', 'vue'];

const input = 'src/index.js';

const plugins = [
  nodeResolve(),
  babel({
    exclude: '**/node_modules/**',
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  commonjs(),
];


export default [
  {
    input,
    external,
    output: {
      file: pkg.browser,
      format: 'umd',
      name: pkg.browserName,
      globals: {
        react: 'React',
        vue: 'Vue',
      },
    },
    plugins,
  },
  {
    input,
    external,
    output: {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name: pkg.browserName,
      globals,
    },
    plugins: [
      ...plugins,
      uglify({
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

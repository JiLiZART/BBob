import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import gzip from 'rollup-plugin-gzip';
// import swc from 'rollup-plugin-swc';

const pkg = require(`${process.cwd()}/package.json`);
const { NODE_ENV } = process.env;

const baseConfig = {
  input: 'es/index.js',
  external: ['react', 'vue', 'prop-types'],
  output: {
    file: pkg.browser,
    format: 'umd',
    name: pkg.browserName,
    exports: 'named',
    globals: {
      react: 'React',
      vue: 'Vue',
      'prop-types': 'PropTypes',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    // swc({
    //   module: {
    //     type: 'umd',
    //   },
    //   jsc: {
    //     transform: {
    //       react: {
    //         pragma: 'React.createElement',
    //         pragmaFrag: 'React.Fragment',
    //         throwIfNamespace: true,
    //         development: false,
    //         useBuiltins: false,
    //       },
    //     },
    //     parser: {
    //       jsx: true,
    //     },
    //     loose: true,
    //   },
    //   env: {
    //     targets: '> 0.25%, not dead',
    //   },
    // }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),

    gzip(),
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

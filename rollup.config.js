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
    swc({
      module: {
        type: 'umd',
      },
      jsc: {
        transform: {
          react: {
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment',
            throwIfNamespace: true,
            development: false,
            useBuiltins: false,
          },
        },
        parser: {
          jsx: true,
        },
        loose: true,
      },
      env: {
        targets: '> 0.25%, not dead',
      },
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    // commonjs(),
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

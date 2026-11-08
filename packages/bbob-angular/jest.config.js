const fs = require('fs');
const base = require('../../jest.config');

// Angular needs TS legacy decorators; the shared swc config has them off.
const swc = JSON.parse(fs.readFileSync(`${__dirname}/../../.swcrc-commonjs.json`, 'utf-8'));
swc.jsc.parser.decorators = true;
swc.jsc.transform.legacyDecorator = true;
swc.jsc.transform.decoratorMetadata = true;

module.exports = {
  ...base,
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json'],
  transform: {
    '\\.m?[jt]sx?$': ['@swc/jest', swc],
  },
  // @angular/* ships ESM-only .mjs bundles, which jest must transpile.
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  testEnvironmentOptions: {
    customExportConditions: ['browser'],
  },
};

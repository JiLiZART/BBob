const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc-commonjs.json`, 'utf-8'));

module.exports = {
  verbose: true,
  setupFilesAfterEnv: [`${__dirname}/jest.setup.js`],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  resolver: "ts-jest-resolver",
  // resolve workspace packages to their sources, not the published registry versions
  moduleNameMapper: {
    '^@bbob/(.*)$': `${__dirname}/packages/bbob-$1/src`,
  },
  transform: {
    '\\.[jt]sx?$': ['@swc/jest', { ...config }],
  },
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};

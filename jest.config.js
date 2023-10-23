const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc-commonjs.json`, 'utf-8'));

module.exports = {
  verbose: true,
  setupFilesAfterEnv: [`${__dirname}/jest.setup.js`],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '\\.[jt]sx?$': ['@swc/jest', { ...config }],
  },
  testEnvironment: 'jest-environment-jsdom',
};

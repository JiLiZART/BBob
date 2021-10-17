module.exports = {
  verbose: true,
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    // '^.+\\.(t|j)sx?$': '@swc/jest',
    '\\.[jt]sx?$': '@swc/jest',
  },
  // transform: {
  //   '^.+\\.[t|j]sx?$': 'babel-jest',
  // },
};

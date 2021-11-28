# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.8.0](https://github.com/JiLiZART/bbob/compare/v2.7.0...v2.8.0) (2021-11-28)


### Features

* update core deps ([#120](https://github.com/JiLiZART/bbob/issues/120)) ([da6709d](https://github.com/JiLiZART/bbob/commit/da6709d43799304e62d51cd03921e261308db80f))


### BREAKING CHANGES

* now we use swc.rs as main bundler and transpiler instead of babel
  - jest now uses swc
  - rollup now uses swc

* feat: benchmark now separate package with `npm start` and colored output
  - benchmark as separate package with error throw if package drops performance

* feat: all lerna packages now using scripts/pkg-task

* feat(github): publish to npm and github registry
  - when release was created this action automaticly publish packages to npm and github

* feat(github): move all from Travis CI to Github Actions
  - code analysis and tests now using github actions

* test: increase tests coverage
  - add more tests for @bbob/react, @bbob/vue2 and @bbob/parser





## [2.7.1](https://github.com/JiLiZART/bbob/compare/v2.7.0...v2.7.1) (2021-11-04)

**Note:** Version bump only for package @bbob/preset-html5





# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)

**Note:** Version bump only for package @bbob/preset-html5





## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)

**Note:** Version bump only for package @bbob/preset-html5





## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)

**Note:** Version bump only for package @bbob/preset-html5





# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)

**Note:** Version bump only for package @bbob/preset-html5





## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/preset-html5





## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)


### Bug Fixes

* **html:** escape bad html ([#67](https://github.com/JiLiZART/bbob/issues/67)) ([87f38fe](https://github.com/JiLiZART/bbob/commit/87f38fe97ef7881be982b3d47c727cd280f1b057))





## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)


### Features

* **plugin-helper:** move `getUniqAttr` from preset to plugin helper ([#63](https://github.com/JiLiZART/bbob/issues/63)) ([f28f19e](https://github.com/JiLiZART/bbob/commit/f28f19e64ce5124db92c446bcc69e78761101744))





## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)

**Note:** Version bump only for package @bbob/preset-html5





<a name="2.5.4"></a>
## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)


### Features

* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.3"></a>
## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)


### Features

* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.2"></a>
## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)


### Features

* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.1"></a>
## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)


### Features

* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.0"></a>
# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)


### Features

* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.4.0"></a>
# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.3.4"></a>
## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.3.3"></a>
## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.3.2"></a>
## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.3.1"></a>
## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.2.0"></a>
# 2.2.0 (2018-10-11)


### Features

* react render support, move some helper functions to plugin-helper ([1a84968](https://github.com/JiLiZART/bbob/commit/1a84968))
* **parser:** custom open and close tags support, html tags tests ([#3](https://github.com/JiLiZART/bbob/issues/3)) ([790825a](https://github.com/JiLiZART/bbob/commit/790825a))
* **preset-html5:** add basic preset with tests ([18ab61b](https://github.com/JiLiZART/bbob/commit/18ab61b))
* base preset package '[@bbob](https://github.com/bbob)/preset' ([b63864c](https://github.com/JiLiZART/bbob/commit/b63864c))
* new [@bbob](https://github.com/bbob)/html api ([#4](https://github.com/JiLiZART/bbob/issues/4)) ([575c1bb](https://github.com/JiLiZART/bbob/commit/575c1bb))




<a name="2.1.2"></a>
## <small>2.1.2 (2018-10-07)</small>





**Note:** Version bump only for package @bbob/preset-html5

<a name="2.1.1"></a>
## [2.1.1](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@2.1.0...@bbob/preset-html5@2.1.1) (2018-10-07)




**Note:** Version bump only for package @bbob/preset-html5

<a name="2.1.0"></a>
# [2.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@2.0.0...@bbob/preset-html5@2.1.0) (2018-09-23)


### Features

* base preset package '[@bbob](https://github.com/bbob)/preset' ([b63864c](https://github.com/JiLiZART/bbob/commit/b63864c))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@1.0.6...@bbob/preset-html5@1.1.0) (2018-08-09)


### Features

* react render support, move some helper functions to plugin-helper ([1a84968](https://github.com/JiLiZART/bbob/commit/1a84968))
* **preset-html5:** add basic preset with tests ([18ab61b](https://github.com/JiLiZART/bbob/commit/18ab61b))




<a name="1.0.6"></a>
## [1.0.6](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@1.0.5...@bbob/preset-html5@1.0.6) (2018-07-13)




**Note:** Version bump only for package @bbob/preset-html5

<a name="1.0.5"></a>
## [1.0.5](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@1.0.4...@bbob/preset-html5@1.0.5) (2018-07-11)




**Note:** Version bump only for package @bbob/preset-html5

<a name="1.0.4"></a>
## [1.0.4](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@1.0.3...@bbob/preset-html5@1.0.4) (2018-07-10)




**Note:** Version bump only for package @bbob/preset-html5

<a name="1.0.3"></a>
## [1.0.3](https://github.com/JiLiZART/bbob/compare/@bbob/preset-html5@1.0.2...@bbob/preset-html5@1.0.3) (2018-07-10)




**Note:** Version bump only for package @bbob/preset-html5

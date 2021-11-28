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

**Note:** Version bump only for package @bbob/core





# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)


### Features

* support for vue2  ([#88](https://github.com/JiLiZART/bbob/issues/88)) ([cbccbaf](https://github.com/JiLiZART/bbob/commit/cbccbaf896e675ce70273234577544b7861859f6))
* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/core





## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)

**Note:** Version bump only for package @bbob/core





## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)

**Note:** Version bump only for package @bbob/core





## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)


### Features

* **core:** allow to pass dynamic data in options for render ([#59](https://github.com/JiLiZART/bbob/issues/59)) ([0b74be7](https://github.com/JiLiZART/bbob/commit/0b74be78304f8206f1b36627206fb517924e08e4))





<a name="2.5.4"></a>
## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)




**Note:** Version bump only for package @bbob/core

<a name="2.5.3"></a>
## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)




**Note:** Version bump only for package @bbob/core

<a name="2.5.2"></a>
## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)




**Note:** Version bump only for package @bbob/core

<a name="2.5.1"></a>
## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)




**Note:** Version bump only for package @bbob/core

<a name="2.5.0"></a>
# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)




**Note:** Version bump only for package @bbob/core

<a name="2.4.0"></a>
# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)


### Features

* **core:** add tree.messages array and tree.options ([cd2b6fd](https://github.com/JiLiZART/bbob/commit/cd2b6fd))




<a name="2.3.4"></a>
## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)




**Note:** Version bump only for package @bbob/core

<a name="2.3.3"></a>
## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)




**Note:** Version bump only for package @bbob/core

<a name="2.3.2"></a>
## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)




**Note:** Version bump only for package @bbob/core

<a name="2.3.1"></a>
## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)




**Note:** Version bump only for package @bbob/core

<a name="2.2.0"></a>
# 2.2.0 (2018-10-11)


### Bug Fixes

* **core:** string walk api test error ([bdd8bbd](https://github.com/JiLiZART/bbob/commit/bdd8bbd))


### Features

* **core:** add helper function to plugin api ([e189a39](https://github.com/JiLiZART/bbob/commit/e189a39))
* **core:** implement plugin api ([ee047e8](https://github.com/JiLiZART/bbob/commit/ee047e8))
* **core:** raw tree property support ([bdfd3f6](https://github.com/JiLiZART/bbob/commit/bdfd3f6))
* new [@bbob](https://github.com/bbob)/html api ([#4](https://github.com/JiLiZART/bbob/issues/4)) ([575c1bb](https://github.com/JiLiZART/bbob/commit/575c1bb))




<a name="2.1.0"></a>
## 2.1.0 (2018-10-07)

* feat(core): raw tree property support ([bdfd3f6](https://github.com/JiLiZART/bbob/commit/bdfd3f6))




<a name="2.0.2"></a>
## [2.0.2](https://github.com/JiLiZART/bbob/compare/@bbob/core@2.0.1...@bbob/core@2.0.2) (2018-10-07)


### Bug Fixes

* **core:** string walk api test error ([bdd8bbd](https://github.com/JiLiZART/bbob/commit/bdd8bbd))




<a name="2.0.1"></a>
## [2.0.1](https://github.com/JiLiZART/bbob/compare/@bbob/core@2.0.0...@bbob/core@2.0.1) (2018-09-23)




**Note:** Version bump only for package @bbob/core

<a name="1.1.0"></a>
# [1.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/core@1.0.6...@bbob/core@1.1.0) (2018-08-09)


### Features

* **core:** add helper function to plugin api ([e189a39](https://github.com/JiLiZART/bbob/commit/e189a39))
* **core:** implement plugin api ([ee047e8](https://github.com/JiLiZART/bbob/commit/ee047e8))




<a name="1.0.6"></a>
## [1.0.6](https://github.com/JiLiZART/bbob/compare/@bbob/core@1.0.5...@bbob/core@1.0.6) (2018-07-13)




**Note:** Version bump only for package @bbob/core

<a name="1.0.5"></a>
## [1.0.5](https://github.com/JiLiZART/bbob/compare/@bbob/core@1.0.4...@bbob/core@1.0.5) (2018-07-11)




**Note:** Version bump only for package @bbob/core

<a name="1.0.4"></a>
## [1.0.4](https://github.com/JiLiZART/bbob/compare/@bbob/core@1.0.3...@bbob/core@1.0.4) (2018-07-10)




**Note:** Version bump only for package @bbob/core

<a name="1.0.3"></a>
## [1.0.3](https://github.com/JiLiZART/bbob/compare/@bbob/core@1.0.2...@bbob/core@1.0.3) (2018-07-10)




**Note:** Version bump only for package @bbob/core

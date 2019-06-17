# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.5.0"></a>
# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.4.1"></a>
## [2.4.1](https://github.com/JiLiZART/bbob/compare/v2.4.0...v2.4.1) (2019-03-29)


### Bug Fixes

* **react:** move [@bbob](https://github.com/bbob)/preset-react to dev deps due to circular deps ([3af3ea8](https://github.com/JiLiZART/bbob/commit/3af3ea8))




<a name="2.4.0"></a>
# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)


### Features

* **core:** add tree.messages array and tree.options ([cd2b6fd](https://github.com/JiLiZART/bbob/commit/cd2b6fd))
* **html:** [@bbob](https://github.com/bbob)/html now can be used without [@bbob](https://github.com/bbob)/core ([c9e1dab](https://github.com/JiLiZART/bbob/commit/c9e1dab))




<a name="2.3.4"></a>
## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)


### Bug Fixes

* **react:** add prop componentProps ([#9](https://github.com/JiLiZART/bbob/issues/9)) ([1dafb69](https://github.com/JiLiZART/bbob/commit/1dafb69))




<a name="2.3.3"></a>
## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)


### Bug Fixes

* **react:** add prop componentProps ([#9](https://github.com/JiLiZART/bbob/issues/9)) ([1dafb69](https://github.com/JiLiZART/bbob/commit/1dafb69))




<a name="2.3.2"></a>
## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)




**Note:** Version bump only for package undefined

<a name="2.3.1"></a>
## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)


### Bug Fixes

* lerna lint command ([424c3a8](https://github.com/JiLiZART/bbob/commit/424c3a8))




<a name="2.3.0"></a>
# [2.3.0](https://github.com/JiLiZART/bbob/compare/v2.2.0...v2.3.0) (2018-10-25)


### Features

* **react:** allow pass custom options to react component ([77b30f3](https://github.com/JiLiZART/bbob/commit/77b30f3))




<a name="2.2.0"></a>
# 2.2.0 (2018-10-11)


### Bug Fixes

* **core:** string walk api test error ([bdd8bbd](https://github.com/JiLiZART/bbob/commit/bdd8bbd))
* **html:** add more tests ([4ebc512](https://github.com/JiLiZART/bbob/commit/4ebc512))
* **html:** rigt import to support three shaking ([485852d](https://github.com/JiLiZART/bbob/commit/485852d))
* **parser:** dependency fail ([7300535](https://github.com/JiLiZART/bbob/commit/7300535))
* **parser:** only allowed tags error ([d3e8e4a](https://github.com/JiLiZART/bbob/commit/d3e8e4a))
* **parser:** remove bad code ([4d9dc34](https://github.com/JiLiZART/bbob/commit/4d9dc34))
* **parser:** tokenizer error with quotemark strings ([7f40050](https://github.com/JiLiZART/bbob/commit/7f40050))
* **plugin-helper:** better handle content of TagNode ([505152b](https://github.com/JiLiZART/bbob/commit/505152b))
* **react:** remove jsx ([ada2c00](https://github.com/JiLiZART/bbob/commit/ada2c00))


### Features

* react render support, move some helper functions to plugin-helper ([1a84968](https://github.com/JiLiZART/bbob/commit/1a84968))
* **bbob:** add codecov support to travis ([44183fd](https://github.com/JiLiZART/bbob/commit/44183fd))
* **core:** add helper function to plugin api ([e189a39](https://github.com/JiLiZART/bbob/commit/e189a39))
* **core:** implement plugin api ([ee047e8](https://github.com/JiLiZART/bbob/commit/ee047e8))
* **core:** raw tree property support ([bdfd3f6](https://github.com/JiLiZART/bbob/commit/bdfd3f6))
* **lexer:** new lexer ([#1](https://github.com/JiLiZART/bbob/issues/1)) ([8882651](https://github.com/JiLiZART/bbob/commit/8882651))
* **parser:** add support for custom tokenizer ([ce03b2f](https://github.com/JiLiZART/bbob/commit/ce03b2f))
* **parser:** better handlinf of unclosed tags like '[My unclosed and [closed] tag' ([b49b743](https://github.com/JiLiZART/bbob/commit/b49b743))
* **parser:** better line and column counting support in tokens ([1c3bebe](https://github.com/JiLiZART/bbob/commit/1c3bebe))
* **parser:** custom open and close tags support, html tags tests ([#3](https://github.com/JiLiZART/bbob/issues/3)) ([790825a](https://github.com/JiLiZART/bbob/commit/790825a))
* **parser:** inconsistent tag detection test ([2eb83c1](https://github.com/JiLiZART/bbob/commit/2eb83c1))
* **parser:** optimize size ([4c8dbed](https://github.com/JiLiZART/bbob/commit/4c8dbed))
* base preset package '[@bbob](https://github.com/bbob)/preset' ([b63864c](https://github.com/JiLiZART/bbob/commit/b63864c))
* new [@bbob](https://github.com/bbob)/html api ([#4](https://github.com/JiLiZART/bbob/issues/4)) ([575c1bb](https://github.com/JiLiZART/bbob/commit/575c1bb))
* **preset-html5:** add basic preset with tests ([18ab61b](https://github.com/JiLiZART/bbob/commit/18ab61b))

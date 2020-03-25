# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)

**Note:** Version bump only for package @bbob/parser





<a name="2.5.4"></a>
## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)


### Bug Fixes

* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)
* **parser:** try to hack terser minifier that removes working code ([#49](https://github.com/JiLiZART/bbob/issues/49)) ([be938fd](https://github.com/JiLiZART/bbob/commit/be938fd)), closes [#48](https://github.com/JiLiZART/bbob/issues/48)


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))




<a name="2.5.3"></a>
## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)


### Bug Fixes

* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))




<a name="2.5.2"></a>
## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)


### Bug Fixes

* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))




<a name="2.5.1"></a>
## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)


### Bug Fixes

* **parser:** fix issue with escaping backslashes when enableEscapeTags is set ([#20](https://github.com/JiLiZART/bbob/issues/20)) ([8a9e930](https://github.com/JiLiZART/bbob/commit/8a9e930))


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))




<a name="2.5.0"></a>
# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))




<a name="2.4.0"></a>
# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)




**Note:** Version bump only for package @bbob/parser

<a name="2.3.4"></a>
## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)




**Note:** Version bump only for package @bbob/parser

<a name="2.3.3"></a>
## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)




**Note:** Version bump only for package @bbob/parser

<a name="2.3.2"></a>
## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)




**Note:** Version bump only for package @bbob/parser

<a name="2.3.1"></a>
## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)




**Note:** Version bump only for package @bbob/parser

<a name="2.2.0"></a>
# [2.2.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@2.1.0...@bbob/parser@2.2.0) (2018-10-07)


### Features

* **parser:** better line and column counting support in tokens ([1c3bebe](https://github.com/JiLiZART/bbob/commit/1c3bebe))




<a name="2.1.0"></a>
# [2.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@2.0.0...@bbob/parser@2.1.0) (2018-09-23)


### Features

* **parser:** better handlinf of unclosed tags like '[My unclosed and [closed] tag' ([b49b743](https://github.com/JiLiZART/bbob/commit/b49b743))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.1.0...@bbob/parser@1.2.0) (2018-08-09)


### Bug Fixes

* **parser:** remove bad code ([4d9dc34](https://github.com/JiLiZART/bbob/commit/4d9dc34))


### Features

* **parser:** add support for custom tokenizer ([ce03b2f](https://github.com/JiLiZART/bbob/commit/ce03b2f))
* **parser:** inconsistent tag detection test ([2eb83c1](https://github.com/JiLiZART/bbob/commit/2eb83c1))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.10...@bbob/parser@1.1.0) (2018-07-13)


### Features

* **parser:** optimize size ([4c8dbed](https://github.com/JiLiZART/bbob/commit/4c8dbed))




<a name="1.0.10"></a>
## [1.0.10](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.9...@bbob/parser@1.0.10) (2018-07-11)


### Bug Fixes

* **parser:** tokenizer error with quotemark strings ([7f40050](https://github.com/JiLiZART/bbob/commit/7f40050))




<a name="1.0.9"></a>
## [1.0.9](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.8...@bbob/parser@1.0.9) (2018-07-10)


### Bug Fixes

* **parser:** only allowed tags error ([d3e8e4a](https://github.com/JiLiZART/bbob/commit/d3e8e4a))




<a name="1.0.8"></a>
## [1.0.8](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.7...@bbob/parser@1.0.8) (2018-07-10)




**Note:** Version bump only for package @bbob/parser

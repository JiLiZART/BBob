# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)


### Bug Fixes

* **parser:** dont process nested tags as string if parent is not allowed ([#84](https://github.com/JiLiZART/bbob/issues/84)) ([70ff2e6](https://github.com/JiLiZART/bbob/commit/70ff2e6660bb507f6ed57cb91e850b3879bdb7eb))
* **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))


### Performance Improvements

* **parser:** cache nested tokens in Set to prevent deoptimization ([#83](https://github.com/JiLiZART/bbob/issues/83)) ([cad0e9e](https://github.com/JiLiZART/bbob/commit/cad0e9e7f4cc5fd9f82cfd25223561d186804e22))





## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)


### Bug Fixes

* **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/parser





## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)

**Note:** Version bump only for package @bbob/parser





## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)


### Bug Fixes

* **parser:** don't eat not allowed tags with params ([#58](https://github.com/JiLiZART/bbob/issues/58)) fixes [#54](https://github.com/JiLiZART/bbob/issues/54) ([a16b9f7](https://github.com/JiLiZART/bbob/commit/a16b9f73b0737a46e852f9c55a17a612f17a9587))


### Performance Improvements

* **parser:** optimize v8 perf deoptimizations ([#61](https://github.com/JiLiZART/bbob/issues/61)) ([97ecba0](https://github.com/JiLiZART/bbob/commit/97ecba0af61c05ab4f57516589e64c7419138fde))





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

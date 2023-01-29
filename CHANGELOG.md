# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://github.com/JiLiZART/BBob/compare/v2.8.3...v2.9.0) (2023-01-29)


### Features

* **parser:** context free tag mode ([#165](https://github.com/JiLiZART/BBob/issues/165)) ([19e8dd6](https://github.com/JiLiZART/BBob/commit/19e8dd659e8c36779c73def8d914edfc219fbf72))

## [2.8.3](https://github.com/JiLiZART/BBob/compare/v2.8.2...v2.8.3) (2022-12-18)


### Bug Fixes

* add nx for parallel build ([683062d](https://github.com/JiLiZART/BBob/commit/683062dec98abee148d022db7c1a339e7b7750b2))
* bbob plugin helper imports ([5f76548](https://github.com/JiLiZART/BBob/commit/5f76548b78b29f0905f74804e4a1d0634f085c1b))
* bundle size limits ([edfdfed](https://github.com/JiLiZART/BBob/commit/edfdfedd06214ec9769f892407153d5b023e35aa))
* bundlephobia version ([8be7dbc](https://github.com/JiLiZART/BBob/commit/8be7dbc30616ec95802ff2c4380cc4843ef4569b))
* code ql ([d6cbafe](https://github.com/JiLiZART/BBob/commit/d6cbafe8ba24e1e837333e644073a0e76c3eed07))
* npm ci ([7093e12](https://github.com/JiLiZART/BBob/commit/7093e12afee8dfabebd82e50a229d7b6402cf774))
* npm publish in PR ([6145965](https://github.com/JiLiZART/BBob/commit/61459659895eecb4364c4f74c34dc0660fef3c1b))
* plugin helper build priority and circular deps ([cac47c6](https://github.com/JiLiZART/BBob/commit/cac47c6fc7e30c419691f7e8bc33f118211fc044))
* remove bundlephobia checker ([e912463](https://github.com/JiLiZART/BBob/commit/e9124638d5b628a9e2152414864ba5c4b47498ad))
* remove exports directive ([a6efc40](https://github.com/JiLiZART/BBob/commit/a6efc4023b5cb09b56436a0dbe698423b2feecf1))
* remove gitHead from package.json ([2b3ffa9](https://github.com/JiLiZART/BBob/commit/2b3ffa93233decdb3f2c93e91bd93582525f9210))
* rollup build ([a31c97e](https://github.com/JiLiZART/BBob/commit/a31c97e6cb7b1b2790a96940c2aff137ef2e4f57))
* secret NPM token ([abccc78](https://github.com/JiLiZART/BBob/commit/abccc78c7f51f3e7fe75c700d4448fe770af2bb5))
* tests setup ([4c1e066](https://github.com/JiLiZART/BBob/commit/4c1e06683e7164d44ad82541f63ca01918e5f99a))
* vue2 test and minify ([af3ba58](https://github.com/JiLiZART/BBob/commit/af3ba58c40717f07ce5be4a6df0aaa6f791e81f0))


### Features

* bundlephobia more popular action ([8725f04](https://github.com/JiLiZART/BBob/commit/8725f04afff8a089d26f5552ca880e9ec68c1c8b))
* bundlephobia pr review ([a459045](https://github.com/JiLiZART/BBob/commit/a459045835d0adecdb45c94c4b63f2e2b7920b4e))
* publish branch to npm ([2200e0a](https://github.com/JiLiZART/BBob/commit/2200e0a6e227d004477c74e63cb73bf5510f9305))





## [2.8.2](https://github.com/JiLiZART/BBob/compare/v2.8.1...v2.8.2) (2022-11-28)


### Bug Fixes

* **react:** add range of peer deps ([#151](https://github.com/JiLiZART/BBob/issues/151)) ([7cd648d](https://github.com/JiLiZART/BBob/commit/7cd648d876bfdd9c4ed97f57a74f18f70b0e73fb))





## [2.8.1](https://github.com/JiLiZART/BBob/compare/v2.8.0...v2.8.1) (2022-05-24)


### Bug Fixes

* **github:** lerna bootsrap before publish ([4e4b1e6](https://github.com/JiLiZART/BBob/commit/4e4b1e63ddd97e98446ab2413dcabf4bff2819e5))
* lerna issue and publish patch ([daf9b02](https://github.com/JiLiZART/BBob/commit/daf9b02199cfb80035cb3b629093af0e605c1854))
* lerna publish scripts ([2b6e11a](https://github.com/JiLiZART/BBob/commit/2b6e11a07732e8f8ca4e476b7d56eeca8613a80a))


### Features

* **react:** update to react 18 and testing-library ([#138](https://github.com/JiLiZART/BBob/issues/138)) ([502362c](https://github.com/JiLiZART/BBob/commit/502362cc8cf63104e6107aa01b7e3b1af6cf464e))





# [2.8.0](https://github.com/JiLiZART/BBob/compare/v2.7.0...v2.8.0) (2021-11-28)


### Bug Fixes

* **github:** publish using lerna ([2eb9d28](https://github.com/JiLiZART/BBob/commit/2eb9d285153549e6f5b052bf4142ab54c8535789))
* **react:** adjust PropTypes for React Component `container` ([#107](https://github.com/JiLiZART/BBob/issues/107)) ([93d8027](https://github.com/JiLiZART/BBob/commit/93d802773cbe733ccf4b0124257c6fc6707c873b))


### Features

* update core deps ([#120](https://github.com/JiLiZART/BBob/issues/120)) ([da6709d](https://github.com/JiLiZART/BBob/commit/da6709d43799304e62d51cd03921e261308db80f))


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


### Bug Fixes

* **react:** adjust PropTypes for React Component `container` ([#107](https://github.com/JiLiZART/bbob/issues/107)) ([93d8027](https://github.com/JiLiZART/bbob/commit/93d802773cbe733ccf4b0124257c6fc6707c873b))





# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)


### Bug Fixes

* **parser:** dont process nested tags as string if parent is not allowed ([#84](https://github.com/JiLiZART/bbob/issues/84)) ([70ff2e6](https://github.com/JiLiZART/bbob/commit/70ff2e6660bb507f6ed57cb91e850b3879bdb7eb))
* **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))
* **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))


### Features

* support for vue2  ([#88](https://github.com/JiLiZART/bbob/issues/88)) ([cbccbaf](https://github.com/JiLiZART/bbob/commit/cbccbaf896e675ce70273234577544b7861859f6))
* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))


### Performance Improvements

* **parser:** cache nested tokens in Set to prevent deoptimization ([#83](https://github.com/JiLiZART/bbob/issues/83)) ([cad0e9e](https://github.com/JiLiZART/bbob/commit/cad0e9e7f4cc5fd9f82cfd25223561d186804e22))





## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)


### Bug Fixes

* **parser:** dont process nested tags as string if parent is not allowed ([#84](https://github.com/JiLiZART/bbob/issues/84)) ([70ff2e6](https://github.com/JiLiZART/bbob/commit/70ff2e6660bb507f6ed57cb91e850b3879bdb7eb))
* **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))
* **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))


### Performance Improvements

* **parser:** cache nested tokens in Set to prevent deoptimization ([#83](https://github.com/JiLiZART/bbob/issues/83)) ([cad0e9e](https://github.com/JiLiZART/bbob/commit/cad0e9e7f4cc5fd9f82cfd25223561d186804e22))





## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)


### Bug Fixes

* **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))
* **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)


### Bug Fixes

* **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))


### Features

* **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))





## [2.5.9](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.5.9) (2020-11-16)


### Bug Fixes

* **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))





## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)


### Bug Fixes

* **plugin-helper:** escape case insensitive javascript: attrs ([5ceb2f0](https://github.com/JiLiZART/bbob/commit/5ceb2f0fa4bb5c7b48ec18010fabc406a4d0b8c5))





## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)


### Bug Fixes

* **html:** escape bad html ([#67](https://github.com/JiLiZART/bbob/issues/67)) ([87f38fe](https://github.com/JiLiZART/bbob/commit/87f38fe97ef7881be982b3d47c727cd280f1b057))





## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)


### Bug Fixes

* **parser:** don't eat not allowed tags with params ([#58](https://github.com/JiLiZART/bbob/issues/58)) fixes [#54](https://github.com/JiLiZART/bbob/issues/54) ([a16b9f7](https://github.com/JiLiZART/bbob/commit/a16b9f73b0737a46e852f9c55a17a612f17a9587))


### Features

* **plugin-helper:** move `getUniqAttr` from preset to plugin helper ([#63](https://github.com/JiLiZART/bbob/issues/63)) ([f28f19e](https://github.com/JiLiZART/bbob/commit/f28f19e64ce5124db92c446bcc69e78761101744))


### Performance Improvements

* **parser:** optimize v8 perf deoptimizations ([#61](https://github.com/JiLiZART/bbob/issues/61)) ([97ecba0](https://github.com/JiLiZART/bbob/commit/97ecba0af61c05ab4f57516589e64c7419138fde))





## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)


### Features

* **core:** allow to pass dynamic data in options for render ([#59](https://github.com/JiLiZART/bbob/issues/59)) ([0b74be7](https://github.com/JiLiZART/bbob/commit/0b74be78304f8206f1b36627206fb517924e08e4))





<a name="2.5.4"></a>
## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)


### Bug Fixes

* **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)
* **parser:** try to hack terser minifier that removes working code ([#49](https://github.com/JiLiZART/bbob/issues/49)) ([be938fd](https://github.com/JiLiZART/bbob/commit/be938fd)), closes [#48](https://github.com/JiLiZART/bbob/issues/48)
* **plugin-helper:** avoid some malformed attributes in attrsToString ([#26](https://github.com/JiLiZART/bbob/issues/26)) ([09ff9af](https://github.com/JiLiZART/bbob/commit/09ff9af))
* **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))
* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.3"></a>
## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)


### Bug Fixes

* **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)
* **plugin-helper:** avoid some malformed attributes in attrsToString ([#26](https://github.com/JiLiZART/bbob/issues/26)) ([09ff9af](https://github.com/JiLiZART/bbob/commit/09ff9af))
* **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))
* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.2"></a>
## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)


### Bug Fixes

* **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
* **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)
* **plugin-helper:** avoid some malformed attributes in attrsToString ([#26](https://github.com/JiLiZART/bbob/issues/26)) ([09ff9af](https://github.com/JiLiZART/bbob/commit/09ff9af))
* **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




<a name="2.5.1"></a>
## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)


### Bug Fixes

* **parser:** fix issue with escaping backslashes when enableEscapeTags is set ([#20](https://github.com/JiLiZART/bbob/issues/20)) ([8a9e930](https://github.com/JiLiZART/bbob/commit/8a9e930))


### Features

* **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
* **preset-html5:** list type attribute support ([#18](https://github.com/JiLiZART/bbob/issues/18)) ([847c55e](https://github.com/JiLiZART/bbob/commit/847c55e))




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

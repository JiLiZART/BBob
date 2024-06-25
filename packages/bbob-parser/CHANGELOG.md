# Change Log

## 4.0.0

### Major Changes

- [#185](https://github.com/JiLiZART/BBob/pull/185) [`8797f7f`](https://github.com/JiLiZART/BBob/commit/8797f7f363a34b6a53578e0b2f50033cbb6a7eeb) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now BBob supports Typescript with typings

### Minor Changes

- [#230](https://github.com/JiLiZART/BBob/pull/230) [`05246b2`](https://github.com/JiLiZART/BBob/commit/05246b2aea846e7cec41fa62aebc41a717208ec5) Thanks [@Alteras1](https://github.com/Alteras1)! - fix: treat contextFreeTags case insensitively

- [#233](https://github.com/JiLiZART/BBob/pull/233) [`270f564`](https://github.com/JiLiZART/BBob/commit/270f5645f8c5b536d61883998a8dc4854f296f37) Thanks [@JiLiZART](https://github.com/JiLiZART)! - ** BREAKING CHANGE **

  `TagNode.create` method now by default pass `null` to content instead of empty array `[]`

  ```js
  // new behavior
  TagNode.create("img").toString(); // -> [img]
  // old behavior
  TagNode.create("img", {}, []).toString(); // -> [img][/img]
  ```

  Migrate all calls of `TagNode.create('test-tag')` to `TagNode.create('test-tag', {}, [])

- [#199](https://github.com/JiLiZART/BBob/pull/199) [`3575982`](https://github.com/JiLiZART/BBob/commit/3575982b280cc45c9cedaf7a059491a324c1b514) Thanks [@JiLiZART](https://github.com/JiLiZART)! - All build processes and CI actions now using PNPM as default Package Manager

### Patch Changes

- Updated dependencies [[`270f564`](https://github.com/JiLiZART/BBob/commit/270f5645f8c5b536d61883998a8dc4854f296f37), [`8797f7f`](https://github.com/JiLiZART/BBob/commit/8797f7f363a34b6a53578e0b2f50033cbb6a7eeb), [`3575982`](https://github.com/JiLiZART/BBob/commit/3575982b280cc45c9cedaf7a059491a324c1b514)]:
  - @bbob/plugin-helper@4.0.0

## 3.0.2

### Patch Changes

- [#191](https://github.com/JiLiZART/BBob/pull/191) [`0c78831`](https://github.com/JiLiZART/BBob/commit/0c78831372b02216c9be5d95cd8b857c18f81540) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now HTML5 Preset supports `color` tag

  ```
  [color="red"]Red Text[/color]
  ```

  Also fixes bug with case insensitive tags in `onlyAllowTags`
  Now you can pas `h1` and `H1` and they will be treated as same tags

- Updated dependencies [[`0c78831`](https://github.com/JiLiZART/BBob/commit/0c78831372b02216c9be5d95cd8b857c18f81540)]:
  - @bbob/plugin-helper@3.0.2

## 3.0.1

### Patch Changes

- [#186](https://github.com/JiLiZART/BBob/pull/186) [`603c3ea`](https://github.com/JiLiZART/BBob/commit/603c3ead0f2b895a447dd9cfe98ce6ef27eec79c) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Fixes bug where nested tag `quote` lost

  ```
  [color=red]test[/color]
  [quote]xxxsdfasdf
  sdfasdfasdf

  [url=xxx]xxx[/url]
  ```

  Now content not will be lost, but not closed tag will displayed as raw text

## 3.0.0

### Major Changes

- [#182](https://github.com/JiLiZART/BBob/pull/182) [`49065d2`](https://github.com/JiLiZART/BBob/commit/49065d239b69e054b360596353d5b810282d259d) Thanks [@JiLiZART](https://github.com/JiLiZART)! - # Vue3 support

  Now you can use `@bbob` parser in `vue3`

  Example usage

  ```shell
  npm i @bbob/vue3 @bbob/preset-vue
  ```

  ```js
  import { defineComponent } from "vue";
  import VueBbob from "@bbob/vue3";

  Vue.use(VueBbob);
  ```

  ```html
  <template>
    <div class="vue3">
      <h2>Generated vue3 here</h2>
      <bbob-bbcode container="div" :plugins="plugins">{{ bbcode }}</bbob-bbcode>
    </div>
  </template>
  <script>
    import { defineComponent } from "vue";
    import preset from "@bbob/preset-vue";

    export default defineComponent({
      name: "App",
      data() {
        return {
          bbcode: "Text [b]bolded[/b] and [i]Some Name[/i]",
          plugins: [preset()],
        };
      },
    });
  </script>
  ```

### Patch Changes

- Updated dependencies [[`49065d2`](https://github.com/JiLiZART/BBob/commit/49065d239b69e054b360596353d5b810282d259d)]:
  - @bbob/plugin-helper@3.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://github.com/JiLiZART/bbob/compare/v2.8.3...v2.9.0) (2023-01-29)

### Features

- **parser:** context free tag mode ([#165](https://github.com/JiLiZART/bbob/issues/165)) ([19e8dd6](https://github.com/JiLiZART/bbob/commit/19e8dd659e8c36779c73def8d914edfc219fbf72))

## [2.8.3](https://github.com/JiLiZART/bbob/compare/v2.8.2...v2.8.3) (2022-12-18)

### Bug Fixes

- bbob plugin helper imports ([5f76548](https://github.com/JiLiZART/bbob/commit/5f76548b78b29f0905f74804e4a1d0634f085c1b))
- remove gitHead from package.json ([2b3ffa9](https://github.com/JiLiZART/bbob/commit/2b3ffa93233decdb3f2c93e91bd93582525f9210))

## [2.8.2](https://github.com/JiLiZART/bbob/compare/v2.8.1...v2.8.2) (2022-11-28)

**Note:** Version bump only for package @bbob/parser

## [2.8.1](https://github.com/JiLiZART/bbob/compare/v2.8.0...v2.8.1) (2022-05-24)

**Note:** Version bump only for package @bbob/parser

# [2.8.0](https://github.com/JiLiZART/bbob/compare/v2.7.0...v2.8.0) (2021-11-28)

### Features

- update core deps ([#120](https://github.com/JiLiZART/bbob/issues/120)) ([da6709d](https://github.com/JiLiZART/bbob/commit/da6709d43799304e62d51cd03921e261308db80f))

### BREAKING CHANGES

- now we use swc.rs as main bundler and transpiler instead of babel

  - jest now uses swc
  - rollup now uses swc

- feat: benchmark now separate package with `npm start` and colored output

  - benchmark as separate package with error throw if package drops performance

- feat: all lerna packages now using scripts/pkg-task

- feat(github): publish to npm and github registry

  - when release was created this action automaticly publish packages to npm and github

- feat(github): move all from Travis CI to Github Actions

  - code analysis and tests now using github actions

- test: increase tests coverage
  - add more tests for @bbob/react, @bbob/vue2 and @bbob/parser

## [2.7.1](https://github.com/JiLiZART/bbob/compare/v2.7.0...v2.7.1) (2021-11-04)

**Note:** Version bump only for package @bbob/parser

# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)

### Bug Fixes

- **parser:** dont process nested tags as string if parent is not allowed ([#84](https://github.com/JiLiZART/bbob/issues/84)) ([70ff2e6](https://github.com/JiLiZART/bbob/commit/70ff2e6660bb507f6ed57cb91e850b3879bdb7eb))
- **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))

### Features

- support for vue2 ([#88](https://github.com/JiLiZART/bbob/issues/88)) ([cbccbaf](https://github.com/JiLiZART/bbob/commit/cbccbaf896e675ce70273234577544b7861859f6))
- **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))

### Performance Improvements

- **parser:** cache nested tokens in Set to prevent deoptimization ([#83](https://github.com/JiLiZART/bbob/issues/83)) ([cad0e9e](https://github.com/JiLiZART/bbob/commit/cad0e9e7f4cc5fd9f82cfd25223561d186804e22))

## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)

### Bug Fixes

- **parser:** dont process nested tags as string if parent is not allowed ([#84](https://github.com/JiLiZART/bbob/issues/84)) ([70ff2e6](https://github.com/JiLiZART/bbob/commit/70ff2e6660bb507f6ed57cb91e850b3879bdb7eb))
- **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))

### Features

- **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))

### Performance Improvements

- **parser:** cache nested tokens in Set to prevent deoptimization ([#83](https://github.com/JiLiZART/bbob/issues/83)) ([cad0e9e](https://github.com/JiLiZART/bbob/commit/cad0e9e7f4cc5fd9f82cfd25223561d186804e22))

## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)

### Bug Fixes

- **parser:** tag inside tag parsing regression ([#81](https://github.com/JiLiZART/bbob/issues/81)) ([09bda26](https://github.com/JiLiZART/bbob/commit/09bda26d7ca9c3f4c5f1565a2ca22d16bf1d27ab))

### Features

- **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))

# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)

### Features

- **parser:** rewrite lexer to make it faster ([#50](https://github.com/JiLiZART/bbob/issues/50)) ([772d422](https://github.com/JiLiZART/bbob/commit/772d422d770b0f7716a86ac82c10eb3baaf77828))

## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/parser

## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)

**Note:** Version bump only for package @bbob/parser

## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)

### Bug Fixes

- **parser:** don't eat not allowed tags with params ([#58](https://github.com/JiLiZART/bbob/issues/58)) fixes [#54](https://github.com/JiLiZART/bbob/issues/54) ([a16b9f7](https://github.com/JiLiZART/bbob/commit/a16b9f73b0737a46e852f9c55a17a612f17a9587))

### Performance Improvements

- **parser:** optimize v8 perf deoptimizations ([#61](https://github.com/JiLiZART/bbob/issues/61)) ([97ecba0](https://github.com/JiLiZART/bbob/commit/97ecba0af61c05ab4f57516589e64c7419138fde))

## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)

**Note:** Version bump only for package @bbob/parser

<a name="2.5.4"></a>

## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)

### Bug Fixes

- **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)
- **parser:** try to hack terser minifier that removes working code ([#49](https://github.com/JiLiZART/bbob/issues/49)) ([be938fd](https://github.com/JiLiZART/bbob/commit/be938fd)), closes [#48](https://github.com/JiLiZART/bbob/issues/48)

### Features

- **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
- **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))

<a name="2.5.3"></a>

## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)

### Bug Fixes

- **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)

### Features

- **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))
- **plugin-helper:** lowercase resulting tag names ([#42](https://github.com/JiLiZART/bbob/issues/42)) ([597c2a9](https://github.com/JiLiZART/bbob/commit/597c2a9))

<a name="2.5.2"></a>

## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)

### Bug Fixes

- **parser:** infinity loop problem when escape `[\b]` ([#31](https://github.com/JiLiZART/bbob/issues/31)) ([b4cf271](https://github.com/JiLiZART/bbob/commit/b4cf271)), closes [#23](https://github.com/JiLiZART/bbob/issues/23)

### Features

- **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))

<a name="2.5.1"></a>

## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)

### Bug Fixes

- **parser:** fix issue with escaping backslashes when enableEscapeTags is set ([#20](https://github.com/JiLiZART/bbob/issues/20)) ([8a9e930](https://github.com/JiLiZART/bbob/commit/8a9e930))

### Features

- **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))

<a name="2.5.0"></a>

# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)

### Features

- **parse:** allow tags to be escaped with backslash ([#17](https://github.com/JiLiZART/bbob/issues/17)) ([c4f78c1](https://github.com/JiLiZART/bbob/commit/c4f78c1))

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

- **parser:** better line and column counting support in tokens ([1c3bebe](https://github.com/JiLiZART/bbob/commit/1c3bebe))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@2.0.0...@bbob/parser@2.1.0) (2018-09-23)

### Features

- **parser:** better handlinf of unclosed tags like '[My unclosed and [closed] tag' ([b49b743](https://github.com/JiLiZART/bbob/commit/b49b743))

<a name="1.2.0"></a>

# [1.2.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.1.0...@bbob/parser@1.2.0) (2018-08-09)

### Bug Fixes

- **parser:** remove bad code ([4d9dc34](https://github.com/JiLiZART/bbob/commit/4d9dc34))

### Features

- **parser:** add support for custom tokenizer ([ce03b2f](https://github.com/JiLiZART/bbob/commit/ce03b2f))
- **parser:** inconsistent tag detection test ([2eb83c1](https://github.com/JiLiZART/bbob/commit/2eb83c1))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.10...@bbob/parser@1.1.0) (2018-07-13)

### Features

- **parser:** optimize size ([4c8dbed](https://github.com/JiLiZART/bbob/commit/4c8dbed))

<a name="1.0.10"></a>

## [1.0.10](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.9...@bbob/parser@1.0.10) (2018-07-11)

### Bug Fixes

- **parser:** tokenizer error with quotemark strings ([7f40050](https://github.com/JiLiZART/bbob/commit/7f40050))

<a name="1.0.9"></a>

## [1.0.9](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.8...@bbob/parser@1.0.9) (2018-07-10)

### Bug Fixes

- **parser:** only allowed tags error ([d3e8e4a](https://github.com/JiLiZART/bbob/commit/d3e8e4a))

<a name="1.0.8"></a>

## [1.0.8](https://github.com/JiLiZART/bbob/compare/@bbob/parser@1.0.7...@bbob/parser@1.0.8) (2018-07-10)

**Note:** Version bump only for package @bbob/parser

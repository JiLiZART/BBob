# Change Log

## 4.2.0

### Minor Changes

- [#251](https://github.com/JiLiZART/BBob/pull/251) [`ccab54a`](https://github.com/JiLiZART/BBob/commit/ccab54a4547b67d0ea61644e36ca57fdbe8c6491) Thanks [@JiLiZART](https://github.com/JiLiZART)! - New option flag `caseFreeTags` has been added

  This flag allows to parse case insensitive tags like `[h1]some[/H1]` -> `<h1>some</h1>`

  ```js
  import html from "@bbob/html";
  import presetHTML5 from "@bbob/preset-html5";

  const processed = html(`[h1]some[/H1]`, presetHTML5(), {
    caseFreeTags: true,
  });

  console.log(processed); // <h1>some</h1>
  ```

  Also now you can pass `caseFreeTags` to `parse` function

  ```js
  import { parse } from "@bbob/parser";

  const ast = parse("[h1]some[/H1]", {
    caseFreeTags: true,
  });
  ```

  BREAKING CHANGE: `isTokenNested` function now accepts string `tokenValue` instead of `token`

  Changed codecov.io to coveralls.io for test coverage

### Patch Changes

- [#267](https://github.com/JiLiZART/BBob/pull/267) [`8a9cfd6`](https://github.com/JiLiZART/BBob/commit/8a9cfd67c0f1a9fe6cc8cd74b68b7cdf3d393841) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Fix types for BbobCoreOptions

- Updated dependencies [[`ccab54a`](https://github.com/JiLiZART/BBob/commit/ccab54a4547b67d0ea61644e36ca57fdbe8c6491), [`8a9cfd6`](https://github.com/JiLiZART/BBob/commit/8a9cfd67c0f1a9fe6cc8cd74b68b7cdf3d393841)]:
  - @bbob/types@4.2.0
  - @bbob/plugin-helper@4.2.0

## 4.1.1

### Patch Changes

- [#248](https://github.com/JiLiZART/BBob/pull/248) [`27c8c4b`](https://github.com/JiLiZART/BBob/commit/27c8c4b869bc0e26905e1b4555036ac65baaa1c6) Thanks [@GetPastTheMonkey](https://github.com/GetPastTheMonkey)! - Removed `defaultProps` and
  Warning for deprecated defaultProps
- Updated dependencies [[`27c8c4b`](https://github.com/JiLiZART/BBob/commit/27c8c4b869bc0e26905e1b4555036ac65baaa1c6)]:
  - @bbob/plugin-helper@4.1.1
  - @bbob/types@4.1.1

## 4.1.0

### Minor Changes

- [#246](https://github.com/JiLiZART/BBob/pull/246) [`4084874`](https://github.com/JiLiZART/BBob/commit/40848747d4c52a3752ff3803f7643072e916631e) Thanks [@Alteras1](https://github.com/Alteras1)! - feat: Add start and end positions of tag nodes

### Patch Changes

- Updated dependencies [[`4084874`](https://github.com/JiLiZART/BBob/commit/40848747d4c52a3752ff3803f7643072e916631e)]:
  - @bbob/plugin-helper@4.1.0
  - @bbob/types@4.1.0

## 4.0.3

### Patch Changes

- [#242](https://github.com/JiLiZART/BBob/pull/242) [`16ad521`](https://github.com/JiLiZART/BBob/commit/16ad5216dbdb58f15baa79a7f4596e6281043f5f) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Added `vue3` and `react` examples in `examples` folder

  For `vue2` and `vue3` plugins you can use now `<bbob-bbcode>`, `<BBobBBCode>` and `<BBCode>` tags

- Updated dependencies [[`16ad521`](https://github.com/JiLiZART/BBob/commit/16ad5216dbdb58f15baa79a7f4596e6281043f5f)]:
  - @bbob/plugin-helper@4.0.3
  - @bbob/types@4.0.3

## 4.0.1

### Patch Changes

- [`dd7696c`](https://github.com/JiLiZART/BBob/commit/dd7696ca4bc5122563d897048f46ca6a16f21de6) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Fixes problem where `@bbob/html@4.0.0` depends on `@bbob/core@3.0.2` instead of `^4.0.0`

- Updated dependencies [[`dd7696c`](https://github.com/JiLiZART/BBob/commit/dd7696ca4bc5122563d897048f46ca6a16f21de6)]:
  - @bbob/plugin-helper@4.0.1
  - @bbob/types@4.0.1

## 4.0.0

### Major Changes

- [#185](https://github.com/JiLiZART/BBob/pull/185) [`8797f7f`](https://github.com/JiLiZART/BBob/commit/8797f7f363a34b6a53578e0b2f50033cbb6a7eeb) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now BBob supports Typescript with typings

### Minor Changes

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

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://github.com/JiLiZART/bbob/compare/v2.8.3...v2.9.0) (2023-01-29)

**Note:** Version bump only for package @bbob/preset

## [2.8.3](https://github.com/JiLiZART/bbob/compare/v2.8.2...v2.8.3) (2022-12-18)

### Bug Fixes

- remove gitHead from package.json ([2b3ffa9](https://github.com/JiLiZART/bbob/commit/2b3ffa93233decdb3f2c93e91bd93582525f9210))

## [2.8.2](https://github.com/JiLiZART/bbob/compare/v2.8.1...v2.8.2) (2022-11-28)

**Note:** Version bump only for package @bbob/preset

## [2.8.1](https://github.com/JiLiZART/bbob/compare/v2.8.0...v2.8.1) (2022-05-24)

**Note:** Version bump only for package @bbob/preset

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

**Note:** Version bump only for package @bbob/preset

# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)

### Features

- support for vue2 ([#88](https://github.com/JiLiZART/bbob/issues/88)) ([cbccbaf](https://github.com/JiLiZART/bbob/commit/cbccbaf896e675ce70273234577544b7861859f6))

## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)

**Note:** Version bump only for package @bbob/preset

## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)

**Note:** Version bump only for package @bbob/preset

# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)

**Note:** Version bump only for package @bbob/preset

## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/preset

## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)

### Bug Fixes

- **html:** escape bad html ([#67](https://github.com/JiLiZART/bbob/issues/67)) ([87f38fe](https://github.com/JiLiZART/bbob/commit/87f38fe97ef7881be982b3d47c727cd280f1b057))

## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)

**Note:** Version bump only for package @bbob/preset

## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)

**Note:** Version bump only for package @bbob/preset

<a name="2.5.4"></a>

## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)

**Note:** Version bump only for package @bbob/preset

<a name="2.5.3"></a>

## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)

**Note:** Version bump only for package @bbob/preset

<a name="2.5.2"></a>

## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)

**Note:** Version bump only for package @bbob/preset

<a name="2.4.0"></a>

# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)

**Note:** Version bump only for package @bbob/preset

<a name="2.3.4"></a>

## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)

**Note:** Version bump only for package @bbob/preset

<a name="2.3.3"></a>

## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)

**Note:** Version bump only for package @bbob/preset

<a name="2.3.2"></a>

## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)

**Note:** Version bump only for package @bbob/preset

<a name="2.3.1"></a>

## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)

**Note:** Version bump only for package @bbob/preset

<a name="2.1.0"></a>

# [2.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/preset@2.0.0...@bbob/preset@2.1.0) (2018-09-23)

### Features

- base preset package '[@bbob](https://github.com/bbob)/preset' ([b63864c](https://github.com/JiLiZART/bbob/commit/b63864c))

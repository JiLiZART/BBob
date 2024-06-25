# Change Log

## 4.0.1

### Patch Changes

- [`dd7696c`](https://github.com/JiLiZART/BBob/commit/dd7696ca4bc5122563d897048f46ca6a16f21de6) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Fixes problem where `@bbob/html@4.0.0` depends on `@bbob/core@3.0.2` instead of `^4.0.0`

- Updated dependencies [[`dd7696c`](https://github.com/JiLiZART/BBob/commit/dd7696ca4bc5122563d897048f46ca6a16f21de6)]:
  - @bbob/core@4.0.1
  - @bbob/html@4.0.1
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

- [#226](https://github.com/JiLiZART/BBob/pull/226) [`f1f9eb3`](https://github.com/JiLiZART/BBob/commit/f1f9eb39da12fb1b49d90e610e3def23c24f4eb3) Thanks [@JiLiZART](https://github.com/JiLiZART)! - fix(react): render words and spaces as single node in react

  Now React properly renders string nodes with spaces as single text node for react. Thanks @WLYau

- Updated dependencies [[`270f564`](https://github.com/JiLiZART/BBob/commit/270f5645f8c5b536d61883998a8dc4854f296f37), [`8797f7f`](https://github.com/JiLiZART/BBob/commit/8797f7f363a34b6a53578e0b2f50033cbb6a7eeb), [`3575982`](https://github.com/JiLiZART/BBob/commit/3575982b280cc45c9cedaf7a059491a324c1b514)]:
  - @bbob/plugin-helper@4.0.0
  - @bbob/core@4.0.0
  - @bbob/html@4.0.0

## 3.0.2

### Patch Changes

- [#191](https://github.com/JiLiZART/BBob/pull/191) [`0c78831`](https://github.com/JiLiZART/BBob/commit/0c78831372b02216c9be5d95cd8b857c18f81540) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now HTML5 Preset supports `color` tag

  ```
  [color="red"]Red Text[/color]
  ```

  Also fixes bug with case insensitive tags in `onlyAllowTags`
  Now you can pas `h1` and `H1` and they will be treated as same tags

- Updated dependencies [[`0c78831`](https://github.com/JiLiZART/BBob/commit/0c78831372b02216c9be5d95cd8b857c18f81540)]:
  - @bbob/core@3.0.2
  - @bbob/html@3.0.2
  - @bbob/plugin-helper@3.0.2

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
  - @bbob/core@3.0.0
  - @bbob/html@3.0.0
  - @bbob/plugin-helper@3.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://github.com/JiLiZART/bbob/compare/v2.8.3...v2.9.0) (2023-01-29)

**Note:** Version bump only for package @bbob/react

## [2.8.3](https://github.com/JiLiZART/bbob/compare/v2.8.2...v2.8.3) (2022-12-18)

### Bug Fixes

- remove gitHead from package.json ([2b3ffa9](https://github.com/JiLiZART/bbob/commit/2b3ffa93233decdb3f2c93e91bd93582525f9210))

## [2.8.2](https://github.com/JiLiZART/bbob/compare/v2.8.1...v2.8.2) (2022-11-28)

### Bug Fixes

- **react:** add range of peer deps ([#151](https://github.com/JiLiZART/bbob/issues/151)) ([7cd648d](https://github.com/JiLiZART/bbob/commit/7cd648d876bfdd9c4ed97f57a74f18f70b0e73fb))

## [2.8.1](https://github.com/JiLiZART/bbob/compare/v2.8.0...v2.8.1) (2022-05-24)

### Features

- **react:** update to react 18 and testing-library ([#138](https://github.com/JiLiZART/bbob/issues/138)) ([502362c](https://github.com/JiLiZART/bbob/commit/502362cc8cf63104e6107aa01b7e3b1af6cf464e))

# [2.8.0](https://github.com/JiLiZART/bbob/compare/v2.7.0...v2.8.0) (2021-11-28)

### Bug Fixes

- **react:** adjust PropTypes for React Component `container` ([#107](https://github.com/JiLiZART/bbob/issues/107)) ([93d8027](https://github.com/JiLiZART/bbob/commit/93d802773cbe733ccf4b0124257c6fc6707c873b))

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

### Bug Fixes

- **react:** adjust PropTypes for React Component `container` ([#107](https://github.com/JiLiZART/bbob/issues/107)) ([93d8027](https://github.com/JiLiZART/bbob/commit/93d802773cbe733ccf4b0124257c6fc6707c873b))

# [2.7.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.7.0) (2021-05-19)

### Bug Fixes

- **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))

## [2.6.2](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.2) (2020-12-16)

### Bug Fixes

- **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))

## [2.6.1](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.1) (2020-12-15)

### Bug Fixes

- **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))

# [2.6.0](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.6.0) (2020-12-10)

### Bug Fixes

- **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))

## [2.5.9](https://github.com/JiLiZART/bbob/compare/v2.5.8...v2.5.9) (2020-11-16)

### Bug Fixes

- **react:** rendering self-closed tags and tags without content ([#74](https://github.com/JiLiZART/bbob/issues/74)) ([5a7211d](https://github.com/JiLiZART/bbob/commit/5a7211db918fd773ffc5b3ec5c82a2a3d1c2821c))

## [2.5.8](https://github.com/JiLiZART/bbob/compare/v2.5.7...v2.5.8) (2020-07-08)

**Note:** Version bump only for package @bbob/react

## [2.5.7](https://github.com/JiLiZART/bbob/compare/v2.5.6...v2.5.7) (2020-07-05)

**Note:** Version bump only for package @bbob/react

## [2.5.6](https://github.com/JiLiZART/bbob/compare/v2.5.5...v2.5.6) (2020-04-12)

**Note:** Version bump only for package @bbob/react

## [2.5.5](https://github.com/JiLiZART/bbob/compare/v2.5.4...v2.5.5) (2020-03-25)

**Note:** Version bump only for package @bbob/react

<a name="2.5.4"></a>

## [2.5.4](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.4) (2019-09-25)

### Bug Fixes

- **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
- **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))

<a name="2.5.3"></a>

## [2.5.3](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.3) (2019-08-11)

### Bug Fixes

- **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
- **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))

<a name="2.5.2"></a>

## [2.5.2](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.2) (2019-06-30)

### Bug Fixes

- **bbob-react:** remove `unique "key" prop` warning ([#30](https://github.com/JiLiZART/bbob/issues/30)) ([3d5c1f1](https://github.com/JiLiZART/bbob/commit/3d5c1f1)), closes [#28](https://github.com/JiLiZART/bbob/issues/28)
- **react:** fix broken prop type definition ([#27](https://github.com/JiLiZART/bbob/issues/27)) ([19d7ff2](https://github.com/JiLiZART/bbob/commit/19d7ff2))

<a name="2.5.1"></a>

## [2.5.1](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.1) (2019-06-18)

**Note:** Version bump only for package @bbob/react

<a name="2.5.0"></a>

# [2.5.0](https://github.com/JiLiZART/bbob/compare/v2.4.1...v2.5.0) (2019-06-17)

**Note:** Version bump only for package @bbob/react

<a name="2.4.1"></a>

## [2.4.1](https://github.com/JiLiZART/bbob/compare/v2.4.0...v2.4.1) (2019-03-29)

### Bug Fixes

- **react:** move [@bbob](https://github.com/bbob)/preset-react to dev deps due to circular deps ([3af3ea8](https://github.com/JiLiZART/bbob/commit/3af3ea8))

<a name="2.4.0"></a>

# [2.4.0](https://github.com/JiLiZART/bbob/compare/v2.3.4...v2.4.0) (2019-03-29)

**Note:** Version bump only for package @bbob/react

<a name="2.3.4"></a>

## [2.3.4](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.4) (2019-03-29)

### Bug Fixes

- **react:** add prop componentProps ([#9](https://github.com/JiLiZART/bbob/issues/9)) ([1dafb69](https://github.com/JiLiZART/bbob/commit/1dafb69))

<a name="2.3.3"></a>

## [2.3.3](https://github.com/JiLiZART/bbob/compare/v2.3.2...v2.3.3) (2019-03-29)

### Bug Fixes

- **react:** add prop componentProps ([#9](https://github.com/JiLiZART/bbob/issues/9)) ([1dafb69](https://github.com/JiLiZART/bbob/commit/1dafb69))

<a name="2.3.2"></a>

## [2.3.2](https://github.com/JiLiZART/bbob/compare/v2.3.1...v2.3.2) (2019-03-09)

**Note:** Version bump only for package @bbob/react

<a name="2.3.1"></a>

## [2.3.1](https://github.com/JiLiZART/bbob/compare/v2.3.0...v2.3.1) (2019-03-04)

**Note:** Version bump only for package @bbob/react

<a name="2.3.0"></a>

# [2.3.0](https://github.com/JiLiZART/bbob/compare/v2.2.0...v2.3.0) (2018-10-25)

### Features

- **react:** allow pass custom options to react component ([77b30f3](https://github.com/JiLiZART/bbob/commit/77b30f3))

<a name="2.2.0"></a>

# 2.2.0 (2018-10-11)

### Bug Fixes

- **react:** remove jsx ([ada2c00](https://github.com/JiLiZART/bbob/commit/ada2c00))

### Features

- react render support, move some helper functions to plugin-helper ([1a84968](https://github.com/JiLiZART/bbob/commit/1a84968))
- new [@bbob](https://github.com/bbob)/html api ([#4](https://github.com/JiLiZART/bbob/issues/4)) ([575c1bb](https://github.com/JiLiZART/bbob/commit/575c1bb))

<a name="2.0.3"></a>

## <small>2.0.3 (2018-10-07)</small>

**Note:** Version bump only for package @bbob/react

<a name="2.0.2"></a>

## [2.0.2](https://github.com/JiLiZART/bbob/compare/@bbob/react@2.0.1...@bbob/react@2.0.2) (2018-10-07)

**Note:** Version bump only for package @bbob/react

<a name="2.0.1"></a>

## [2.0.1](https://github.com/JiLiZART/bbob/compare/@bbob/react@2.0.0...@bbob/react@2.0.1) (2018-09-23)

**Note:** Version bump only for package @bbob/react

<a name="1.1.0"></a>

# [1.1.0](https://github.com/JiLiZART/bbob/compare/@bbob/react@1.0.7...@bbob/react@1.1.0) (2018-08-09)

### Features

- react render support, move some helper functions to plugin-helper ([1a84968](https://github.com/JiLiZART/bbob/commit/1a84968))

<a name="1.0.7"></a>

## [1.0.7](https://github.com/JiLiZART/bbob/compare/@bbob/react@1.0.6...@bbob/react@1.0.7) (2018-07-13)

**Note:** Version bump only for package @bbob/react

<a name="1.0.6"></a>

## [1.0.6](https://github.com/JiLiZART/bbob/compare/@bbob/react@1.0.5...@bbob/react@1.0.6) (2018-07-11)

**Note:** Version bump only for package @bbob/react

<a name="1.0.5"></a>

## [1.0.5](https://github.com/JiLiZART/bbob/compare/@bbob/react@1.0.4...@bbob/react@1.0.5) (2018-07-10)

**Note:** Version bump only for package @bbob/react

<a name="1.0.4"></a>

## [1.0.4](https://github.com/JiLiZART/bbob/compare/@bbob/react@1.0.3...@bbob/react@1.0.4) (2018-07-10)

**Note:** Version bump only for package @bbob/react

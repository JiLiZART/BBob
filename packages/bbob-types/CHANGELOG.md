# @bbob/types

## 4.3.1

### Patch Changes

- [#281](https://github.com/JiLiZART/BBob/pull/281) [`322f88a`](https://github.com/JiLiZART/BBob/commit/322f88ad423c87252bda10c7dfd8677c8d6c9ced) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now `@bbob/parser` correctly parses tags like

  ```html
  [url=javascript:alert('XSS ME');]TEXT[/url]
  ```

  to correct attributes

  ```json
  {
    "tag": "url",
    "attrs": {
      "javascript:alert('XSS ME')": "javascript:alert('XSS ME')"
    },
    "content": ["TEXT"],
    "start": {
      "from": 0,
      "to": 38
    },
    "end": {
      "from": 38,
      "to": 42
    }
  }
  ```

  Fixes #300

## 4.3.0

### Minor Changes

- [#280](https://github.com/JiLiZART/BBob/pull/280) [`9a69869`](https://github.com/JiLiZART/BBob/commit/9a6986965e986f8ea1f3217439ee639733a72e01) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now all file protocol urls will be escaped like `file://some/path/to/file` will be converted to `file%3A//some/path/to/file`

- [`24c9655`](https://github.com/JiLiZART/BBob/commit/24c9655e2be9c24ff7552e927b6d32b1782e0a96) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Add support `width` and `height` and `alt` for `[img]` tag

- [#272](https://github.com/JiLiZART/BBob/pull/272) [`0566241`](https://github.com/JiLiZART/BBob/commit/0566241e2315cae0879ecb3ab467c83e99f0cc49) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Added `whitespaceInTags` parsing option (true by default) with this option you can disable parsing `[tags with spaces]` it will be considered as text

  ```js
  import html5 from "@bbob/preset-html5";
  import parse from "@bbob/html";

  const html = parse("[b]lorem[/b] [foo bar] [i]ipsum[/i]", html5(), {
    whitespaceInTags: false,
  });

  console.log(html); // <b>lorem </b> [foo bar] <i>ipsum</i>
  ```

### Patch Changes

- [#291](https://github.com/JiLiZART/BBob/pull/291) [`0edd490`](https://github.com/JiLiZART/BBob/commit/0edd490a245bf50d1cac21645be905287081fae3) Thanks [@longnguyen2004](https://github.com/longnguyen2004)! - fix: proper module resolution in all cases (Node CJS, Node ESM, bundler)

  Allow usages of this library in ESM scenarios (Vite SSR, pure Node using ESM) by fixing incorrect exports of the ESM output (use correct .mjs extension, separate types files for CJS and ESM output, package.json fixes)

  Fixes #232, #214, #135

- [#294](https://github.com/JiLiZART/BBob/pull/294) [`40041a0`](https://github.com/JiLiZART/BBob/commit/40041a06806c1ded21435f102c4c0838e372fce5) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now `React` preset `@bbob/preset-react` supports `color` tag

  ```js
  import preset from "@bbob/preset-react";
  import { render } from "@bbob/react";

  const html = render(
    "[color=#ff0000]This text should be red[/color]",
    preset()
  );
  ```

- [#297](https://github.com/JiLiZART/BBob/pull/297) [`29f909a`](https://github.com/JiLiZART/BBob/commit/29f909a589bd7b7ac67ec2003b3c7138ce5898cc) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now `@bbob/parser` correctly parses nested tags like

  ```html
  Hello World[u]Wrong underline[u] This is another text [u]and this, too[/u]
  ```

  to

  ```html
  Hello World[u]Wrong underline[u] This is another text <u>and this, too</u>
  ```

  Fixes #296, #295

- [#290](https://github.com/JiLiZART/BBob/pull/290) [`e943184`](https://github.com/JiLiZART/BBob/commit/e943184294c42e35e161d4c5775aa22731fa2c5a) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Now `@bbob/parser` in context free tags mode correctly parses

  code like

  ```html
  [code][codeButton]text[/codeButton][/code]
  ```

  will be parsed correctly to

  ```html
  <code>[codeButton]text[/codeButton]</code>
  ```

  Fixes #289

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

## 4.1.1

### Patch Changes

- [#248](https://github.com/JiLiZART/BBob/pull/248) [`27c8c4b`](https://github.com/JiLiZART/BBob/commit/27c8c4b869bc0e26905e1b4555036ac65baaa1c6) Thanks [@GetPastTheMonkey](https://github.com/GetPastTheMonkey)! - Removed `defaultProps` and
  Warning for deprecated defaultProps

## 4.1.0

### Minor Changes

- [#246](https://github.com/JiLiZART/BBob/pull/246) [`4084874`](https://github.com/JiLiZART/BBob/commit/40848747d4c52a3752ff3803f7643072e916631e) Thanks [@Alteras1](https://github.com/Alteras1)! - feat: Add start and end positions of tag nodes

## 4.0.3

### Patch Changes

- [#242](https://github.com/JiLiZART/BBob/pull/242) [`16ad521`](https://github.com/JiLiZART/BBob/commit/16ad5216dbdb58f15baa79a7f4596e6281043f5f) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Added `vue3` and `react` examples in `examples` folder

  For `vue2` and `vue3` plugins you can use now `<bbob-bbcode>`, `<BBobBBCode>` and `<BBCode>` tags

## 4.0.1

### Patch Changes

- [`dd7696c`](https://github.com/JiLiZART/BBob/commit/dd7696ca4bc5122563d897048f46ca6a16f21de6) Thanks [@JiLiZART](https://github.com/JiLiZART)! - Fixes problem where `@bbob/html@4.0.0` depends on `@bbob/core@3.0.2` instead of `^4.0.0`


<p align="center">
  <img alt="BBob a BBCode processor" src="https://github.com/JiLiZART/bbob/blob/master/.github/logo.png?raw=true" />
</p>

BBob is a tool to parse and transform [BBCode](https://en.wikipedia.org/wiki/BBCode)
written in pure javascript, no dependencies

[![Tests](https://github.com/JiLiZART/BBob/actions/workflows/test.yml/badge.svg)](https://github.com/JiLiZART/BBob/actions/workflows/test.yml)
[![Benchmark](https://github.com/JiLiZART/BBob/actions/workflows/benchmark.yml/badge.svg)](https://github.com/JiLiZART/BBob/actions/workflows/benchmark.yml)
<a href="https://codecov.io/gh/JiLiZART/bbob">
  <img src="https://codecov.io/gh/JiLiZART/bbob/branch/master/graph/badge.svg" alt="codecov">
</a> 
<a href="https://www.codefactor.io/repository/github/jilizart/bbob">
  <img src="https://www.codefactor.io/repository/github/jilizart/bbob/badge" alt="CodeFactor">
</a> 
<a href="https://bettercodehub.com/">
<img src="https://bettercodehub.com/edge/badge/JiLiZART/bbob?branch=master" alt="BCH compliance">
</a> 
<a href="https://snyk.io/test/github/JiLiZART/bbob?targetFile=package.json">
  <img src="https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=package.json" alt="Known Vulnerabilities">
</a>

## Packages

| Package              | Status                                                     | Size    | Description               |
|----------------------|------------------------------------------------------------|---------|---------------------------|
| @bbob/core           | [![@bbob/core-status]][@bbob/core-package]                 | ![@bbob/core-size] | Core package              |
| @bbob/react          | [![@bbob/react-status]][@bbob/react-package]               | ![@bbob/react-size]  | React renderer            |
| @bbob/preset-react   | [![@bbob/preset-react-status]][@bbob/preset-react-package] | ![@bbob/preset-react-size]  | React default tags preset |
| @bbob/vue2           | [![@bbob/vue2-status]][@bbob/vue2-package]                 | ![@bbob/vue2-size]  | Vue 2 renderer            |
| @bbob/preset-vue     | [![@bbob/preset-vue-status]][@bbob/preset-vue-package]     | ![@bbob/preset-react-size]  | Vue default tags preset |
| @bbob/html           | [![@bbob/html-status]][@bbob/html-package]                 | ![@bbob/html-size]  | HTML renderer             |
| @bbob/preset-html5   | [![@bbob/preset-html5-status]][@bbob/preset-html5-package] | ![@bbob/preset-html5-size]  | HTML5 default tags preset |

[@bbob/core-status]: https://img.shields.io/npm/v/@bbob/core.svg

[@bbob/react-status]: https://img.shields.io/npm/v/@bbob/react.svg
[@bbob/preset-react-status]: https://img.shields.io/npm/v/@bbob/preset-react.svg

[@bbob/vue2-status]: https://img.shields.io/npm/v/@bbob/vue2.svg
[@bbob/preset-vue-status]: https://img.shields.io/npm/v/@bbob/preset-vue.svg

[@bbob/html-status]: https://img.shields.io/npm/v/@bbob/html.svg
[@bbob/preset-html5-status]: https://img.shields.io/npm/v/@bbob/preset-html5.svg

[@bbob/core-size]: https://badgen.net/bundlephobia/minzip/@bbob/core

[@bbob/react-size]: https://badgen.net/bundlephobia/minzip/@bbob/react
[@bbob/preset-react-size]: https://badgen.net/bundlephobia/minzip/@bbob/preset-react

[@bbob/vue2-size]: https://badgen.net/bundlephobia/minzip/@bbob/vue2
[@bbob/preset-vue-size]: https://badgen.net/bundlephobia/minzip/@bbob/preset-vue

[@bbob/html-size]: https://badgen.net/bundlephobia/minzip/@bbob/html
[@bbob/preset-html5-size]: https://badgen.net/bundlephobia/minzip/@bbob/preset-html5

[@bbob/core-package]: https://npmjs.com/package/@bbob/core

[@bbob/react-package]: https://npmjs.com/package/@bbob/react
[@bbob/preset-react-package]: https://npmjs.com/package/@bbob/preset-react

[@bbob/vue2-package]: https://npmjs.com/package/@bbob/vue2
[@bbob/preset-vue-package]: https://npmjs.com/package/@bbob/preset-vue

[@bbob/html-package]: https://npmjs.com/package/@bbob/html
[@bbob/preset-html5-package]: https://npmjs.com/package/@bbob/preset-html5

[DEMO Playground](https://codepen.io/JiLiZART/full/vzMvpd)

## Table of contents
* [Usage](#usage)
  * [Basic usage](#basic-usage)
  * [React usage](#react-usage)
  * [Vue 2 usage](#vue2-usage)
* [Parse Options](#parse-options)
* [Presets](#presets)
   * [Create your own preset](#create-preset)
   * [HTML Preset](#html-preset)
   * [React Preset](#react-preset)
* [React usage](#react)
   * [Component](#react-component)
   * [Render prop](#react-render)
* [PostHTML usage](#posthtml)
* [Create Plugin](#plugin)
* [Benchmarks](#benchmarks)

### Basic usage <a name="basic-usage"></a>

```shell
npm i @bbob/core @bbob/html @bbob/preset-html5
```

```js
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbobHTML(`[i]Text[/i]`, presetHTML5())

console.log(processed); // <span style="font-style: italic;">Text</span>
```

### React usage <a name="react-usage"></a>

```shell
npm i @bbob/react @bbob/preset-react
```

```js
import React from 'react'
import {render} from 'react-dom'
import bbobReactRender from '@bbob/react/es/render'
import presetReact from '@bbob/preset-react'

const options = { onlyAllowTags: ['i'], enableEscapeTags: true, contextFreeTags: ['code'] }
const content = bbobReactRender(`[i]Text[/i]`, presetReact(), options)

console.log(render(<span>{content}</span>)); // <span><span style="font-style: italic;">Text</span></span>
```

### Vue 2 usage <a name="vue2-usage"></a>

```shell
npm i @bbob/vue2 @bbob/preset-vue
```

```js
import Vue from 'vue'
import VueBbob from '@bbob/vue2';

Vue.use(VueBbob);
```

```html
<template>
  <div class="html">
    <h2>Generated HTML here</h2>
    <bbob-bbcode container="div" :plugins="plugins">{{ bbcode }}</bbob-bbcode>
  </div>
</template>
<script>
  import Vue from 'vue'
  import preset from '@bbob/preset-vue'
  
  export default Vue.extend({
    name: 'App',
    data() {
      return {
        bbcode: 'Text [b]bolded[/b] and [i]Some Name[/i]',
        plugins: [
          preset()
        ],
      }
    }
  })
</script>
```
More examples available in <a href="https://github.com/JiLiZART/BBob/tree/master/examples">examples folder</a>

### Parse options <a name="parse-options"></a>

#### onlyAllowTags

Parse only allowed tags

```js
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbobHTML(`[i][b]Text[/b][/i]`, presetHTML5(), { onlyAllowTags: ['i'] })

console.log(processed); // <span style="font-style: italic;">[b]Text[/b]</span>
```

#### contextFreeTags

Enable context free mode that ignores parsing all tags inside given tags

```js
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbobHTML(`[b]Text[/b][code][b]Text[/b][/code]`, presetHTML5(), { contextFreeTags: ['code'] })

console.log(processed); // <span style="font-weight: bold;">Text</span><pre>[b]Text[/b]</pre>
```

#### enableEscapeTags

Enable escape support for tags

```js
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbobHTML(`[b]Text[/b]'\\[b\\]Text\\[/b\\]'`, presetHTML5(), { enableEscapeTags: true })

console.log(processed); // <span style="font-weight: bold;">Text</span>[b]Text[/b]
```


### Presets <a name="basic"></a>

Its a way to transform parsed BBCode AST tree to another tree by rules in preset

#### Create your own preset <a name="create-preset"></a>

```js
import { createPreset } from '@bbob/preset'

export default createPreset({
  quote: (node) => ({
    tag: 'blockquote',
    attrs: node.attrs,
    content: [{
      tag: 'p',
      attrs: {},
      content: node.content,
    }],
  }),
})
```

#### HTML Preset <a name="html-preset"></a>

Also you can use predefined preset for HTML

```js
import html5Preset from '@bbob/preset-html5/es'
import { render } from '@bbob/html/es'
import bbob from '@bbob/core'

console.log(bbob(html5Preset()).process(`[quote]Text[/quote]`, { render }).html) // <blockquote><p>Text</p></blockquote>
```

#### React Preset <a name="react-preset"></a>

Also you can use predefined preset for React

```js
import reactPreset from "@bbob/preset-react";
import reactRender from "@bbob/react/es/render";

const preset = reactPreset.extend((tags, options) => ({
  ...tags,
  quote: node => ({
    tag: "blockquote",
    content: node.content
  })
}));

const result = reactRender(`[quote]Text[/quote]`, reactPreset());

/* 
It produces a VDOM Nodes equal to
React.createElement('blockquote', 'Text')
*/
document.getElementById("root").innerHTML = JSON.stringify(result, 4);
```

[![Edit lp7q9yj0lq](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lp7q9yj0lq)

### React usage <a name="react"></a>

#### Component <a name="react-component"></a>

Or you can use React Component

```js
import React from 'react'
import { render } from 'react-dom'

import BBCode from '@bbob/react/es/Component'
import reactPreset from '@bbob/preset-react/es'

const MyComponent = () => (
  <BBCode plugins={[reactPreset()]} options={{ onlyAllowTags: ['i'] }}>
    [quote]Text[/quote]
  </BBCode>
)

render(<MyComponent />) // <div><blockquote><p>Text</p></blockquote></div>
```
[![Edit 306pzr9k5p](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/306pzr9k5p)


#### Render prop <a name="react-render"></a>

Or pass result as render prop

```js
import React from "react";
import { render } from 'react-dom'

import reactRender from '@bbob/react/es/render'
import reactPreset from '@bbob/preset-react/es'

const toReact = input => reactRender(input, reactPreset())

const text = toReact('[b]Super [i]easy[/i][/b] [u]to[/u] render')

const App = ({ renderProp }) => (
  <span>{text}</span>
)

render(<App />) // <span><span style="font-weight: bold;">Super <span style="font-style: italic;">easy</span></span> <span style="text-decoration: underline;">to</span> render</span>
```

[![Edit x7w52lqmzz](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jovial-cohen-bvo08)

### PostHTML usage <a name="posthtml"></a>

### Create Plugin <a name="plugin"></a>

For example lets parse all strings that similar to links like "https://some-site.com"

```js
import { createRoot } from "react-dom/client";

import BBCode from "@bbob/react/es/Component";
import TagNode from "@bbob/plugin-helper/es/TagNode";
import { isStringNode } from "@bbob/plugin-helper/es";

const URL_RE = new RegExp(
  `([--:\\w?@%&+~#=]+\\/*\\.[a-z]{2,4}\\/{0,2})((?:[?&](?:\\w+)=(?:\\w+))+|[^^).|,][--:\\w?@%&+~#=()_]+)?`,
  "g"
);

const isValidUrl = (url) => URL_RE.test(url);

const linkParsePlugin = (tree) => {
  return tree.walk((node) => {
    if (isStringNode(node) && isValidUrl(node)) {
      return TagNode.create(
        "a",
        {
          href: node
        },
        `Url to: ${node}`
      );
    }

    return node;
  });
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BBCode plugins={[linkParsePlugin]}>
    https://github.com/JiLiZART/BBob Other text without link
  </BBCode>
);
```

[![Edit x7w52lqmzz](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/bbob-plugin-example-dmq1bh)


### Benchmarks <a name="benchmarks"></a>

To test on your machine run
```shell
npm run build
node benchmark
```

Tested on Node v12.18.3

| Package              | Ops/sec              | Runs sampled      |
|----------------------|----------------------|-------------------|
| regex/parser         | 6.02 ops/sec ±2.77%  | (20 runs sampled) |
| ya-bbcode            | 10.70 ops/sec ±1.94% | (31 runs sampled) |
| xbbcode/parser       | 107 ops/sec ±2.29%   | (69 runs sampled) |
| @bbob/parser         | 140 ops/sec ±1.11%   | (78 runs sampled) |


Developed with <3 using JetBrains

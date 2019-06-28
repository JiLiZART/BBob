
<p align="center">
  <img alt="BBob a BBCode processor" src="https://github.com/JiLiZART/bbob/blob/master/.github/logo.png?raw=true" />
</p>

BBob is a tool to parse and transform [BBCode](https://en.wikipedia.org/wiki/BBCode)
written in pure javascript, no dependencies

<a href="https://travis-ci.org/JiLiZART/bbob">
  <img src="https://travis-ci.org/JiLiZART/bbob.svg?branch=master" alt="Build Status">
</a> 
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
| @bbob/html           | [![@bbob/html-status]][@bbob/html-package]                 | ![@bbob/html-size]  | HTML renderer             |
| @bbob/preset-html5   | [![@bbob/preset-html5-status]][@bbob/preset-html5-package] | ![@bbob/preset-html5-size]  | HTML5 default tags preset |

[@bbob/core-status]: https://img.shields.io/npm/v/@bbob/core.svg
[@bbob/react-status]: https://img.shields.io/npm/v/@bbob/react.svg
[@bbob/preset-react-status]: https://img.shields.io/npm/v/@bbob/preset-react.svg
[@bbob/html-status]: https://img.shields.io/npm/v/@bbob/html.svg
[@bbob/preset-html5-status]: https://img.shields.io/npm/v/@bbob/preset-html5.svg

[@bbob/core-size]: https://badgen.net/bundlephobia/minzip/@bbob/core
[@bbob/react-size]: https://badgen.net/bundlephobia/minzip/@bbob/react
[@bbob/preset-react-size]: https://badgen.net/bundlephobia/minzip/@bbob/preset-react
[@bbob/html-size]: https://badgen.net/bundlephobia/minzip/@bbob/html
[@bbob/preset-html5-size]: https://badgen.net/bundlephobia/minzip/@bbob/preset-html5


[@bbob/core-package]: https://npmjs.com/package/@bbob/core
[@bbob/react-package]: https://npmjs.com/package/@bbob/react
[@bbob/preset-react-package]: https://npmjs.com/package/@bbob/preset-react
[@bbob/html-package]: https://npmjs.com/package/@bbob/html
[@bbob/preset-html5-package]: https://npmjs.com/package/@bbob/preset-html5

[DEMO Playground](https://codepen.io/JiLiZART/full/vzMvpd)

## Table of contents
* [Usage](#usage)
  * [Basic usage](#basic-usage)
  * [React usage](#react-usage)
* [Presets](#presets)
   * [Create your own preset](#create-preset)
   * [HTML Preset](#html-preset)
   * [React Preset](#react-preset)
* [React usage](#react)
   * [Component](#react-component)
   * [Render prop](#react-render)
* [PostHTML usage](#posthtml)
* [Create Plugin](#plugin)

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

console.log(render(<span>{bbobReactRender(`[i]Text[/i]`, presetReact(), { onlyAllowTags: ['i'] })}</span>)); // <span><span style="font-style: italic;">Text</span></span>
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

[![Edit x7w52lqmzz](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x7w52lqmzz)

### PostHTML usage <a name="posthtml"></a>

### Create Plugin <a name="plugin"></a>

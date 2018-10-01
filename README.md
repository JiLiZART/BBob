# BBob

<div align="center">
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
</div>

BBob is a tool to parse and transform [BBCode](https://en.wikipedia.org/wiki/BBCode)
Written in pure javascript, no dependencies

## Packages

| Package              | Status                                                     | Size    | Description               |
|----------------------|------------------------------------------------------------|---------|---------------------------|
| @bbob/core           | [![@bbob/core-status]][@bbob/core-package]                 | `1.5K`  | Core package              |
| @bbob/react          | [![@bbob/react-status]][@bbob/react-package]               | `1.0K`  | React renderer         |
| @bbob/preset-react   | [![@bbob/preset-react-status]][@bbob/preset-react-package] | `1.0K`  | React default tags preset         |
| @bbob/html           | [![@bbob/html-status]][@bbob/html-package]                 | `0.7K`  | Vue.js integration        |
| @bbob/preset-html5   | [![[@bbob/preset-html5-status]][@bbob/preset-html5-package]| `1.1K`  | Preact integration        |

[@bbob/core-status]: https://img.shields.io/npm/v/@bbob/core.svg
[@bbob/react-status]: https://img.shields.io/npm/v/@bbob/react.svg
[@bbob/preset-react-status]: https://img.shields.io/npm/v/@bbob/preset-react.svg
[@bbob/html-status]: https://img.shields.io/npm/v/@bbob/html.svg
[@bbob/preset-html5-status]: https://img.shields.io/npm/v/@bbob/preset-html5.svg

[@bbob/core-package]: https://npmjs.com/package/@bbob/core
[@bbob/react-package]: https://npmjs.com/package/@bbob/react
[@bbob/preset-react-package]: https://npmjs.com/package/@bbob/preset-react
[@bbob/html-package]: https://npmjs.com/package/@bbob/html
[@bbob/preset-html5-package]: https://npmjs.com/package/@bbob/preset-html5

[DEMO Playground](https://codepen.io/JiLiZART/full/vzMvpd)

## Table of contents
* [Basic usage](#basic)
* [Presets](#presets)
   * [Create your own preset](#create-preset)
   * [HTML Preset](#html-preset)
   * [React Preset](#react-preset)
* [React usage](#react)
   * [Component](#react-component)
   * [Render prop](#react-render)
* [PostHTML usage](#posthtml)
* [Create Plugin](#plugin)

### Basic usage <a name="basic"></a>

```js
import bbob from '@bbob/core'
import { render } from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbob(presetHTML5()).process(`[i]Text[/i]`, { render })

console.log(processed.html); // <span style="font-style: italic;">Text</span>
```

### Presets <a name="basic"></a>

Its a way to transform parsed BBCode AST tree to another tree by rules in preset

#### Create your own preset <a name="create-preset"></a>

```js
import { createPreset } from '@bbob/preset'
import { render } from '@bbob/html'
import bbob from '@bbob/core'

const preset = createPreset({
  quote: node => ({
    tag: 'blockquote',
    attrs: {},
    content: [{
      tag: 'p',
      attrs: {},
      content: node.content,
    }],
  }),
})

console.log(bbob(preset()).process(`[quote]Text[/quote]`, { render }).html) // <blockquote><p>Text</p></blockquote>
```

#### HTML Preset <a name="html-preset"></a>

Also you can use predefined preset for HTML

```js

```

#### React Preset <a name="react-preset"></a>

### React usage <a name="react"></a>

### Component <a name="react-component"></a>

### Render prop <a name="react-render"></a>

## PostHTML usage <a name="posthtml"></a>

## Create Plugin <a name="plugin"></a>

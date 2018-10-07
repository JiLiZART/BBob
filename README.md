# BBob

<div align="center">
  <img alt="BBob a BBCode processor" src="https://github.com/JiLiZART/bbob/blob/master/.github/logo.png?raw=true" />
</div>

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

BBob is a tool to parse and transform [BBCode](https://en.wikipedia.org/wiki/BBCode)
written in pure javascript, no dependencies

## Packages

| Package              | Status                                                     | Size    | Description               |
|----------------------|------------------------------------------------------------|---------|---------------------------|
| @bbob/core           | [![@bbob/core-status]][@bbob/core-package]                 | `3.2K`  | Core package              |
| @bbob/react          | [![@bbob/react-status]][@bbob/react-package]               | `1.0K`  | React renderer            |
| @bbob/preset-react   | [![@bbob/preset-react-status]][@bbob/preset-react-package] | `1.8K`  | React default tags preset |
| @bbob/html           | [![@bbob/html-status]][@bbob/html-package]                 | `689B`  | HTML renderer             |
| @bbob/preset-html5   | [![@bbob/preset-html5-status]][@bbob/preset-html5-package] | `1.6K`  | HTML5 default tags preset |

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

```shell
npm i @bbob/core @bbob/html @bbob/preset-html5
```

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
import html5Preset from '@bbob/preset-html5'
import { render } from '@bbob/html'
import bbob from '@bbob/core'

console.log(bbob(html5Preset()).process(`[quote]Text[/quote]`, { render }).html) // <blockquote><p>Text</p></blockquote>
```

#### React Preset <a name="react-preset"></a>

Also you can use predefined preset for React

```js
import reactPreset from '@bbob/preset-react'
import { render } from '@bbob/react'
import bbob from '@bbob/core'

console.log(bbob(reactPreset()).process(`[quote]Text[/quote]`, { render }).html) 
/* It produces a VDOM Nodes equal to
  React.createElement('blockquote', React.createElement('p', 'Text'))
*/
```

### React usage <a name="react"></a>

#### Component <a name="react-component"></a>

Or you can use React Component

```jsx
import React from 'react'
import { render } from 'react-dom'

import BBCode from '@bbob/react'
import reactPreset from '@bbob/preset-react'

const MyComponent = () => (
  <BBCode plugins={[reactPreset()]}>
    [quote]Text[/quote]
  </BBCode>
)

render(<MyComponent />) // <div><blockquote><p>Text</p></blockquote></div>
```

#### Render prop <a name="react-render"></a>

### PostHTML usage <a name="posthtml"></a>

### Create Plugin <a name="plugin"></a>

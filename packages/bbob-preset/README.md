#@bbob/preset
Base function for create presets to process bbcode AST to HTML or Framework specific tags

## Install

```bash
npm i @bbob/preset
```
### API

**For plain HTML**

```js
import { createPreset } from '@bbob/core'

import { createPreset } from '@bbob/preset'

const options = {
    onlyAllowTags: ['url', 'h'],
    onError: (err) => console.warn(err.message, err.lineNumber, err.columnNumber)
};
const pre = parse('[url=https://github.com]hello world![/url]', options)
```
## Usage

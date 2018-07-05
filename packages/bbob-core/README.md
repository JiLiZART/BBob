# bbob

## Usage

```js
const bbob = require('@bbob/core');
const presetHTML5 = require('@bbob/preset-html5');
const code = `[i]Text[/i]`;

const processor = bbob([presetHTML5]).process(code, {sync: true})
```

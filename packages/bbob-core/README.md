# @bbob/core

## Usage

```js
const bbob = require('@bbob/core');
const render = require('@bbob/html');
const presetHTML5 = require('@bbob/preset-html5');
const code = `[i]Text[/i]`;

const html = bbob([presetHTML5()]).process(code, { render }).html;

console.log(html); // <span style="font-style: italic;">Text</span>
```

# @bbob/core

## Usage

```js
import bbob from '@bbob/core'
import { render } from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
const code = `[i]Text[/i]`;

const html = bbob(presetHTML5()).process(code, { render }).html;

console.log(html); // <span style="font-style: italic;">Text</span>
```

---
"@bbob/parser": patch
"@bbob/types": patch
"@bbob/cli": patch
"@bbob/core": patch
"@bbob/html": patch
"@bbob/plugin-helper": patch
"@bbob/preset": patch
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
"@bbob/react": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
---

Now `React` preset `@bbob/preset-react` supports `color` tag

```js
import preset from '@bbob/preset-react'
import { render } from '@bbob/react'

const html = render('[color=#ff0000]This text should be red[/color]', preset());
```

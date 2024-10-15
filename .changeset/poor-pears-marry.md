---
"@bbob/parser": minor
"@bbob/types": minor
"@bbob/cli": minor
"@bbob/core": minor
"@bbob/html": minor
"@bbob/plugin-helper": minor
"@bbob/preset": minor
"@bbob/preset-html5": minor
"@bbob/preset-react": minor
"@bbob/preset-vue": minor
"@bbob/react": minor
"@bbob/vue2": minor
"@bbob/vue3": minor
---

New option flag `caseFreeTags` has been added

This flag allows to parse case insensitive tags like `[h1]some[/H1]` -> `<h1>some</h1>`

```js
import html from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = html(`[h1]some[/H1]`, presetHTML5(), { caseFreeTags: true })

console.log(processed); // <h1>some</h1>
```

Also now you can pass `caseFreeTags` to `parse` function

```js
import { parse } from '@bbob/parser'

const ast = parse('[h1]some[/H1]', {
  caseFreeTags: true
});
```

BREAKING CHANGE: `isTokenNested` function now accepts string `tokenValue` instead of `token`

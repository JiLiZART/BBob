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

Added `whitespaceInTags` parsing option (true by default) with this option you can disable parsing `[tags with spaces]` it will be considered as text

```js
import html5 from '@bbob/preset-html5'
import parse from '@bbob/html'

const html = parse('[b]lorem[/b] [foo bar] [i]ipsum[/i]', html5(), {
  whitespaceInTags: false
})

console.log(html) // <b>lorem </b> [foo bar] <i>ipsum</i>
```


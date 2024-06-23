---
"@bbob/plugin-helper": minor
"@bbob/preset-html5": minor
"@bbob/preset-react": minor
"@bbob/preset-vue": minor
"@bbob/parser": minor
"@bbob/preset": minor
"@bbob/react": minor
"@bbob/core": minor
"@bbob/html": minor
"@bbob/vue2": minor
"@bbob/vue3": minor
"@bbob/cli": minor
---

** BREAKING CHANGE **

`TagNode.create` method now by default pass `null` to content instead of empty array `[]`

```js
  // new behavior
  TagNode.create('img').toString() // -> [img]
  // old behavior
  TagNode.create('img', {}, []).toString() // -> [img][/img]
```

Migrate all calls of `TagNode.create('test-tag')` to `TagNode.create('test-tag', {}, [])

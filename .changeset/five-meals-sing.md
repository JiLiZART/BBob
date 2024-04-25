---
"@bbob/plugin-helper": minor
---

** BREAKING CHANGE **


`TagNode.create` method now by default pass `null` to content instead of empty array `[]`

```js
  // new behavior
  TagNode.create('img').toString() // -> [img]
  // old behavior
  TagNode.create('img', {}, []).toString() // -> [img][/img]
```

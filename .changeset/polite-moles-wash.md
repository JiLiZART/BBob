---
"@bbob/parser": minor
"@bbob/cli": minor
"@bbob/core": minor
"@bbob/html": minor
"@bbob/plugin-helper": minor
"@bbob/preset": minor
"@bbob/preset-html5": minor
"@bbob/preset-react": minor
"@bbob/preset-vue": minor
"@bbob/react": minor
"@bbob/types": minor
"@bbob/vue2": minor
"@bbob/vue3": minor
---

Increased performance of `@bbob/parser`
  - Replaced all array searches `[].indexOf` to instant condition comparsion `char === EQ || char === SPACE`
  - Increased performance of nested tokens detection `isTokenNested`
  - Removed redundant object in `CharGrabber`

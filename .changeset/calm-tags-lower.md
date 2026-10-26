---
"@bbob/parser": patch
"@bbob/cli": patch
"@bbob/core": patch
"@bbob/html": patch
"@bbob/plugin-helper": patch
"@bbob/preset": patch
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
"@bbob/react": patch
"@bbob/types": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
---

Fixes #315: with `caseFreeTags: true` the parser now emits lowercase tag names, so `[LIST][*]test[/LIST]` is rendered by presets the same as `[list][*]test[/list]`

---
"@bbob/plugin-helper": patch
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
"@bbob/parser": patch
"@bbob/preset": patch
"@bbob/react": patch
"@bbob/types": patch
"@bbob/core": patch
"@bbob/html": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
"@bbob/cli": patch
---

fixes problem with context free tags

now code like `[code][codeButton]text[/codeButton][/code]` 
will be parsed correctly to `<code>[codeButton]text[/codeButton]</code>`

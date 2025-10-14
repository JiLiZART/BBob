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

Now `@bbob/parser` in context free tags mode correctly parses 

code like
```html
[code][codeButton]text[/codeButton][/code]
```

will be parsed correctly to
```html
<code>[codeButton]text[/codeButton]</code>
```

Fixes #289

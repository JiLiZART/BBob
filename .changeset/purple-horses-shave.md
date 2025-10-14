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

Now `@bbob/parser` correctly parses nested tags like

```html
Hello World[u]Wrong underline[u] This is another text [u]and this, too[/u]
```
to
```html
Hello World[u]Wrong underline[u] This is another text <u>and this, too</u>
```

Fixes #296, #295

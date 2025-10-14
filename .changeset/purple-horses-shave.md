---
"@bbob/parser": major
"@bbob/cli": major
"@bbob/core": major
"@bbob/html": major
"@bbob/plugin-helper": major
"@bbob/preset": major
"@bbob/preset-html5": major
"@bbob/preset-react": major
"@bbob/preset-vue": major
"@bbob/react": major
"@bbob/types": major
"@bbob/vue2": major
"@bbob/vue3": major
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

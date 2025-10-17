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

Now `@bbob/parser` correctly parses tags like

```html
[url=javascript:alert('XSS ME');]TEXT[/url]
```
to
```json 


```


Fixes #300

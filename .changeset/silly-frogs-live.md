---
"@bbob/cli": patch
"@bbob/core": patch
"@bbob/html": patch
"@bbob/parser": patch
"@bbob/plugin-helper": patch
"@bbob/preset": patch
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
"@bbob/react": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
---

Now HTML5 Preset supports `color` tag

```
[color="red"]Red Text[/color]
```

Also fixes bug with case insensitive tags in `onlyAllowTags`
Now you can pas `h1` and `H1` and they will be treated as same tags

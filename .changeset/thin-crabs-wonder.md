---
"@bbob/parser": patch
"@bbob/vue3": patch
---

Fixes bug where nested tag `quote` lost
```
[color=red]test[/color]
[quote]xxxsdfasdf
sdfasdfasdf

[url=xxx]xxx[/url]
```

Now content not will be lost, but not closed tag will displayed as raw text

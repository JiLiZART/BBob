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
"@bbob/types": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
---

Fixes CVE GHSA-p4wh-gqrq-q2wq 

escapeAttrValue function now remove ASCII tab/newline/CR and ignore other control chars when resolving a URL scheme

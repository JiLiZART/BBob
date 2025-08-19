---
"@bbob/cli": patch
"@bbob/core": patch
"@bbob/html": patch
"@bbob/parser": patch
"@bbob/plugin-helper": patch
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
"@bbob/preset": patch
"@bbob/react": patch
"@bbob/types": patch
"@bbob/vue2": patch
"@bbob/vue3": patch
---

fix: proper module resolution in all cases (Node CJS, Node ESM, bundler)

Allow usages of this library in ESM scenarios (Vite SSR, pure Node using ESM) by fixing incorrect exports of the ESM output (use correct .mjs extension, separate types files for CJS and ESM output, package.json fixes)

Fixes #232, #214, #135

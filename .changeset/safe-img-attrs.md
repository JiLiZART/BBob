---
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
---

Security fix (GHSA-69g8-5v35-g33w, CWE-79): the `[img]` tag no longer copies every user-supplied attribute onto the rendered `<img>`. Only `width`, `height`, `alt` and `title` are kept, so `[img onerror="alert(1)"]x[/img]` now renders `<img src="x"/>`.

**Behavior note:** any other attribute on `[img]` (e.g. `class`, `style`, `id`) is dropped. Override the `img` tag via `preset.extend` if you need more.

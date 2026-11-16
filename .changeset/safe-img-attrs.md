---
"@bbob/preset-html5": patch
"@bbob/preset-react": patch
"@bbob/preset-vue": patch
---

Security fix (GHSA-69g8-5v35-g33w, CWE-79): the `[img]` tag no longer copies every user-supplied attribute onto the rendered `<img>`. Only `width`, `height`, `alt`, `title`, `class`, `id`, `style` and `data-*` are kept, so `[img onerror="alert(1)"]x[/img]` now renders `<img src="x"/>`.

`@bbob/preset-react` maps `class` to `className` and converts the `style` string to a style object.

**Behavior note:** any other attribute on `[img]` is dropped. Override the `img` tag via `preset.extend` if you need more. `class`, `id`, `style` and `data-*` values are still user-controlled: if your page has scripts that act on `data-*` attributes or ids, restrict them with your own `img` override.

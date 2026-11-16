# @bbob/wc

[![install size](https://packagephobia.now.sh/badge?p=@bbob/wc)](https://packagephobia.now.sh/result?p=@bbob/wc) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-wc%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-wc%2Fpackage.json)

> `<bb-code>` web component that renders BBCode to HTML

```shell
npm i @bbob/wc
```

```js
import '@bbob/wc'; // registers <bb-code>
```

```html
<bb-code html5>Text [b]bolded[/b] and [i]italic[/i]</bb-code>
```

## Attributes

| Attribute | Description                                                   |
|-----------|---------------------------------------------------------------|
| `html5`   | Enable `@bbob/preset-html5`                                   |
| `use`     | Space-separated names of plugins/presets registered with `BBCodeElement.define` |
| `options` | JSON string of `@bbob/html` options, e.g. `{"stripTags":true}` |

## Custom plugins and presets

Register a plugin or a preset under a name once, then use it from markup:

```js
import BBCodeElement from '@bbob/wc';
import html5Preset from '@bbob/preset-html5';

const myPreset = html5Preset.extend((tags) => ({
  ...tags,
  spoiler: (node) => ({ tag: 'details', attrs: {}, content: node.content }),
}));

BBCodeElement.define('my-preset', myPreset());
BBCodeElement.define('upper', (tree) => tree.walk((node) => (typeof node === 'string' ? node.toUpperCase() : node)));
```

```html
<bb-code use="my-preset upper">[spoiler]hidden[/spoiler]</bb-code>
```

Plugins run in the order listed: `html5` first, then `use`, then the `plugins` property.
Unknown names are skipped until they are defined.

## Properties

Plugins are functions, so they are set as a property:

```js
import preset from '@bbob/preset-html5';

const el = document.querySelector('bb-code');
el.plugins = [preset()];
```

The rendered HTML goes into the element's shadow root. The source text is HTML-escaped before
parsing, so only markup produced by plugins reaches the DOM.

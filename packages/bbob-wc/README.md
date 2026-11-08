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
| `options` | JSON string of `@bbob/html` options, e.g. `{"stripTags":true}` |

## Properties

Plugins are functions, so they are set as a property:

```js
import preset from '@bbob/preset-html5';

const el = document.querySelector('bb-code');
el.plugins = [preset()];
```

The rendered HTML goes into the element's shadow root. The source text is HTML-escaped before
parsing, so only markup produced by plugins reaches the DOM.

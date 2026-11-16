# @bbob/angular
[![install size](https://packagephobia.now.sh/badge?p=@bbob/angular)](https://packagephobia.now.sh/result?p=@bbob/angular) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-angular%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-angular%2Fpackage.json)

> Standalone BBCode component for Angular 22+

```shell
npm i @bbob/angular @bbob/preset-html5
```

```ts
import { Component } from '@angular/core';
import { BBCodeComponent } from '@bbob/angular';
import preset from '@bbob/preset-html5';

@Component({
  selector: 'app-root',
  imports: [BBCodeComponent],
  template: `
    <bbob-bbcode [source]="bbcode" [plugins]="plugins" [trusted]="true"></bbob-bbcode>
  `,
})
export class AppComponent {
  bbcode = '[b]bolded text[/b] [url=https://github.com/JiLiZART/bbob]bbob[/url]';
  plugins = [preset()];
}
```

## Inputs

| Input     | Type                   | Default | Description                                       |
|-----------|------------------------|---------|---------------------------------------------------|
| `source`  | `string`               | `''`    | BBCode string to render                           |
| `plugins` | `BBobPlugins`          | `[]`    | BBob plugins, e.g. `[preset()]`                   |
| `options` | `BBobHTMLOptions`      |         | Options passed to `@bbob/html`                    |
| `trusted` | `boolean`              | `false` | Bypass Angular's HTML sanitizer (see below)       |

## Sanitization

The rendered HTML goes through Angular's `DomSanitizer` by default. The sanitizer strips `style`
attributes, so tags that render as inline styles in `@bbob/preset-html5` (`[b]`, `[i]`, `[color]`, ...)
lose their styling. Set `[trusted]="true"` to bypass the sanitizer. The source text is HTML-escaped
before parsing, so only markup produced by your plugins reaches the DOM either way.

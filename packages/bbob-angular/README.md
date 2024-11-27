# @bbob/angular
[![install size](https://packagephobia.now.sh/badge?p=@bbob/angular)](https://packagephobia.now.sh/result?p=@bbob/angular) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-angular%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-angular%2Fpackage.json)

> Component for Angular framework

```shell
npm i @bbob/angular @bbob/preset-angular
```

```jsx
import React from 'react'
import BBCode from '@bbob/angular';
import presetReact from '@bbob/preset-html5';

const plugins = [presetReact()];

export default () => (
    <BBCode plugins={plugins}>
    [table]
      [tr]
          [td]table 1[/td]
          [td]table 2[/td]
      [/tr]
      [tr]
          [td]table 3[/td]
          [td]table 4[/td]
      [/tr]
    [/table]
    </BBCode>
)
```

```jsx
import { render } from '@bbob/react'

export default () => render(`
[table]
  [tr]
      [td]table 1[/td]
      [td]table 2[/td]
  [/tr]
  [tr]
      [td]table 3[/td]
      [td]table 4[/td]
  [/tr]
[/table]
`)
```

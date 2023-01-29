# @bbob/react
[![install size](https://packagephobia.now.sh/badge?p=@bbob/react)](https://packagephobia.now.sh/result?p=@bbob/react) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-react%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-react%2Fpackage.json)

> Converts @bbob/parser AST tree to React

```shell
npm i @bbob/react @bbob/preset-react
```

```jsx
import React from 'react'
import BBCode from '@bbob/react';
import presetReact from '@bbob/preset-react';

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

# @bbob/react

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

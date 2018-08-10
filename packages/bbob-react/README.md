# @bbob/react

```js
import BBCode from '@bbob/react';
import presetHTML5 from '@bbob/react/lib/preset-html5';

const plugins = [presetHTML5()];

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
```

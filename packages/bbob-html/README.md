# @bbob/html
[![install size](https://packagephobia.now.sh/badge?p=@bbob/html)](https://packagephobia.now.sh/result?p=@bbob/html) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-html%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-html%2Fpackage.json)

> Converts @bbob/parser AST tree to html

```shell
npm i @bbob/html @bbob/preset-html5
```

```js
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

const processed = bbobHTML(`[i]Text[/i]`, presetHTML5())

console.log(processed); // <span style="font-style: italic;">Text</span>
```

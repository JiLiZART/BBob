# @bbob/parser
[![install size](https://packagephobia.now.sh/badge?p=@bbob/parser)](https://packagephobia.now.sh/result?p=@bbob/parser) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-parser%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-parser%2Fpackage.json)

Parses BBCode and returns AST Tree 
Valid for use with [posthtml-render](https://github.com/posthtml/posthtml-render)

## Usage

```js
import parse from '@bbob/parser'

const options = {
    onlyAllowTags: ['url', 'h'],
    onError: (err) => console.warn(err.message, err.lineNumber, err.columnNumber)
}
const ast = parse('[url=https://github.com]hello world![/url]', options)
```

## Results 

```json
[
    {
        "tag": "url",
        "attrs": {
            "url": "https://github.com"
        },
        "content": ["hello", " ", "world!"]
    }
]
```

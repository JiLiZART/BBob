# @bbob/parser
[![install size](https://packagephobia.now.sh/badge?p=@bbob/parser)](https://packagephobia.now.sh/result?p=@bbob/parser) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-parser%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-parser%2Fpackage.json)

Parses BBCode and returns AST Tree looks like


`[url=]hello world![/url]`
to

```json
[
    {
        "tag": "url",
        "attrs": {
            "url": "https://github.com/JiLiZART/bbob/tree/master/packages/bbob-parser"
        },
        "content": ["hello", " ", "world!"]
    }
]
```

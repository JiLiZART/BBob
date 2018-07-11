# @bbob/parser
[![install size](https://packagephobia.now.sh/badge?p=@bbob/parser)](https://packagephobia.now.sh/result?p=@bbob/parser)

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

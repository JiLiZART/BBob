# @bbob/parser

Parses BBCode and returns AST Tree looks like

```json
[
    {
        tag: 'url',
        attrs: {
            url: 'https://github.com/JiLiZART/bbob/tree/master/packages/bbob-parser'
        },
        content: ['hello', ' ', 'world!']
    }
]
```

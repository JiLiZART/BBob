
const attrNameChars = '[a-zA-Z0-9\\.\\-_:;/]'
const attrValueChars = '[a-zA-Z0-9\\.\\-_:;#/\\s]'
const pattern = `\\[(\/\\w*)\\]|\\[(\\w*)+(=(["])${attrValueChars}*\\4)?( (${attrNameChars}+)?=(["])(${attrValueChars}+)\\7)*\\]`

const TAG_RE = new RegExp(pattern, 'g')

const EOL = '\n'
const WHITESPACE = ' '
const isNode = el => typeof el === 'object' && el.tag
const isStringNode = el => typeof el === 'string'
const isChordNode = el => el.tag === 'ch'
const isTabNode = el => el.tag === 'tab'
const isSyllableNode = el => el.tag === 'syllable'
const isTextNode = el => el.tag === 'text'
const isEOL = el => el === EOL

const getNodeLength = node => {
    if (isNode(node)) {
        node.content.reduce((count, contentNode) => count + getNodeLength(contentNode), 0)
    } else if (isStringNode(node)) {
        return node.length
    }

    return 0
}

const tagsDefinition = {
    ch: {
        closable: true,
    },
    syllable: {
        closable: true,
    },
    tab: {
        closable: true,
    },
}

// @TODO: Разбить на парсер и токенайзер, ноды и токены должны жить отдельно
/**
 * Парсит контент таба с BB кодами в AST дерево [{tag:'ch', attrs:{..}, content:[...]}]
 *
 * @example
 *
 *  textTabParser
 *      .parse('[Intro] [ch app=123]G[/ch] hello world', {ch: {closable: true}})
 *
 */
module.exports = {
    parse(str, tags = tagsDefinition) {
        this.tags = tags

        const tokens = this.tokenize(str)
        const ast = this.parseTokens(tokens)

        return ast
    },

    tokenize(str) {
        let tokens = []
        let match
        let lastIndex = 0

        // console.time('tokenize')
        while (match = TAG_RE.exec(str)) {
            const delta = match.index - lastIndex

            if (delta > 0) {
                tokens = tokens.concat(this.toTextTokens(str.substr(lastIndex, delta)))
            }

            tokens.push(this.tagToken(match))
            lastIndex = TAG_RE.lastIndex
        }

        const delta = str.length - lastIndex

        if (delta > 0) {
            tokens = tokens.concat(this.toTextTokens(str.substr(lastIndex, delta)))
        }
        // console.timeEnd('tokenize')

        return tokens
    },

    parseTokens(tokens) {
        const nodes = []
        let curToken
        const nestedNodes = []

        function getNodes() {
            if (nestedNodes.length) {
                const nestedNode = nestedNodes[nestedNodes.length - 1]
                return nestedNode.content
            }

            return nodes
        }

        // console.time('parseTokens')
        while (curToken = tokens.shift()) {
            curToken = this.isTokenSupported(curToken) ? curToken : this.asTextToken(curToken)

            if (curToken.isText) {
                getNodes().push(curToken.text)
            }

            if (curToken.isTag) {
                const node = this.tagNode(curToken.tagName, curToken.attributes)

                if (curToken.isStart) {
                    if (this.isTokenHasCloseTag(curToken)) {
                        nestedNodes.push(node)
                    } else {
                        getNodes().push(node)
                    }
                }

                if (curToken.isEnd) {
                    const lastNestedNode = nestedNodes.pop()

                    if (lastNestedNode) {
                        getNodes().push(lastNestedNode)
                    } else {
                        console.error(`Inconsistent tag '${curToken.tagName}'`)
                    }
                }
            }
        }
        // console.timeEnd('parseTokens')

        return nodes
    },

    isTokenSupported(token) {
        return token.isTag && this.tags && this.tags[token.tagName]
    },

    isTokenHasCloseTag(token) {
        return this.tags && this.tags[token.tagName] && this.tags[token.tagName].closable
    },

    tagNode(name, attrs, content = []) {
        return { tag: name, attrs, content }
    },

    toTextTokens(text) {
        const tokens = []
        const chars = text.split('')
        let currText = ''

        const flushText = () => {
            if (currText) {
                tokens.push(this.textToken(currText))
                currText = ''
            }
        }

        chars.forEach((char) => {
            if (char === EOL || char === WHITESPACE) {
                flushText()
                tokens.push(this.textToken(char))
            } else {
                currText += char
            }
        })

        if (currText) {
            tokens.push(this.textToken(currText))
        }

        return tokens
    },

    textToken(text) {
        return { isText: true, text }
    },

    tagToken(match) {
        if (typeof match[1] === 'undefined') { // Start tag
            const tagName = match[2]
            const attributes = {}
            const ATTR_RE = new RegExp(`(${attrNameChars}+)?=(["])(${attrValueChars}+)\\2`, 'g')
            const attrStr = match[0].substr(1 + tagName.length, match[0].length - 2 - tagName.length)

            let attrMatch

            while (attrMatch = ATTR_RE.exec(attrStr)) {
                if (typeof attrMatch[1] === 'undefined') { // The tag attribute
                    attributes[tagName] = attrMatch[3]
                } else { // Normal attribute
                    attributes[attrMatch[1]] = attrMatch[3]
                }
            }

            return { isStart: true, isTag: true, tagName, attributes, text: match[0] }
        }

        // End tag
        return { isEnd: true, isTag: true, tagName: match[1].substr(1, match[1].length - 1) }
    },

    asTextToken(token) {
        if (token.isTag && token.isStart) {
            return this.textToken(token.text)
        }

        if (token.isTag && token.isEnd) {
            return this.textToken(`[/${token.tagName}]`)
        }

        return token
    },
}

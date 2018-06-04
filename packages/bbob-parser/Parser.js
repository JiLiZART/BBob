const Tokenizer = require("./Tokenizer");
const TokenType = Tokenizer.TYPE;
const TokenChar = Tokenizer.CHAR;
const getCharCode = Tokenizer.getCharCode;

const isTextToken = (token) => {
    const type = token[Tokenizer.TOKEN.TYPE_ID];

    return type === TokenType.SPACE || type === TokenType.NEW_LINE || type === TokenType.WORD
};

const isTagToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TokenType.TAG;

const isTagStart = (token) => !isTagEnd(token);

const isTagEnd = (token) => getTokenValue(token).charCodeAt(0) === TokenChar.SLASH;

const isAttrNameToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TokenType.ATTR_NAME;

const isAttrValueToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TokenType.ATTR_VALUE;

const getTagName = (token) => {
    const value = getTokenValue(token);

    return isTagEnd(token) ? value.slice(1) : value
};

const convertTagToText = (token) => {
    let text = getCharCode(TokenChar.OPEN_BRAKET);

    if (isTagEnd(token)) {
        text += getCharCode(TokenChar.SLASH)
    }

    text += getTokenValue(token);
    text += getCharCode(TokenChar.CLOSE_BRAKET);

    return text
};

const getTokenValue = (token) => token[Tokenizer.TOKEN.VALUE_ID];

const createTagNode = (name, attrs = {}, content = []) => ({tag: name, attrs, content});

/**
 *
{
    tag: 'div',
    attrs: {
        class: 'foo'
    },
    content: ['hello world!']
}
 */
module.exports = class Parser {
    constructor(tokens, options = {}) {
        this.tokens = tokens;
        this.options = options
    }

    parse() {
        const tokens = this.tokens;
        const nodes = [];
        const nestedNodes = [];
        const curTags = [];
        const curTagsAttrName = [];

        const getCurTag = () => {
            if (curTags.length) {
                return curTags[curTags.length - 1]
            }

            return null
        };

        const createCurTag = (token) => {
            curTags.push(createTagNode(getTokenValue(token)))
        };

        const clearCurTag = () => {
            if (curTags.length) {
                curTags.pop();

                clearCurTagAttrName()
            }
        };

        const getCurTagAttrName = () => {
            if (curTagsAttrName.length) {
                return curTagsAttrName[curTagsAttrName.length - 1]
            }

            return null
        };

        const createCurTagAttrName = (token) => {
            curTagsAttrName.push(getTokenValue(token))
        };

        const clearCurTagAttrName = () => {
            if (curTagsAttrName.length) {
                curTagsAttrName.pop()
            }
        };

        const getNodes = () => {
            if (nestedNodes.length) {
                const nestedNode = nestedNodes[nestedNodes.length - 1];
                return nestedNode.content
            }

            return nodes
        };

        let token;
        while (token = tokens.shift()) {
            if (!token) {
                continue;
            }

            if (isTagToken(token)) {
                if (this.isAllowedTag(getTagName(token))) {
                    // [tag]
                    if (isTagStart(token)) {
                        createCurTag(token);

                        if (this.isCloseTag(getTokenValue(token))) {
                            nestedNodes.push(getCurTag())
                        } else {
                            getNodes().push(getCurTag());
                            clearCurTag()
                        }
                    }

                    // [/tag]
                    if (isTagEnd(token)) {
                        clearCurTag();

                        const lastNestedNode = nestedNodes.pop();

                        if (lastNestedNode) {
                            getNodes().push(lastNestedNode)
                        } else {
                            debugger;
                            console.warn(`Inconsistent tag '${getTokenValue(token)}'`);
                        }
                    }
                } else {
                    getNodes().push(convertTagToText(token))
                }
            }

            if (getCurTag()) {
                if (isAttrNameToken(token)) {
                    createCurTagAttrName(token);
                    getCurTag().attrs[getCurTagAttrName()] = null
                } else if (isAttrValueToken(token)) {
                    getCurTag().attrs[getCurTagAttrName()] = getTokenValue(token);
                    clearCurTagAttrName()
                } else if (isTextToken(token)) {
                    getCurTag().content.push(getTokenValue(token))
                }
            } else if (isTextToken(token)) {
                getNodes().push(getTokenValue(token))
            }
        }

        return nodes
    }

    isCloseTag(value) {
        return this.options.closableTags && this.options.closableTags.indexOf(value) >= 0
    }

    isAllowedTag(value) {
        if (this.options.allowOnlyTags && this.options.allowOnlyTags.length) {
            return this.options.allowOnlyTags.indexOf(value) >= 0
        }

        return true
    }
};
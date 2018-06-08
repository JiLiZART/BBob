const CHAR = require('./char');
const TOKEN = require('./token');
const getChar = String.fromCharCode;


const getTokenValue = (token) => token[Tokenizer.TOKEN.VALUE_ID];

const getTokenLine = (token) => token[Tokenizer.TOKEN.LINE_ID];
const getTokenColumn = (token) => token[Tokenizer.TOKEN.COLUMN_ID];

const isTextToken = (token) => {
    const type = token[Tokenizer.TOKEN.TYPE_ID];

    return type === TOKEN.TYPE_SPACE || type === TOKEN.TYPE_NEW_LINE || type === TOKEN.TYPE_WORD
};

const isTagToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TOKEN.TYPE_TAG;

const isTagStart = (token) => !isTagEnd(token);

const isTagEnd = (token) => getTokenValue(token).charCodeAt(0) === CHAR.SLASH;

const isAttrNameToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TOKEN.TYPE_ATTR_NAME;

const isAttrValueToken = (token) => token[Tokenizer.TOKEN.TYPE_ID] === TOKEN.TYPE_ATTR_VALUE;

const getTagName = (token) => {
    const value = getTokenValue(token);

    return isTagEnd(token) ? value.slice(1) : value
};

const convertTagToText = (token) => {
    let text = getChar(CHAR.OPEN_BRAKET);

    if (isTagEnd(token)) {
        text += getChar(CHAR.SLASH)
    }

    text += getTokenValue(token);
    text += getChar(CHAR.CLOSE_BRAKET);

    return text
};

const SPACE_TAB = '    ';
const SPACE = ' ';

class Tokenizer {
    constructor(input) {
        this.buffer = input;
        this.colPos = 0;
        this.rowPos = 0;
        this.index = 0;
    }

    tokenize() {
        let wordToken = null;
        let tagToken = null;
        let attrNameToken = null;
        let attrValueToken = null;
        let attrTokens = [];
        let tokens = new Array(Math.floor(this.buffer.length / 2));
        let tokenIndex = -1;

        const flushWord = () => {
            if (wordToken && wordToken[TOKEN.VALUE_ID]) {
                tokenIndex++;
                tokens[tokenIndex] = wordToken;
                wordToken = this.createWordToken('')
            }
        };

        const flushTag = () => {
            if (tagToken !== null) {
                if (attrNameToken && !attrValueToken) {
                    tagToken[TOKEN.VALUE_ID] += SPACE + attrNameToken[TOKEN.VALUE_ID]
                    attrNameToken = null
                }

                tokenIndex++;
                tokens[tokenIndex] = tagToken;
                tagToken = null;
            }
        };

        const flushAttrNames = () => {
            if (attrNameToken) {
                attrTokens.push(attrNameToken);
                attrNameToken = null;
            }

            if (attrValueToken) {
                attrTokens.push(attrValueToken);
                attrValueToken = null
            }
        };

        const flushAttrs = () => {
            if (attrTokens.length) {
                attrTokens.forEach(attrToken => {
                    tokenIndex++;
                    tokens[tokenIndex] = attrToken
                });

                attrTokens = [];
            }
        };

        // console.time('Lexer.tokenize');

        while (this.index < this.buffer.length) {
            const charCode = this.buffer.charCodeAt(this.index);

            switch (charCode) {
                case CHAR.TAB:
                case CHAR.SPACE:
                    flushWord();

                    if (tagToken) {
                        attrNameToken = this.createAttrNameToken('');
                    } else {
                        const spaceCode = charCode === CHAR.TAB ? SPACE_TAB : SPACE;

                        tokenIndex++;
                        tokens[tokenIndex] = this.createSpaceToken(spaceCode);
                    }
                    this.colPos++;
                    break;

                case CHAR.N:
                    flushWord();
                    tokenIndex++;
                    tokens[tokenIndex] = this.createNewLineToken(getChar(charCode));

                    this.rowPos++;
                    this.colPos = 0;
                    break;

                case CHAR.OPEN_BRAKET:
                    flushWord();
                    tagToken = this.createTagToken('');

                    this.colPos++;
                    break;

                case CHAR.CLOSE_BRAKET:
                    flushTag();
                    flushAttrNames();
                    flushAttrs();

                    this.colPos++;
                    break;

                case CHAR.EQ:
                    if (tagToken) {
                        attrValueToken = this.createAttrValueToken('')
                    } else {
                        wordToken[TOKEN.VALUE_ID] += getChar(charCode);
                    }

                    this.colPos++;
                    break;

                case CHAR.QUOTEMARK:
                    if (attrValueToken && attrValueToken[TOKEN.VALUE_ID] > 0) {
                        flushAttrNames();
                    } else if (tagToken === null) {
                        wordToken[TOKEN.VALUE_ID] += getChar(charCode);
                    }

                    this.colPos++;
                    break;

                default:
                    if (tagToken && attrValueToken) {
                        attrValueToken[TOKEN.VALUE_ID] += getChar(charCode)
                    } else if (tagToken && attrNameToken) {
                        attrNameToken[TOKEN.VALUE_ID] += getChar(charCode)
                    } else if (tagToken) {
                        tagToken[TOKEN.VALUE_ID] += getChar(charCode)
                    } else {
                        if (!wordToken) {
                            wordToken = this.createWordToken('')
                        }

                        wordToken[TOKEN.VALUE_ID] += getChar(charCode);
                    }

                    this.colPos++;
                    break;
            }

            this.index++;
        }

        flushWord();

        tokens.length = tokenIndex + 1;

        return tokens;
    }

    createWordToken(value) {
        return [TOKEN.TYPE_WORD, value, this.colPos, this.rowPos]
    }

    createTagToken(value) {
        return [TOKEN.TYPE_TAG, value, this.colPos, this.rowPos]
    }

    createAttrNameToken(value) {
        return [TOKEN.TYPE_ATTR_NAME, value, this.colPos, this.rowPos]
    }

    createAttrValueToken(value) {
        return [TOKEN.TYPE_ATTR_VALUE, value, this.colPos, this.rowPos]
    }

    createSpaceToken(value) {
        return [TOKEN.TYPE_SPACE, value, this.colPos, this.rowPos]
    }

    createNewLineToken(value) {
        return [TOKEN.TYPE_NEW_LINE, value, this.colPos, this.rowPos]
    }
}

// warm up tokenizer to elimitate code branches that never execute
new Tokenizer(`[b param="hello"]Sample text[/b]\n\t[Chorus]`).tokenize();

module.exports = Tokenizer;
module.exports.CHAR = CHAR;
module.exports.TYPE = {
    WORD: TOKEN.TYPE_WORD,
    TAG: TOKEN.TYPE_TAG,
    ATTR_NAME: TOKEN.TYPE_ATTR_NAME,
    ATTR_VALUE: TOKEN.TYPE_ATTR_VALUE,
    SPACE: TOKEN.TYPE_SPACE,
    NEW_LINE: TOKEN.TYPE_NEW_LINE,
};
module.exports.TOKEN = {
    TYPE_ID: TOKEN.TYPE_ID,
    VALUE_ID: TOKEN.VALUE_ID,
    LINE_ID: TOKEN.LINE_ID,
    COLUMN_ID: TOKEN.COLUMN_ID,
};
module.exports.getChar = getChar;
module.exports.getTokenValue = getTokenValue;
module.exports.getTokenLine = getTokenLine;
module.exports.getTokenColumn = getTokenColumn;
module.exports.isTextToken = isTextToken;
module.exports.isTagToken = isTagToken;
module.exports.isTagStart = isTagStart;
module.exports.isTagEnd = isTagEnd;
module.exports.isAttrNameToken = isAttrNameToken;
module.exports.isAttrValueToken = isAttrValueToken;
module.exports.getTagName = getTagName;
module.exports.convertTokenToText = convertTagToText;


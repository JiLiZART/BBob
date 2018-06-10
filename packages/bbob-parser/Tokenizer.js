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
        
        this.tokenIndex = -1;
        this.tokens = [];
    }

    appendToken(token) {
        this.tokenIndex++;
        this.tokens[this.tokenIndex] = token;
    }

    tokenize() {
        let wordToken = null;
        let tagToken = null;
        let attrNameToken = null;
        let attrValueToken = null;
        let attrTokens = [];
        this.tokens = new Array(Math.floor(this.buffer.length / 2));

        const flushWord = () => {
            if (wordToken && wordToken[TOKEN.VALUE_ID]) {
                this.appendToken(wordToken);
                wordToken = this.createWordToken('')
            }
        };

        const createWord = (value, line, row) => {
            if (!wordToken) {
                wordToken = this.createWordToken(value, line, row)
            }
        };

        const flushTag = () => {
            if (tagToken !== null) {
                // [] and [=] tag case
                if (!tagToken[TOKEN.VALUE_ID]) {
                    const value = attrValueToken ? getChar(CHAR.EQ) : '';
                    const word = getChar(CHAR.OPEN_BRAKET) + value + getChar(CHAR.CLOSE_BRAKET);

                    createWord('', 0, 0);
                    wordToken[TOKEN.VALUE_ID] += word;

                    tagToken = null;

                    if (attrValueToken) {
                        attrValueToken = null
                    }

                    return;
                }

                if (attrNameToken && !attrValueToken) {
                    tagToken[TOKEN.VALUE_ID] += SPACE + attrNameToken[TOKEN.VALUE_ID];
                    attrNameToken = null
                }

                this.appendToken(tagToken);
                tagToken = null;
            }
        };

        const flushUnclosedTag = () => {
            if (tagToken !== null) {
                const value = tagToken[TOKEN.VALUE_ID] + (attrValueToken ? getChar(CHAR.EQ) : '');

                tagToken[TOKEN.TYPE_ID] = TOKEN.TYPE_WORD;
                tagToken[TOKEN.VALUE_ID] = getChar(CHAR.OPEN_BRAKET) + value;

                this.appendToken(tagToken);

                tagToken = null;

                if (attrValueToken) {
                    attrValueToken = null
                }
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
                attrTokens.forEach(this.appendToken.bind(this));
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

                        this.appendToken(this.createSpaceToken(spaceCode));
                    }
                    this.colPos++;
                    break;

                case CHAR.N:
                    flushWord();
                    this.appendToken(this.createNewLineToken(getChar(charCode)));

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
                        createWord();

                        wordToken[TOKEN.VALUE_ID] += getChar(charCode);
                    }

                    this.colPos++;
                    break;
            }

            this.index++;
        }

        flushWord();
        flushUnclosedTag();

        this.tokens.length = this.tokenIndex + 1;

        return this.tokens;
    }

    createWordToken(value = '', line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_WORD, value, line, row]
    }

    createTagToken(value, line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_TAG, value, line, row]
    }

    createAttrNameToken(value, line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_ATTR_NAME, value, line, row]
    }

    createAttrValueToken(value, line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_ATTR_VALUE, value, line, row]
    }

    createSpaceToken(value, line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_SPACE, value, line, row]
    }

    createNewLineToken(value, line = this.colPos, row = this.rowPos) {
        return [TOKEN.TYPE_NEW_LINE, value, line, row]
    }
}

// warm up tokenizer to elimitate code branches that never execute
new Tokenizer(`[sc=asdasd`).tokenize();
//new Tokenizer(`[b param="hello"]Sample text[/b]\n\t[Chorus]`).tokenize();

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


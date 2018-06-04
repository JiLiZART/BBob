const CHAR = require('./char');
const TOKEN = require('./token');

// const TOKEN.TYPE_ID = 0;
// const TOKEN.VALUE_ID = 1;
// const TOKEN.LINE_ID = 2;
// const TOKEN.COLUMN_ID = 3;
//
// const TOKEN.TYPE_WORD = 'word';
// const TOKEN.TYPE_TAG = 'tag';
// const TOKEN.TYPE_ATTR_NAME = 'attr-name';
// const TOKEN.TYPE_ATTR_VALUE = 'attr-value';
// const TOKEN.TYPE_SPACE = 'space';
// const TOKEN.TYPE_NEW_LINE = 'new-line';

const getCharCode = String.fromCharCode;

class Tokenizer {
    constructor(input) {
        this.buffer = input;
        this.colPos = 0;
        this.rowPos = 0;
        this.index = 0;
    }

    tokenize() {
        let wordToken = this.createWordToken('');
        let tagToken = null;
        let attrNameToken = null;
        let attrValueToken = null;
        let attrTokens = [];
        let tokens = new Array(Math.floor(this.buffer.length / 2));
        let tokenIndex = -1;

        const flushWord = () => {
            if (wordToken[TOKEN.VALUE_ID]) {
                tokenIndex++;
                tokens[tokenIndex] = wordToken;
                wordToken = this.createWordToken('')
            }
        };

        const flushTag = () => {
            if (tagToken !== null) {
                tokenIndex++;
                tokens[tokenIndex] = tagToken;
                tagToken = null;
            }
        };

        const flushAttrName = () => {
            if (attrNameToken) {
                attrTokens.push(attrNameToken);
                attrNameToken = null;
            }
        };

        const flushAttrValue = () => {
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
                    }

                    const spaceCode = charCode === CHAR.TAB ? '    ' : ' ';

                    tokenIndex++;
                    tokens[tokenIndex] = this.createSpaceToken(spaceCode);

                    this.colPos++;
                    break;

                case CHAR.N:
                    flushWord();
                    tokenIndex++;
                    tokens[tokenIndex] = this.createNewLineToken(getCharCode(charCode));

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
                    flushAttrName();
                    flushAttrValue();
                    flushAttrs();

                    this.colPos++;
                    break;

                case CHAR.EQ:
                    if (tagToken) {
                        attrValueToken = this.createAttrValueToken('')
                    } else {
                        wordToken[TOKEN.VALUE_ID] += getCharCode(charCode);
                    }

                    this.colPos++;
                    break;

                case CHAR.QUOTEMARK:
                    if (attrValueToken && attrValueToken[TOKEN.VALUE_ID] > 0) {
                        flushAttrName();
                        flushAttrValue();
                    } else if (tagToken === null) {
                        wordToken[TOKEN.VALUE_ID] += getCharCode(charCode);
                    }

                    this.colPos++;
                    break;

                default:
                    if (tagToken && attrValueToken) {
                        attrValueToken[TOKEN.VALUE_ID] += getCharCode(charCode)
                    } else if (tagToken && attrNameToken) {
                        attrNameToken[TOKEN.VALUE_ID] += getCharCode(charCode)
                    } else if (tagToken) {
                        tagToken[TOKEN.VALUE_ID] += getCharCode(charCode)
                    } else {
                        wordToken[TOKEN.VALUE_ID] += getCharCode(charCode);
                    }

                    this.colPos++;
                    break;
            }

            this.index++;
        }

        flushWord();

        tokens.length = tokenIndex;

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
module.exports.getCharCode = getCharCode;


const {
  getChar,
  OPEN_BRAKET,
  CLOSE_BRAKET, EQ, TAB, SPACE, N, QUOTEMARK,
  PLACEHOLDER_SPACE, PLACEHOLDER_SPACE_TAB,
} = require('./char');
const TOKEN = require('./token');

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
    this.tokenIndex += 1;
    this.tokens[this.tokenIndex] = token;
  }

  nextCol() {
    this.colPos += 1;
  }

  nextLine() {
    this.rowPos += 1;
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
        wordToken = this.createWordToken('');
      }
    };

    const createWord = (value, line, row) => {
      if (!wordToken) {
        wordToken = this.createWordToken(value, line, row);
      }
    };

    const flushTag = () => {
      if (tagToken !== null) {
        // [] and [=] tag case
        if (!tagToken[TOKEN.VALUE_ID]) {
          const value = attrValueToken ? getChar(EQ) : '';
          const word = getChar(OPEN_BRAKET) + value + getChar(CLOSE_BRAKET);

          createWord('', 0, 0);
          wordToken[TOKEN.VALUE_ID] += word;

          tagToken = null;

          if (attrValueToken) {
            attrValueToken = null;
          }

          return;
        }

        if (attrNameToken && !attrValueToken) {
          tagToken[TOKEN.VALUE_ID] += PLACEHOLDER_SPACE + attrNameToken[TOKEN.VALUE_ID];
          attrNameToken = null;
        }

        this.appendToken(tagToken);
        tagToken = null;
      }
    };

    const flushUnclosedTag = () => {
      if (tagToken !== null) {
        const value = tagToken[TOKEN.VALUE_ID] + (attrValueToken ? getChar(EQ) : '');

        tagToken[TOKEN.TYPE_ID] = TOKEN.TYPE_WORD;
        tagToken[TOKEN.VALUE_ID] = getChar(OPEN_BRAKET) + value;

        this.appendToken(tagToken);

        tagToken = null;

        if (attrValueToken) {
          attrValueToken = null;
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
        attrValueToken = null;
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
        case TAB:
        case SPACE:
          flushWord();

          if (tagToken) {
            attrNameToken = this.createAttrNameToken('');
          } else {
            const spaceCode = charCode === TAB ? PLACEHOLDER_SPACE_TAB : PLACEHOLDER_SPACE;

            this.appendToken(this.createSpaceToken(spaceCode));
          }
          this.nextCol();
          break;

        case N:
          flushWord();
          this.appendToken(this.createNewLineToken(getChar(charCode)));

          this.nextLine();
          this.colPos = 0;
          break;

        case OPEN_BRAKET:
          flushWord();
          tagToken = this.createTagToken('');

          this.nextCol();
          break;

        case CLOSE_BRAKET:
          flushTag();
          flushAttrNames();
          flushAttrs();

          this.nextCol();
          break;

        case EQ:
          if (tagToken) {
            attrValueToken = this.createAttrValueToken('');
          } else {
            wordToken[TOKEN.VALUE_ID] += getChar(charCode);
          }

          this.nextCol();
          break;

        case QUOTEMARK:
          if (attrValueToken && attrValueToken[TOKEN.VALUE_ID] > 0) {
            flushAttrNames();
          } else if (tagToken === null) {
            wordToken[TOKEN.VALUE_ID] += getChar(charCode);
          }

          this.nextCol();
          break;

        default:
          if (tagToken && attrValueToken) {
            attrValueToken[TOKEN.VALUE_ID] += getChar(charCode);
          } else if (tagToken && attrNameToken) {
            attrNameToken[TOKEN.VALUE_ID] += getChar(charCode);
          } else if (tagToken) {
            tagToken[TOKEN.VALUE_ID] += getChar(charCode);
          } else {
            createWord();

            wordToken[TOKEN.VALUE_ID] += getChar(charCode);
          }

          this.nextCol();
          break;
      }

      this.index += 1;
    }

    flushWord();
    flushUnclosedTag();

    this.tokens.length = this.tokenIndex + 1;

    return this.tokens;
  }

  createWordToken(value = '', line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_WORD, value, line, row];
  }

  createTagToken(value, line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_TAG, value, line, row];
  }

  createAttrNameToken(value, line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_ATTR_NAME, value, line, row];
  }

  createAttrValueToken(value, line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_ATTR_VALUE, value, line, row];
  }

  createSpaceToken(value, line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_SPACE, value, line, row];
  }

  createNewLineToken(value, line = this.colPos, row = this.rowPos) {
    return [TOKEN.TYPE_NEW_LINE, value, line, row];
  }
}

// warm up tokenizer to elimitate code branches that never execute
new Tokenizer('[b param="hello"]Sample text[/b]\n\t[Chorus 2]').tokenize();

module.exports = Tokenizer;
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


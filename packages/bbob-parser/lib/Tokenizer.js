const {
  getChar,
  OPEN_BRAKET,
  CLOSE_BRAKET, EQ, TAB, SPACE, N, QUOTEMARK,
  PLACEHOLDER_SPACE, PLACEHOLDER_SPACE_TAB,
  SLASH,
  BACKSLASH,
} = require('./char');
const Token = require('./Token');

const createTokenOfType = (type, value, line, row) => new Token(type, value, line, row);

class Tokenizer {
  constructor(input, options = {}) {
    this.buffer = input;
    this.colPos = 0;
    this.rowPos = 0;
    // eslint-disable-next-line no-bitwise
    this.index = 2 ** 32;

    this.tokenIndex = -1;
    this.tokens = new Array(Math.floor(this.buffer.length));
    this.dummyToken = null; // createTokenOfType('', '', '', '');

    this.wordToken = this.dummyToken;
    this.tagToken = this.dummyToken;
    this.attrNameToken = this.dummyToken;
    this.attrValueToken = this.dummyToken;
    this.attrTokens = [];

    this.options = options;

    this.charMap = {
      [TAB]: this.charSPACE.bind(this),
      [SPACE]: this.charSPACE.bind(this),
      [N]: this.charN.bind(this),
      [OPEN_BRAKET]: this.charOPENBRAKET.bind(this),
      [CLOSE_BRAKET]: this.charCLOSEBRAKET.bind(this),
      [EQ]: this.charEQ.bind(this),
      [QUOTEMARK]: this.charQUOTEMARK.bind(this),
      [BACKSLASH]: this.charBACKSLASH.bind(this),
      default: this.charWORD.bind(this),
    };
  }

  emitToken(token) {
    if (this.options.onToken) {
      this.options.onToken(token);
    }
  }

  appendToken(token) {
    this.tokenIndex += 1;
    this.tokens[this.tokenIndex] = token;
    this.emitToken(token);
  }

  skipChar(num) {
    this.index += num;
    this.colPos += num;
  }

  seekChar(num) {
    return this.buffer.charCodeAt(this.index + num);
  }

  nextCol() {
    this.colPos += 1;
  }

  nextLine() {
    this.rowPos += 1;
  }

  flushWord() {
    if (this.inWord() && this.wordToken[Token.VALUE_ID]) {
      this.appendToken(this.wordToken);
      this.wordToken = this.createWordToken('');
    }
  }

  createWord(value, line, row) {
    if (!this.inWord()) {
      this.wordToken = this.createWordToken(value, line, row);
    }
  }

  flushTag() {
    if (this.inTag()) {
      // [] and [=] tag case
      if (this.tagToken[Token.VALUE_ID] === '') {
        const value = this.inAttrValue() ? getChar(EQ) : '';
        const word = getChar(OPEN_BRAKET) + value + getChar(CLOSE_BRAKET);

        this.createWord('', 0, 0);
        this.wordToken[Token.VALUE_ID] += word;

        this.tagToken = this.dummyToken;

        if (this.inAttrValue()) {
          this.attrValueToken = this.dummyToken;
        }

        return;
      }

      if (this.inAttrName() && !this.inAttrValue()) {
        this.tagToken[Token.VALUE_ID] += PLACEHOLDER_SPACE + this.attrNameToken[Token.VALUE_ID];
        this.attrNameToken = this.dummyToken;
      }

      this.appendToken(this.tagToken);
      this.tagToken = this.dummyToken;
    }
  }

  flushUnclosedTag() {
    if (this.inTag()) {
      const value = this.tagToken[Token.VALUE_ID] + (this.attrValueToken && this.attrValueToken[Token.VALUE_ID] ? getChar(EQ) : '');

      this.tagToken[Token.TYPE_ID] = Token.TYPE_WORD;
      this.tagToken[Token.VALUE_ID] = getChar(OPEN_BRAKET) + value;

      this.appendToken(this.tagToken);

      this.tagToken = this.dummyToken;

      if (this.inAttrValue()) {
        this.attrValueToken = this.dummyToken;
      }
    }
  }

  flushAttrNames() {
    if (this.inAttrName()) {
      this.attrTokens.push(this.attrNameToken);
      this.attrNameToken = this.dummyToken;
    }

    if (this.inAttrValue()) {
      this.attrValueToken.quoted = undefined;
      this.attrTokens.push(this.attrValueToken);
      this.attrValueToken = this.dummyToken;
    }
  }

  flushAttrs() {
    if (this.attrTokens.length) {
      this.attrTokens.forEach(this.appendToken.bind(this));
      this.attrTokens = [];
    }
  }

  charSPACE(charCode) {
    const spaceCode = charCode === TAB ? PLACEHOLDER_SPACE_TAB : PLACEHOLDER_SPACE;

    this.flushWord();

    if (this.inTag()) {
      if (this.inAttrValue() && this.attrValueToken.quoted) {
        this.attrValueToken[Token.VALUE_ID] += spaceCode;
      } else {
        this.flushAttrNames();
        this.attrNameToken = this.createAttrNameToken('');
      }
    } else {
      this.appendToken(this.createSpaceToken(spaceCode));
    }
    this.nextCol();
  }

  charN(charCode) {
    this.flushWord();
    this.appendToken(this.createNewLineToken(getChar(charCode)));

    this.nextLine();
    this.colPos = 0;
  }

  charOPENBRAKET() {
    this.flushWord();
    this.tagToken = this.createTagToken('');

    this.nextCol();
  }

  charCLOSEBRAKET() {
    this.nextCol();
    this.flushTag();
    this.flushAttrNames();
    this.flushAttrs();
  }

  charEQ(charCode) {
    const nextCharCode = this.seekChar(1);
    const isNextQuotemark = nextCharCode === QUOTEMARK;

    if (this.inTag()) {
      this.attrValueToken = this.createAttrValueToken('');

      if (isNextQuotemark) {
        this.attrValueToken.quoted = true;
        this.skipChar(1);
      }
    } else {
      this.wordToken[Token.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  charQUOTEMARK(charCode) {
    const prevCharCode = this.seekChar(-1);
    const isPrevBackslash = prevCharCode === BACKSLASH;

    if (this.inAttrValue() &&
        this.attrValueToken[Token.VALUE_ID] &&
        this.attrValueToken.quoted &&
        !isPrevBackslash) {
      this.flushAttrNames();
    } else if (!this.inTag()) {
      this.wordToken[Token.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  charBACKSLASH() {
    const nextCharCode = this.seekChar(1);
    const isNextQuotemark = nextCharCode === QUOTEMARK;

    if (this.inAttrValue() &&
        this.attrValueToken[Token.VALUE_ID] &&
        this.attrValueToken.quoted &&
        isNextQuotemark
    ) {
      this.attrValueToken[Token.VALUE_ID] += getChar(nextCharCode);
      this.skipChar(1);
    }

    this.nextCol();
  }

  charWORD(charCode) {
    if (this.inTag()) {
      if (this.inAttrValue()) {
        this.attrValueToken[Token.VALUE_ID] += getChar(charCode);
      } else if (this.inAttrName()) {
        this.attrNameToken[Token.VALUE_ID] += getChar(charCode);
      } else {
        this.tagToken[Token.VALUE_ID] += getChar(charCode);
      }
    } else {
      this.createWord();

      this.wordToken[Token.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  tokenize() {
    this.index = 0;
    while (this.index < this.buffer.length) {
      const charCode = this.buffer.charCodeAt(this.index);

      (this.charMap[charCode] || this.charMap.default)(charCode);

      // eslint-disable-next-line no-plusplus
      ++this.index;
    }

    this.flushWord();
    this.flushUnclosedTag();

    this.tokens.length = this.tokenIndex + 1;

    return this.tokens;
  }

  inWord() {
    return this.wordToken && this.wordToken[Token.TYPE_ID];
  }

  inTag() {
    return this.tagToken && this.tagToken[Token.TYPE_ID];
  }

  inAttrValue() {
    return this.attrValueToken && this.attrValueToken[Token.TYPE_ID];
  }

  inAttrName() {
    return this.attrNameToken && this.attrNameToken[Token.TYPE_ID];
  }

  createWordToken(value = '', line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_WORD, value, line, row);
  }

  createTagToken(value, line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_TAG, value, line, row);
  }

  createAttrNameToken(value, line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_ATTR_NAME, value, line, row);
  }

  createAttrValueToken(value, line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_ATTR_VALUE, value, line, row);
  }

  createSpaceToken(value, line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_SPACE, value, line, row);
  }

  createNewLineToken(value, line = this.colPos, row = this.rowPos) {
    return createTokenOfType(Token.TYPE_NEW_LINE, value, line, row);
  }

  isTokenNested(token) {
    const value = getChar(OPEN_BRAKET) + getChar(SLASH) + Token.getTokenValue(token);
    return this.buffer.indexOf(value) > -1;
  }
}

module.exports = Tokenizer;
module.exports.createTokenOfType = createTokenOfType;
module.exports.TYPE = {
  WORD: Token.TYPE_WORD,
  TAG: Token.TYPE_TAG,
  ATTR_NAME: Token.TYPE_ATTR_NAME,
  ATTR_VALUE: Token.TYPE_ATTR_VALUE,
  SPACE: Token.TYPE_SPACE,
  NEW_LINE: Token.TYPE_NEW_LINE,
};
module.exports.TOKEN = {
  TYPE_ID: Token.TYPE_ID,
  VALUE_ID: Token.VALUE_ID,
  LINE_ID: Token.LINE_ID,
  COLUMN_ID: Token.COLUMN_ID,
};


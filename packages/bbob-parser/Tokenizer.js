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
    this.tokens = new Array(Math.floor(this.buffer.length));
    this.dummyArray = ['', '', '', ''];

    this.wordToken = this.dummyArray;
    this.tagToken = this.dummyArray;
    this.attrNameToken = this.dummyArray;
    this.attrValueToken = this.dummyArray;
    this.attrTokens = [];
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

  flushWord() {
    if (this.wordToken[TOKEN.TYPE_ID] && this.wordToken[TOKEN.VALUE_ID]) {
      this.appendToken(this.wordToken);
      this.wordToken = this.createWordToken('');
    }
  }

  createWord(value, line, row) {
    if (this.wordToken[TOKEN.TYPE_ID] === '') {
      this.wordToken = this.createWordToken(value, line, row);
    }
  }

  flushTag() {
    if (this.tagToken[TOKEN.TYPE_ID]) {
      // [] and [=] tag case
      if (this.tagToken[TOKEN.VALUE_ID] === '') {
        const value = this.attrValueToken[TOKEN.TYPE_ID] ? getChar(EQ) : '';
        const word = getChar(OPEN_BRAKET) + value + getChar(CLOSE_BRAKET);

        this.createWord('', 0, 0);
        this.wordToken[TOKEN.VALUE_ID] += word;

        this.tagToken = this.dummyArray;

        if (this.attrValueToken[TOKEN.TYPE_ID]) {
          this.attrValueToken = this.dummyArray;
        }

        return;
      }

      if (this.attrNameToken[TOKEN.TYPE_ID] && !this.attrValueToken[TOKEN.TYPE_ID]) {
        this.tagToken[TOKEN.VALUE_ID] += PLACEHOLDER_SPACE + this.attrNameToken[TOKEN.VALUE_ID];
        this.attrNameToken = this.dummyArray;
      }

      this.appendToken(this.tagToken);
      this.tagToken = this.dummyArray;
    }
  }

  flushUnclosedTag() {
    if (this.tagToken[TOKEN.TYPE_ID]) {
      const value = this.tagToken[TOKEN.VALUE_ID] + (this.attrValueToken[TOKEN.VALUE_ID] ? getChar(EQ) : '');

      this.tagToken[TOKEN.TYPE_ID] = TOKEN.TYPE_WORD;
      this.tagToken[TOKEN.VALUE_ID] = getChar(OPEN_BRAKET) + value;

      this.appendToken(this.tagToken);

      this.tagToken = this.dummyArray;

      if (this.attrValueToken[TOKEN.TYPE_ID]) {
        this.attrValueToken = this.dummyArray;
      }
    }
  }

  flushAttrNames() {
    if (this.attrNameToken[TOKEN.TYPE_ID]) {
      this.attrTokens.push(this.attrNameToken);
      this.attrNameToken = this.dummyArray;
    }

    if (this.attrValueToken[TOKEN.TYPE_ID]) {
      this.attrTokens.push(this.attrValueToken);
      this.attrValueToken = this.dummyArray;
    }
  }

  flushAttrs() {
    if (this.attrTokens.length) {
      this.attrTokens.forEach(this.appendToken.bind(this));
      this.attrTokens = [];
    }
  }

  charSPACE(charCode) {
    this.flushWord();

    if (this.tagToken[TOKEN.TYPE_ID]) {
      this.attrNameToken = this.createAttrNameToken('');
    } else {
      const spaceCode = charCode === TAB ? PLACEHOLDER_SPACE_TAB : PLACEHOLDER_SPACE;

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
    this.flushTag();
    this.flushAttrNames();
    this.flushAttrs();

    this.nextCol();
  }

  charEQ(charCode) {
    if (this.tagToken[TOKEN.TYPE_ID]) {
      this.attrValueToken = this.createAttrValueToken('');
    } else {
      this.wordToken[TOKEN.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  charQUOTEMARK(charCode) {
    if (this.attrValueToken[TOKEN.TYPE_ID] && this.attrValueToken[TOKEN.VALUE_ID] > 0) {
      this.flushAttrNames();
    } else if (this.tagToken[TOKEN.TYPE_ID] === '') {
      this.wordToken[TOKEN.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  charWORD(charCode) {
    if (this.tagToken[TOKEN.TYPE_ID] && this.attrValueToken[TOKEN.TYPE_ID]) {
      this.attrValueToken[TOKEN.VALUE_ID] += getChar(charCode);
    } else if (this.tagToken[TOKEN.TYPE_ID] && this.attrNameToken[TOKEN.TYPE_ID]) {
      this.attrNameToken[TOKEN.VALUE_ID] += getChar(charCode);
    } else if (this.tagToken[TOKEN.TYPE_ID]) {
      this.tagToken[TOKEN.VALUE_ID] += getChar(charCode);
    } else {
      this.createWord();

      this.wordToken[TOKEN.VALUE_ID] += getChar(charCode);
    }

    this.nextCol();
  }

  tokenize() {
    while (this.index < this.buffer.length) {
      const charCode = this.buffer.charCodeAt(this.index);

      switch (charCode) {
        case TAB:
        case SPACE:
          this.charSPACE(charCode);
          break;

        case N:
          this.charN(charCode);
          break;

        case OPEN_BRAKET:
          this.charOPENBRAKET();
          break;

        case CLOSE_BRAKET:
          this.charCLOSEBRAKET();
          break;

        case EQ:
          this.charEQ(charCode);
          break;

        case QUOTEMARK:
          this.charQUOTEMARK(charCode);
          break;

        default:
          this.charWORD(charCode);
          break;
      }

      this.index += 1;
    }

    this.flushWord();
    this.flushUnclosedTag();

    this.tokens.length = this.tokenIndex + 1;

    return this.tokens;
  }

  createWordToken(value = '', line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_WORD, value, line, row);
  }

  createTagToken(value, line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_TAG, value, line, row);
  }

  createAttrNameToken(value, line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_ATTR_NAME, value, line, row);
  }

  createAttrValueToken(value, line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_ATTR_VALUE, value, line, row);
  }

  createSpaceToken(value, line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_SPACE, value, line, row);
  }

  createNewLineToken(value, line = this.colPos, row = this.rowPos) {
    return this.createTokenOfType(TOKEN.TYPE_NEW_LINE, value, line, row);
  }

  createTokenOfType(type, value, line = this.colPos, row = this.rowPos) {
    return [String(type), String(value), String(line), String(row)];
  }
}

// warm up tokenizer to elimitate code branches that never execute
new Tokenizer('[b param="hello"]Sample text[/b]\n\t[Chorus 2] x html([a. title][, alt][, classes]) x [=] [/y]').tokenize();

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


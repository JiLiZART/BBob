/* eslint-disable no-plusplus,no-param-reassign */
const c = require('@bbob/plugin-helper/lib/char');
const Token = require('./Token');

const OPEN_BRAKET = c.getChar(c.OPEN_BRAKET);
const CLOSE_BRAKET = c.getChar(c.CLOSE_BRAKET);
const QUOTEMARK = c.getChar(c.QUOTEMARK);
const BACKSLASH = c.getChar(c.BACKSLASH);
const SLASH = c.getChar(c.SLASH);
const SPACE = c.getChar(c.SPACE);
const TAB = c.getChar(c.TAB);
const EQ = c.getChar(c.EQ);
const N = c.getChar(c.N);

const RESERVED_CHARS = [CLOSE_BRAKET, OPEN_BRAKET, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N];
const NOT_CHAR_TOKENS = [OPEN_BRAKET, SPACE, TAB, N];
const WHITESPACES = [SPACE, TAB];

const isCharReserved = char => (RESERVED_CHARS.indexOf(char) >= 0);
const isWhiteSpace = char => (WHITESPACES.indexOf(char) >= 0);
const isCharToken = char => (NOT_CHAR_TOKENS.indexOf(char) === -1);

const createGrabber = (source) => {
  let idx = 0;

  const skipChar = () => {
    idx += 1;
  };
  const getStrFrom = start => source.substr(start, idx - start);
  const hasNext = () => source.length > idx;
  const grabUntil = (cond) => {
    const start = idx;

    while (hasNext() && cond(source[idx])) {
      skipChar();
    }

    return getStrFrom(start);
  };
  const isLastChar = () => (idx === source.length);
  const currChar = () => source[idx];
  const nextChar = () => source[idx + 1];
  const prevChar = () => source[idx - 1];

  return {
    skipChar,
    isLastChar,
    hasNext,
    grabUntil,
    nextChar,
    currChar,
    prevChar,
    get index() {
      return idx;
    },
  };
};

const trimChar = (str, charToRemove) => {
  while (str.charAt(0) === charToRemove) {
    str = str.substring(1);
  }

  while (str.charAt(str.length - 1) === charToRemove) {
    str = str.substring(0, str.length - 1);
  }

  return str;
};

const unquote = str => str.replace(BACKSLASH + QUOTEMARK, QUOTEMARK);
const createToken = (type, value, r = 0, cl = 0) => new Token(type, value, r, cl);

function createLexer(buffer, options = {}) {
  let row = 0;
  let col = 0;

  const tokens = [];
  const emitToken = (token) => {
    if (options.onToken) {
      options.onToken(token);
    }

    tokens.push(token);
  };

  const parseAttrs = (str) => {
    let tagName = null;
    let skipSpaces = false;

    const attrTokens = [];
    const attrGrabber = createGrabber(str);
    const validAttr = (val) => {
      const isEQ = val === EQ;
      const isWS = isWhiteSpace(val);
      const isPrevSLASH = attrGrabber.prevChar() === SLASH;

      if (tagName === null) {
        return !(isEQ || isWS || attrGrabber.isLastChar());
      }

      if (skipSpaces && isWS) {
        return true;
      }

      if (val === QUOTEMARK && !isPrevSLASH) {
        skipSpaces = !skipSpaces;
      }

      return !(isEQ || isWS);
    };

    const nextAttr = () => {
      const attrStr = attrGrabber.grabUntil(validAttr);
      const curChar = attrGrabber.currChar();
      const hasNext = attrGrabber.hasNext();
      const isWS = isWhiteSpace(curChar);

      // first string before space is a tag name
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWS || !hasNext) {
        const escaped = unquote(trimChar(attrStr, QUOTEMARK));
        attrTokens.push(createToken(Token.TYPE_ATTR_VALUE, escaped, row, col));
      } else {
        attrTokens.push(createToken(Token.TYPE_ATTR_NAME, attrStr, row, col));
      }

      attrGrabber.skipChar();
    };

    while (attrGrabber.hasNext()) {
      nextAttr();
    }

    return { tag: tagName, attrs: attrTokens };
  };

  const grabber = createGrabber(buffer);

  const next = () => {
    const char = grabber.currChar();
    const isNewLine = char === N;

    if (isNewLine) {
      grabber.skipChar();
      col = 0;
      row++;

      emitToken(createToken(Token.TYPE_NEW_LINE, char, row, col));
    } else if (isWhiteSpace(char)) {
      const str = grabber.grabUntil(isWhiteSpace);
      emitToken(createToken(Token.TYPE_SPACE, str, row, col));
    } else if (char === OPEN_BRAKET) {
      const nextChar = grabber.nextChar();
      grabber.skipChar(); // skip [

      if (isCharReserved(nextChar)) {
        emitToken(createToken(Token.TYPE_WORD, char, row, col));
      } else {
        const str = grabber.grabUntil(val => val !== CLOSE_BRAKET);
        const hasAttrs = str.indexOf(EQ) > 0;
        const isCloseTag = str[0] === SLASH;

        grabber.skipChar(); // skip [

        if (!hasAttrs || isCloseTag) {
          emitToken(createToken(Token.TYPE_TAG, str, row, col));
        } else {
          const parsed = parseAttrs(str);

          emitToken(createToken(Token.TYPE_TAG, parsed.tag, row, col));
          parsed.attrs.map(emitToken);
        }
      }
    } else if (char === CLOSE_BRAKET) {
      grabber.skipChar();

      emitToken(createToken(Token.TYPE_WORD, char, row, col));
    } else if (isCharToken(char)) {
      const str = grabber.grabUntil(isCharToken);

      emitToken(createToken(Token.TYPE_WORD, str, row, col));
    }
  };

  const tokenize = () => {
    while (grabber.hasNext()) {
      next();
    }

    return tokens;
  };

  const isTokenNested = (token) => {
    const value = OPEN_BRAKET + SLASH + token.getValue();
    return buffer.indexOf(value) > -1;
  };

  return {
    tokenize,
    isTokenNested,
  };
}

module.exports = createLexer;
module.exports.createTokenOfType = createToken;

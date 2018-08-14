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

const createCharGrabber = (source) => {
  let idx = 0;

  const skip = () => {
    idx += 1;
  };
  const hasNext = () => source.length > idx;

  return {
    skip,
    hasNext,
    isLast: () => (idx === source.length),
    grabWhile: (cond) => {
      const start = idx;

      while (hasNext() && cond(source[idx])) {
        skip();
      }

      return source.substr(start, idx - start);
    },
    getNext: () => source[idx + 1],
    getPrev: () => source[idx - 1],
    getCurr: () => source[idx],
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
    const attrCharGrabber = createCharGrabber(str);
    const validAttr = (val) => {
      const isEQ = val === EQ;
      const isWS = isWhiteSpace(val);
      const isPrevSLASH = attrCharGrabber.getPrev() === SLASH;

      if (tagName === null) {
        return !(isEQ || isWS || attrCharGrabber.isLast());
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
      const attrStr = attrCharGrabber.grabWhile(validAttr);

      // first string before space is a tag name
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWhiteSpace(attrCharGrabber.getCurr()) || !attrCharGrabber.hasNext()) {
        const escaped = unquote(trimChar(attrStr, QUOTEMARK));
        attrTokens.push(createToken(Token.TYPE_ATTR_VALUE, escaped, row, col));
      } else {
        attrTokens.push(createToken(Token.TYPE_ATTR_NAME, attrStr, row, col));
      }

      attrCharGrabber.skip();
    };

    while (attrCharGrabber.hasNext()) {
      nextAttr();
    }

    return { tag: tagName, attrs: attrTokens };
  };

  const grabber = createCharGrabber(buffer);

  const next = () => {
    const char = grabber.getCurr();

    if (char === N) {
      grabber.skip();
      col = 0;
      row++;

      emitToken(createToken(Token.TYPE_NEW_LINE, char, row, col));
    } else if (isWhiteSpace(char)) {
      const str = grabber.grabWhile(isWhiteSpace);
      emitToken(createToken(Token.TYPE_SPACE, str, row, col));
    } else if (char === OPEN_BRAKET) {
      const nextChar = grabber.getNext();
      grabber.skip(); // skip [

      if (isCharReserved(nextChar)) {
        emitToken(createToken(Token.TYPE_WORD, char, row, col));
      } else {
        const str = grabber.grabWhile(val => val !== CLOSE_BRAKET);
        grabber.skip(); // skip ]

        if (!(str.indexOf(EQ) > 0) || str[0] === SLASH) {
          emitToken(createToken(Token.TYPE_TAG, str, row, col));
        } else {
          const parsed = parseAttrs(str);

          emitToken(createToken(Token.TYPE_TAG, parsed.tag, row, col));
          parsed.attrs.map(emitToken);
        }
      }
    } else if (char === CLOSE_BRAKET) {
      grabber.skip();

      emitToken(createToken(Token.TYPE_WORD, char, row, col));
    } else if (isCharToken(char)) {
      const str = grabber.grabWhile(isCharToken);

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

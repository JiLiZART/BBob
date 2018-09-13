/* eslint-disable no-plusplus,no-param-reassign */
import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  QUOTEMARK,
  BACKSLASH,
  SLASH,
  SPACE,
  TAB,
  EQ,
  N,
} from '@bbob/plugin-helper/lib/char';

import { Token, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_NEW_LINE, TYPE_SPACE, TYPE_TAG, TYPE_WORD } from './Token';

const EM = '!';

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

  let tokenIndex = -1;
  const tokens = new Array(Math.floor(buffer.length));
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;

  const RESERVED_CHARS = [closeTag, openTag, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N, EM];
  const NOT_CHAR_TOKENS = [openTag, SPACE, TAB, N];
  const WHITESPACES = [SPACE, TAB];

  const isCharReserved = char => (RESERVED_CHARS.indexOf(char) >= 0);
  const isWhiteSpace = char => (WHITESPACES.indexOf(char) >= 0);
  const isCharToken = char => (NOT_CHAR_TOKENS.indexOf(char) === -1);

  const emitToken = (token) => {
    if (options.onToken) {
      options.onToken(token);
    }

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  };

  const parseAttrs = (str) => {
    let tagName = null;
    let skipSpecialChars = false;

    const isSpecialChar = val => ([EQ, SPACE, TAB].indexOf(val) >= 0);

    const attrTokens = [];
    const attrCharGrabber = createCharGrabber(str);
    const validAttr = (val) => {
      const isEQ = val === EQ;
      const isWS = isWhiteSpace(val);
      const isPrevSLASH = attrCharGrabber.getPrev() === SLASH;
      const isPrevQuotemark = attrCharGrabber.getPrev() === QUOTEMARK;
      const isTagNameEmpty = tagName === null;

      if (isTagNameEmpty) {
        return (isEQ || isWS || attrCharGrabber.isLast()) === false;
      }

      if (skipSpecialChars && isSpecialChar(val)) {
        return true;
      }

      if (val === QUOTEMARK && !isPrevSLASH) {
        skipSpecialChars = !skipSpecialChars;
      }

      return (isEQ || isWS) === false;
    };

    const nextAttr = () => {
      const attrStr = attrCharGrabber.grabWhile(validAttr);

      // first string before space is a tag name
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWhiteSpace(attrCharGrabber.getCurr()) || !attrCharGrabber.hasNext()) {
        const escaped = unquote(trimChar(attrStr, QUOTEMARK));
        attrTokens.push(createToken(TYPE_ATTR_VALUE, escaped, row, col));
      } else {
        attrTokens.push(createToken(TYPE_ATTR_NAME, attrStr, row, col));
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

      emitToken(createToken(TYPE_NEW_LINE, char, row, col));
    } else if (isWhiteSpace(char)) {
      const str = grabber.grabWhile(isWhiteSpace);
      emitToken(createToken(TYPE_SPACE, str, row, col));
    } else if (char === openTag) {
      const nextChar = grabber.getNext();
      grabber.skip(); // skip [

      if (isCharReserved(nextChar)) {
        emitToken(createToken(TYPE_WORD, char, row, col));
      } else {
        const str = grabber.grabWhile(val => val !== closeTag);
        grabber.skip(); // skip ]

        if (!(str.indexOf(EQ) > 0) || str[0] === SLASH) {
          emitToken(createToken(TYPE_TAG, str, row, col));
        } else {
          const parsed = parseAttrs(str);

          emitToken(createToken(TYPE_TAG, parsed.tag, row, col));
          parsed.attrs.map(emitToken);
        }
      }
    } else if (char === closeTag) {
      grabber.skip();

      emitToken(createToken(TYPE_WORD, char, row, col));
    } else if (isCharToken(char)) {
      const str = grabber.grabWhile(isCharToken);

      emitToken(createToken(TYPE_WORD, str, row, col));
    }
  };

  const tokenize = () => {
    while (grabber.hasNext()) {
      next();
    }

    tokens.length = tokenIndex + 1;

    return tokens;
  };

  const isTokenNested = (token) => {
    const value = openTag + SLASH + token.getValue();
    return buffer.indexOf(value) > -1;
  };

  return {
    tokenize,
    isTokenNested,
  };
}

export const createTokenOfType = createToken;
export { createLexer };

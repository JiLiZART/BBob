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
  const SPECIAL_CHARS = [EQ, SPACE, TAB];

  const isCharReserved = char => (RESERVED_CHARS.indexOf(char) >= 0);
  const isWhiteSpace = char => (WHITESPACES.indexOf(char) >= 0);
  const isCharToken = char => (NOT_CHAR_TOKENS.indexOf(char) === -1);
  const isSpecialChar = char => (SPECIAL_CHARS.indexOf(char) >= 0);

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

    const attrTokens = [];
    const attrCharGrabber = createCharGrabber(str);

    const validAttr = (char) => {
      const isEQ = char === EQ;
      const isWS = isWhiteSpace(char);
      const prevChar = attrCharGrabber.getPrev();
      const nextChar = attrCharGrabber.getNext();
      const isPrevSLASH = prevChar === BACKSLASH;
      const isTagNameEmpty = tagName === null;

      if (isTagNameEmpty) {
        return (isEQ || isWS || attrCharGrabber.isLast()) === false;
      }

      if (skipSpecialChars && isSpecialChar(char)) {
        return true;
      }

      if (char === QUOTEMARK && !isPrevSLASH) {
        skipSpecialChars = !skipSpecialChars;

        if (!skipSpecialChars && !(nextChar === EQ || isWhiteSpace(nextChar))) {
          return false;
        }
      }

      return (isEQ || isWS) === false;
    };

    const nextAttr = () => {
      const attrStr = attrCharGrabber.grabWhile(validAttr);
      const currChar = attrCharGrabber.getCurr();

      // first string before space is a tag name
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWhiteSpace(currChar) || currChar === QUOTEMARK || !attrCharGrabber.hasNext()) {
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

  const bufferGrabber = createCharGrabber(buffer);

  const next = () => {
    const char = bufferGrabber.getCurr();

    if (char === N) {
      bufferGrabber.skip();
      col = 0;
      row++;

      emitToken(createToken(TYPE_NEW_LINE, char, row, col));
    } else if (isWhiteSpace(char)) {
      const str = bufferGrabber.grabWhile(isWhiteSpace);
      emitToken(createToken(TYPE_SPACE, str, row, col));
    } else if (char === openTag) {
      const nextChar = bufferGrabber.getNext();
      bufferGrabber.skip(); // skip [

      if (isCharReserved(nextChar)) {
        emitToken(createToken(TYPE_WORD, char, row, col));
      } else {
        const str = bufferGrabber.grabWhile(val => val !== closeTag);
        bufferGrabber.skip(); // skip ]

        if (!(str.indexOf(EQ) > 0) || str[0] === SLASH) {
          emitToken(createToken(TYPE_TAG, str, row, col));
        } else {
          const parsed = parseAttrs(str);

          emitToken(createToken(TYPE_TAG, parsed.tag, row, col));
          parsed.attrs.map(emitToken);
        }
      }
    } else if (char === closeTag) {
      bufferGrabber.skip();

      emitToken(createToken(TYPE_WORD, char, row, col));
    } else if (isCharToken(char)) {
      const str = bufferGrabber.grabWhile(isCharToken);

      emitToken(createToken(TYPE_WORD, str, row, col));
    }
  };

  const tokenize = () => {
    while (bufferGrabber.hasNext()) {
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

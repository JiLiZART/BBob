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

import {
  Token, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_NEW_LINE, TYPE_SPACE, TYPE_TAG, TYPE_WORD,
} from './Token';
import { createCharGrabber, trimChar, unquote } from './utils';

// for cases <!-- -->
const EM = '!';

/**
 * Creates a Token entity class
 * @param {Number} type
 * @param {String} value
 * @param {Number} r line number
 * @param {Number} cl char number in line
 */
const createToken = (type, value, r = 0, cl = 0) => new Token(type, value, r, cl);

/**
 * @typedef {Object} Lexer
 * @property {Function} tokenize
 * @property {Function} isTokenNested
 */

/**
 * @param {String} buffer
 * @param {Object} options
 * @param {Function} options.onToken
 * @param {String} options.openTag
 * @param {String} options.closeTag
 * @param {Boolean} options.enableEscapeTags
 * @return {Lexer}
 */
function createLexer(buffer, options = {}) {
  const STATE_WORD = 0;
  const STATE_TAG = 1;
  const STATE_TAG_ATTRS = 2;

  const TAG_STATE_NAME = 0;
  const TAG_STATE_ATTR = 1;
  const TAG_STATE_VALUE = 2;

  let row = 0;
  let col = 0;

  let tokenIndex = -1;
  let stateMode = STATE_WORD;
  let tagMode = TAG_STATE_NAME;
  const tokens = new Array(Math.floor(buffer.length));
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const escapeTags = !!options.enableEscapeTags;
  const onToken = options.onToken || (() => {
  });

  const RESERVED_CHARS = [closeTag, openTag, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N, EM];
  const NOT_CHAR_TOKENS = [
    // ...(options.enableEscapeTags ? [BACKSLASH] : []),
    openTag, SPACE, TAB, N,
  ];
  const WHITESPACES = [SPACE, TAB];
  const SPECIAL_CHARS = [EQ, SPACE, TAB];

  const isCharReserved = (char) => (RESERVED_CHARS.indexOf(char) >= 0);
  const isNewLine = (char) => char === N;
  const isWhiteSpace = (char) => (WHITESPACES.indexOf(char) >= 0);
  const isCharToken = (char) => (NOT_CHAR_TOKENS.indexOf(char) === -1);
  const isSpecialChar = (char) => (SPECIAL_CHARS.indexOf(char) >= 0);
  const isEscapableChar = (char) => (char === openTag || char === closeTag || char === BACKSLASH);
  const isEscapeChar = (char) => char === BACKSLASH;
  const onSkip = () => {
    col++;
  };

  const chars = createCharGrabber(buffer, { onSkip });

  /**
   * Emits newly created token to subscriber
   * @param {Number} type
   * @param {String} value
   */
  function emitToken(type, value) {
    const token = createToken(type, value, row, col);

    onToken(token);

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  }

  function nextTagState(tagChars) {
    if (tagMode === TAG_STATE_NAME) {
      const currChar = tagChars.getCurr();

      if (isWhiteSpace(currChar) || currChar === QUOTEMARK || !tagChars.hasNext()) {
        return TAG_STATE_VALUE;
      }

      const validName = (char) => !(char === EQ || isWhiteSpace(char) || tagChars.isLast());

      emitToken(TYPE_TAG, tagChars.grabWhile(validName));

      tagChars.skip();

      return tagChars.includes(EQ) ? TAG_STATE_ATTR : TAG_STATE_VALUE;
    }
    if (tagMode === TAG_STATE_ATTR) {
      const validAttrName = (char) => !(char === EQ || isWhiteSpace(char));
      const name = tagChars.grabWhile(validAttrName);

      const isEnd = tagChars.isLast();

      if (isEnd) {
        emitToken(TYPE_ATTR_VALUE, unquote(trimChar(name, QUOTEMARK)));
      } else {
        emitToken(TYPE_ATTR_NAME, name);
      }

      tagChars.skip();

      return TAG_STATE_VALUE;
    }
    if (tagMode === TAG_STATE_VALUE) {
      let skipSpecialChars = false;
      const name = tagChars.grabWhile((char) => {
        const isEQ = char === EQ;
        const isWS = isWhiteSpace(char);
        const prevChar = tagChars.getPrev();
        const nextChar = tagChars.getNext();
        const isPrevSLASH = prevChar === BACKSLASH;

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
      });

      emitToken(TYPE_ATTR_VALUE, unquote(trimChar(name, QUOTEMARK)));

      tagChars.skip();

      return TAG_STATE_ATTR;
    }

    return TAG_STATE_NAME;
  }

  function stateTag() {
    const currChar = chars.getCurr();

    if (currChar === openTag) {
      const nextChar = chars.getNext();

      chars.skip();

      // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
      const substr = chars.substrUntilChar(closeTag);
      const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar) || hasInvalidChars || chars.isLast()) {
        emitToken(TYPE_WORD, currChar);

        return STATE_WORD;
      }

      // [myTag   ]
      const isNoAttrsInTag = substr.indexOf(EQ) === -1;
      // [/myTag]
      const isClosingTag = substr[0] === SLASH;

      if (isNoAttrsInTag || isClosingTag) {
        const name = chars.grabWhile((char) => char !== closeTag);

        chars.skip(); // skip closeTag

        emitToken(TYPE_TAG, name);

        return STATE_WORD;
      }

      return STATE_TAG_ATTRS;
    }
    if (currChar === closeTag) {
      chars.skip();

      return STATE_WORD;
    }

    return STATE_WORD;
  }

  function stateAttrs() {
    const tagStr = chars.grabWhile((char) => char !== closeTag);
    const tagGrabber = createCharGrabber(tagStr, { onSkip });

    while (tagGrabber.hasNext()) {
      tagMode = nextTagState(tagGrabber);
    }

    chars.skip(); // skip closeTag

    return STATE_WORD;
  }

  function stateWord() {
    if (isNewLine(chars.getCurr())) {
      emitToken(TYPE_NEW_LINE, chars.getCurr());

      chars.skip();

      col = 0;
      row++;

      return STATE_WORD;
    }

    if (isWhiteSpace(chars.getCurr())) {
      emitToken(TYPE_SPACE, chars.grabWhile(isWhiteSpace));

      return STATE_WORD;
    }

    if (chars.getCurr() === openTag) {
      if (chars.includes(closeTag)) {
        return STATE_TAG;
      }

      emitToken(TYPE_WORD, chars.getCurr());

      chars.skip();

      return STATE_WORD;
    }

    if (escapeTags) {
      if (isEscapeChar(chars.getCurr())) {
        const currChar = chars.getCurr();
        const nextChar = chars.getNext();

        chars.skip(); // skip the \ without emitting anything

        if (isEscapableChar(nextChar)) {
          chars.skip(); // skip past the [, ] or \ as well

          emitToken(TYPE_WORD, nextChar);

          return STATE_WORD;
        }

        emitToken(TYPE_WORD, currChar);

        return STATE_WORD;
      }

      const isChar = (char) => isCharToken(char) && !isEscapeChar(char);

      emitToken(TYPE_WORD, chars.grabWhile(isChar));

      return STATE_WORD;
    }

    emitToken(TYPE_WORD, chars.grabWhile(isCharToken));

    return STATE_WORD;
  }

  function tokenize() {
    while (chars.hasNext()) {
      switch (stateMode) {
        case STATE_TAG:
          stateMode = stateTag();
          break;
        case STATE_TAG_ATTRS:
          stateMode = stateAttrs();
          break;
        case STATE_WORD:
          stateMode = stateWord();
          break;
        default:
          stateMode = STATE_WORD;
          break;
      }
    }

    tokens.length = tokenIndex + 1;

    return tokens;
  }

  function isTokenNested(token) {
    const value = openTag + SLASH + token.getValue();
    // potential bottleneck
    return buffer.indexOf(value) > -1;
  }

  return {
    tokenize,
    isTokenNested,
  };
}

export const createTokenOfType = createToken;
export { createLexer };

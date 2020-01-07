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
import { createCharGrabber, trimChar, unquote } from './utils';

// for cases <!-- -->
const EM = '!';

/**
 * Creates a Token entity class
 * @param {String} type
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

// [tag attr-name="attr-value"]content[/tag] other content
const STATE_WORD = 0;
const STATE_TAG = 1;
const STATE_ATTR = 2;
const STATE_ATTR_NAME = 3;
const STATE_ATTR_VALUE = 4;

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
  let row = 0;
  let col = 0;

  let tokenIndex = -1;
  let mode = 0;
  const tokens = new Array(Math.floor(buffer.length));
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const escapeTags = options.enableEscapeTags;

  const RESERVED_CHARS = [closeTag, openTag, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N, EM];
  const NOT_CHAR_TOKENS = [
    // ...(options.enableEscapeTags ? [BACKSLASH] : []),
    openTag, SPACE, TAB, N,
  ];
  const WHITESPACES = [SPACE, TAB];
  const SPECIAL_CHARS = [EQ, SPACE, TAB];

  const isCharReserved = char => (RESERVED_CHARS.indexOf(char) >= 0);
  const isNewLine = char => char === N;
  const isWhiteSpace = char => (WHITESPACES.indexOf(char) >= 0);
  const isCharToken = char => (NOT_CHAR_TOKENS.indexOf(char) === -1);
  const isSpecialChar = char => (SPECIAL_CHARS.indexOf(char) >= 0);
  const isEscapableChar = char => (char === openTag || char === closeTag || char === BACKSLASH);
  const isEscapeChar = char => char === BACKSLASH;

  const bufferGrabber = createCharGrabber(buffer, {
    onSkip: () => {
      col++;
    },
  });

  /**
   * Emits newly created token to subscriber
   * @param token
   */
  const emitToken = (token) => {
    if (options.onToken) {
      options.onToken(token);
    }

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  };

  const switchMode = (newMode) => {
    mode = newMode;
  };

  const processWord = () => {
    const currChar = bufferGrabber.getCurr();
    const nextChar = bufferGrabber.getNext();

    if (currChar === openTag && bufferGrabber.includes(closeTag)) {
      return switchMode(STATE_TAG);
    }

    if (isNewLine(currChar)) {
      bufferGrabber.skip();
      col = 0;
      row++;
      return emitToken(createToken(TYPE_NEW_LINE, currChar, row, col));
    }

    if (isWhiteSpace(currChar)) {
      return emitToken(createToken(TYPE_SPACE, bufferGrabber.grabWhile(isWhiteSpace), row, col));
    }

    if (escapeTags) {
      if (isEscapeChar(currChar) && !isEscapableChar(nextChar)) {
        bufferGrabber.skip();
        return emitToken(createToken(TYPE_WORD, currChar, row, col));
      }

      const str = bufferGrabber.grabWhile(char => isCharToken(char) && !isEscapeChar(char));

      return emitToken(createToken(TYPE_WORD, str, row, col));
    }

    const str = bufferGrabber.grabWhile(char => isCharToken(char));

    return emitToken(createToken(TYPE_WORD, str, row, col));
  };
  const processTag = () => {
    const currChar = bufferGrabber.getCurr();
    const nextChar = bufferGrabber.getNext();

    if (currChar === closeTag) {
      bufferGrabber.skip(); // skip closeTag
      switchMode(STATE_WORD);
      return emitToken(createToken(TYPE_WORD, currChar, row, col));
    }

    if (currChar === openTag) {
      bufferGrabber.skip(); // skip openTag

      // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
      const str = bufferGrabber.grabWhile(val => val !== closeTag);
      const hasInvalidChars = str.length === 0 || str.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar) || hasInvalidChars || bufferGrabber.isLast()) {
        return emitToken(createToken(TYPE_WORD, currChar, row, col));
      }

      bufferGrabber.skip(); // skip closeTag
      // [myTag   ]
      const isNoAttrsInTag = str.indexOf(EQ) === -1;
      // [/myTag]
      const isClosingTag = str[0] === SLASH;

      if (isNoAttrsInTag || isClosingTag) {
        return emitToken(createToken(TYPE_TAG, str, row, col));
      }
    }

    return switchMode(STATE_WORD);
  };
  const processAttrName = () => {};
  const processAttrValue = () => {};

  const modeMap = {
    [STATE_WORD]: processWord,
    [STATE_TAG]: processTag,
    [STATE_ATTR_NAME]: processAttrName,
    [STATE_ATTR_VALUE]: processAttrValue,
  };

  const tokenize = () => {
    while (bufferGrabber.hasNext()) {
      modeMap[mode](bufferGrabber);
    }

    tokens.length = tokenIndex + 1;

    return tokens;
  };

  const isTokenNested = (token) => {
    const value = openTag + SLASH + token.getValue();
    // potential bottleneck
    return buffer.indexOf(value) > -1;
  };


  return {
    tokenize,
    isTokenNested,
  };
}

export const createTokenOfType = createToken;
export { createLexer };

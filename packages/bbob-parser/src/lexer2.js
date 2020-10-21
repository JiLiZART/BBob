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
  const STATE_SPACE = 3;
  const STATE_NEW_LINE = 4;

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
  const onToken = options.onToken || (() => {});

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
  const onSkip = () => { col++; };

  const bufferGrabber = createCharGrabber(buffer, { onSkip });

  /**
   * Emits newly created token to subscriber
   * @param {Number} type
   * @param {String} value
   */
  const emitToken = (type, value) => {
    const token = createToken(type, value, row, col);

    onToken(token);

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  };

  const switchMode = (newMode) => {
    stateMode = newMode;
  };

  const switchTagMode = (newMode) => {
    tagMode = newMode;
  };

  const processWord = () => {
    const currChar = bufferGrabber.getCurr();
    const nextChar = bufferGrabber.getNext();

    if (isNewLine(currChar)) {
      return switchMode(STATE_NEW_LINE);
    }

    if (isWhiteSpace(currChar)) {
      return switchMode(STATE_SPACE);
    }

    if (currChar === openTag) {
      if (bufferGrabber.includes(closeTag)) {
        return switchMode(STATE_TAG);
      }

      bufferGrabber.skip();

      emitToken(TYPE_WORD, currChar);

      return switchMode(STATE_WORD);
    }

    if (escapeTags) {
      if (isEscapeChar(currChar)) {
        bufferGrabber.skip(); // skip the \ without emitting anything

        if (isEscapableChar(nextChar)) {
          bufferGrabber.skip(); // skip past the [, ] or \ as well

          emitToken(TYPE_WORD, nextChar);

          return switchMode(STATE_WORD);
        }

        emitToken(TYPE_WORD, currChar);

        return switchMode(STATE_WORD);
      }

      const isChar = (char) => isCharToken(char) && !isEscapeChar(char);
      const word = bufferGrabber.grabWhile(isChar);

      emitToken(TYPE_WORD, word);

      return switchMode(STATE_WORD);
    }

    emitToken(TYPE_WORD, bufferGrabber.grabWhile(isCharToken));

    return switchMode(STATE_WORD);
  };

  const tagMap = {
    [openTag]: () => {
      const currChar = bufferGrabber.getCurr();
      const nextChar = bufferGrabber.getNext();

      bufferGrabber.skip();

      // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
      const substr = bufferGrabber.substrUntilChar(closeTag);
      const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar) || hasInvalidChars || bufferGrabber.isLast()) {
        emitToken(TYPE_WORD, currChar);

        return switchMode(STATE_WORD);
      }

      // [myTag   ]
      const isNoAttrsInTag = substr.indexOf(EQ) === -1;
      // [/myTag]
      const isClosingTag = substr[0] === SLASH;

      if (isNoAttrsInTag || isClosingTag) {
        const name = bufferGrabber.grabWhile((char) => char !== closeTag);

        bufferGrabber.skip(); // skip closeTag

        emitToken(TYPE_TAG, name);

        return switchMode(STATE_WORD);
      }

      return switchMode(STATE_TAG_ATTRS);
    },
    [closeTag]: () => {
      bufferGrabber.skip();

      return switchMode(STATE_WORD);
    },
  };

  const tagStateMap = {
    [TAG_STATE_NAME]: (tagGrabber) => {
      const currChar = tagGrabber.getCurr();

      if (isWhiteSpace(currChar) || currChar === QUOTEMARK || !tagGrabber.hasNext()) {
        return switchTagMode(TAG_STATE_VALUE);
      }

      const validName = (char) => !(char === EQ || isWhiteSpace(char) || tagGrabber.isLast());

      emitToken(TYPE_TAG, tagGrabber.grabWhile(validName));

      const hasEQ = tagGrabber.includes(EQ);

      if (hasEQ) {
        return switchTagMode(TAG_STATE_ATTR);
      }

      return switchTagMode(TAG_STATE_VALUE);
    },
    [TAG_STATE_ATTR]: (tagGrabber) => {
      const validAttrName = (char) => !(char === EQ || isWhiteSpace(char));
      const name = tagGrabber.grabWhile(validAttrName);

      const isEnd = tagGrabber.isLast();

      emitToken(isEnd ? TYPE_ATTR_VALUE : TYPE_ATTR_NAME, name);

      return switchTagMode(TAG_STATE_VALUE);
    },
    [TAG_STATE_VALUE]: (tagGrabber) => {
      let skipSpecialChars = false;
      const name = tagGrabber.grabWhile((char) => {
        const isEQ = char === EQ;
        const isWS = isWhiteSpace(char);
        const prevChar = tagGrabber.getPrev();
        const nextChar = tagGrabber.getNext();
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

      return switchTagMode(TAG_STATE_ATTR);
    },
  };

  const processTag = () => {
    const char = bufferGrabber.getCurr();

    if (tagMap[char]) {
      return tagMap[char]();
    }

    return switchMode(STATE_WORD);
  };

  const processTagAttrs = () => {
    const tagStr = bufferGrabber.grabWhile((char) => char !== closeTag);
    const tagGrabber = createCharGrabber(tagStr, { onSkip });

    while (tagGrabber.hasNext()) {
      tagStateMap[tagMode](tagGrabber);

      tagGrabber.skip();
    }

    bufferGrabber.skip(); // skip closeTag

    return switchMode(STATE_WORD);
  };
  const processSpace = () => {
    const name = bufferGrabber.grabWhile(isWhiteSpace);

    emitToken(TYPE_SPACE, name);

    return switchMode(STATE_WORD);
  };
  const processNewLine = () => {
    const currChar = bufferGrabber.getCurr();

    bufferGrabber.skip();

    col = 0;
    row++;

    emitToken(TYPE_NEW_LINE, currChar);

    return switchMode(STATE_WORD);
  };

  const stateMap = {
    [STATE_WORD]: processWord,
    [STATE_TAG]: processTag,
    [STATE_TAG_ATTRS]: processTagAttrs,
    [STATE_SPACE]: processSpace,
    [STATE_NEW_LINE]: processNewLine,
  };

  const tokenize = () => {
    while (bufferGrabber.hasNext()) {
      stateMap[stateMode](bufferGrabber);
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

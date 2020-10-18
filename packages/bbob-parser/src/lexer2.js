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

// [tag attr-name="attr-value"]content[/tag] other content
const STATE_WORD = 0;
const STATE_TAG = 1;
const STATE_TAG_ATTRS = 2;
const STATE_SPACE = 3;
const STATE_NEW_LINE = 4;

const TAG_STATE_NAME = 0;
const TAG_STATE_ATTR = 1;
const TAG_STATE_VALUE = 2;

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

    if (currChar === openTag && bufferGrabber.includes(closeTag)) {
      return switchMode(STATE_TAG);
    }

    if (isNewLine(currChar)) {
      return switchMode(STATE_NEW_LINE);
    }

    if (isWhiteSpace(currChar)) {
      return switchMode(STATE_SPACE);
    }

    if (escapeTags) {
      if (isEscapeChar(currChar) && !isEscapableChar(nextChar)) {
        bufferGrabber.skip();
        return emitToken(createToken(TYPE_WORD, currChar, row, col));
      }

      const str = bufferGrabber.grabWhile((char) => isCharToken(char) && !isEscapeChar(char));

      return emitToken(createToken(TYPE_WORD, str, row, col));
    }

    const str = bufferGrabber.grabWhile((char) => isCharToken(char));

    return emitToken(createToken(TYPE_WORD, str, row, col));
  };
  const processTag = () => {
    const currChar = bufferGrabber.getCurr();
    const nextChar = bufferGrabber.getNext();

    if (currChar === closeTag) {
      bufferGrabber.skip(); // skip closeTag

      return switchMode(STATE_WORD);
    }

    if (currChar === openTag) {
      bufferGrabber.skip(); // skip openTag

      // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
      const substr = bufferGrabber.substrUntilChar(closeTag);
      const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar) || hasInvalidChars || bufferGrabber.isLast()) {
        return emitToken(createToken(TYPE_WORD, currChar, row, col));
      }

      // [myTag   ]
      const isNoAttrsInTag = substr.indexOf(EQ) === -1;
      // [/myTag]
      const isClosingTag = substr[0] === SLASH;

      if (isNoAttrsInTag || isClosingTag) {
        return emitToken(createToken(TYPE_TAG, substr, row, col));
      }

      return switchMode(STATE_TAG_ATTRS);
    }

    return switchMode(STATE_WORD);
  };

  const tagStateMap = {
    [TAG_STATE_NAME]: (tagGrabber) => {
      const currChar = tagGrabber.getCurr();

      if (isWhiteSpace(currChar) || currChar === QUOTEMARK || !tagGrabber.hasNext()) {
        return switchTagMode(TAG_STATE_VALUE);
      }

      const name = tagGrabber.grabWhile((char) => {
        const isEQ = char === EQ;
        const isWS = isWhiteSpace(char);

        return (isEQ || isWS || tagGrabber.isLast()) === false;
      });

      switchTagMode(TAG_STATE_ATTR);
      return emitToken(createToken(TYPE_TAG, name, row, col));
    },
    [TAG_STATE_ATTR]: (tagGrabber) => {
      const name = tagGrabber.grabWhile((char) => {
        const isEQ = char === EQ;
        const isWS = isWhiteSpace(char);

        return (isEQ || isWS) === false;
      });

      switchTagMode(TAG_STATE_VALUE);
      return emitToken(createToken(TYPE_ATTR_NAME, name, row, col));
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
      const escaped = unquote(trimChar(name, QUOTEMARK));

      switchTagMode(TAG_STATE_ATTR);
      return emitToken(createToken(TYPE_ATTR_VALUE, escaped, row, col));
    },
  };
  const processTagAttrs = () => {
    const tagStr = bufferGrabber.grabWhile((val) => val !== closeTag);
    const tagGrabber = createCharGrabber(tagStr);

    while (tagGrabber.hasNext()) {
      tagStateMap[tagMode](tagGrabber);

      tagGrabber.skip();
    }

    bufferGrabber.skip(); // skip closeTag

    return switchMode(STATE_WORD);
  };
  const processSpace = () => emitToken(
    createToken(TYPE_SPACE, bufferGrabber.grabWhile(isWhiteSpace), row, col),
  );
  const processNewLine = () => {
    const currChar = bufferGrabber.getCurr();
    bufferGrabber.skip();
    col = 0;
    row++;
    return emitToken(createToken(TYPE_NEW_LINE, currChar, row, col));
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

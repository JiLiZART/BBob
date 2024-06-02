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
} from '@bbob/plugin-helper';
import type { LexerOptions, LexerTokenizer } from "@bbob/types";

import {
  Token, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_NEW_LINE, TYPE_SPACE, TYPE_TAG, TYPE_WORD,
} from './Token';
import { CharGrabber, createCharGrabber, trimChar, unquote } from './utils';

// for cases <!-- -->
const EM = '!';

export function createTokenOfType(type: number, value: string, r = 0, cl = 0) {
  return new Token(type, value, r, cl)
}

const STATE_WORD = 0;
const STATE_TAG = 1;
const STATE_TAG_ATTRS = 2;

const TAG_STATE_NAME = 0;
const TAG_STATE_ATTR = 1;
const TAG_STATE_VALUE = 2;

const WHITESPACES = [SPACE, TAB];
const SPECIAL_CHARS = [EQ, SPACE, TAB];

const isWhiteSpace = (char: string) => (WHITESPACES.indexOf(char) >= 0);
const isEscapeChar = (char: string) => char === BACKSLASH;
const isSpecialChar = (char: string) => (SPECIAL_CHARS.indexOf(char) >= 0);
const isNewLine = (char: string) => char === N;
const unq = (val: string) => unquote(trimChar(val, QUOTEMARK));

export function createLexer(buffer: string, options: LexerOptions = {}): LexerTokenizer {
  let row = 0;
  let col = 0;

  let tokenIndex = -1;
  let stateMode = STATE_WORD;
  let tagMode = TAG_STATE_NAME;
  let contextFreeTag = '';
  const tokens = new Array<Token<string>>(Math.floor(buffer.length));
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const escapeTags = !!options.enableEscapeTags;
  const contextFreeTags = (options.contextFreeTags || [])
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
  const nestedMap = new Map<string, boolean>();
  const onToken = options.onToken || (() => {
  });

  const RESERVED_CHARS = [closeTag, openTag, QUOTEMARK, BACKSLASH, SPACE, TAB, EQ, N, EM];
  const NOT_CHAR_TOKENS = [
    openTag, SPACE, TAB, N,
  ];

  const isCharReserved = (char: string) => (RESERVED_CHARS.indexOf(char) >= 0);
  const isCharToken = (char: string) => (NOT_CHAR_TOKENS.indexOf(char) === -1);
  const isEscapableChar = (char: string) => (char === openTag || char === closeTag || char === BACKSLASH);
  const onSkip = () => {
    col++;
  };

  const checkContextFreeMode = (name: string, isClosingTag?: boolean) => {
    if (contextFreeTag !== '' && isClosingTag) {
      contextFreeTag = '';
    }

    if (contextFreeTag === '' && contextFreeTags.includes(name.toLowerCase())) {
      contextFreeTag = name;
    }
  };

  const chars = createCharGrabber(buffer, { onSkip });

  /**
   * Emits newly created token to subscriber
   * @param {Number} type
   * @param {String} value
   */
  function emitToken(type: number, value: string) {
    const token = createTokenOfType(type, value, row, col);

    onToken(token);

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  }

  function nextTagState(tagChars: CharGrabber, isSingleValueTag: boolean) {
    if (tagMode === TAG_STATE_ATTR) {
      const validAttrName = (char: string) => !(char === EQ || isWhiteSpace(char));
      const name = tagChars.grabWhile(validAttrName);
      const isEnd = tagChars.isLast();
      const isValue = tagChars.getCurr() !== EQ;

      tagChars.skip();

      if (isEnd || isValue) {
        emitToken(TYPE_ATTR_VALUE, unq(name));
      } else {
        emitToken(TYPE_ATTR_NAME, name);
      }

      if (isEnd) {
        return TAG_STATE_NAME;
      }

      if (isValue) {
        return TAG_STATE_ATTR;
      }

      return TAG_STATE_VALUE;
    }
    if (tagMode === TAG_STATE_VALUE) {
      let stateSpecial = false;

      const validAttrValue = (char: string) => {
        // const isEQ = char === EQ;
        const isQM = char === QUOTEMARK;
        const prevChar = tagChars.getPrev();
        const nextChar = tagChars.getNext();
        const isPrevSLASH = prevChar === BACKSLASH;
        const isNextEQ = nextChar === EQ;
        const isWS = isWhiteSpace(char);
        // const isPrevWS = isWhiteSpace(prevChar);
        const isNextWS = nextChar && isWhiteSpace(nextChar);

        if (stateSpecial && isSpecialChar(char)) {
          return true;
        }

        if (isQM && !isPrevSLASH) {
          stateSpecial = !stateSpecial;

          if (!stateSpecial && !(isNextEQ || isNextWS)) {
            return false;
          }
        }

        if (!isSingleValueTag) {
          return !isWS;
          // return (isEQ || isWS) === false;
        }

        return true;
      };
      const name = tagChars.grabWhile(validAttrValue);

      tagChars.skip();

      emitToken(TYPE_ATTR_VALUE, unq(name));

      if (tagChars.isLast()) {
        return TAG_STATE_NAME;
      }

      return TAG_STATE_ATTR;
    }

    const validName = (char: string) => !(char === EQ || isWhiteSpace(char) || tagChars.isLast());
    const name = tagChars.grabWhile(validName);

    emitToken(TYPE_TAG, name);
    checkContextFreeMode(name);

    tagChars.skip();

    // in cases when we has [url=someval]GET[/url] and we dont need to parse all
    if (isSingleValueTag) {
      return TAG_STATE_VALUE;
    }

    const hasEQ = tagChars.includes(EQ);

    return hasEQ ? TAG_STATE_ATTR : TAG_STATE_VALUE;
  }

  function stateTag() {
    const currChar = chars.getCurr();
    const nextChar = chars.getNext();

    chars.skip();

    // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
    const substr = chars.substrUntilChar(closeTag);
    const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

    if ((nextChar && isCharReserved(nextChar)) || hasInvalidChars || chars.isLast()) {
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
      checkContextFreeMode(name, isClosingTag);

      return STATE_WORD;
    }

    return STATE_TAG_ATTRS;
  }

  function stateAttrs() {
    const silent = true;
    const tagStr = chars.grabWhile((char) => char !== closeTag, silent);
    const tagGrabber = createCharGrabber(tagStr, { onSkip });
    const hasSpace = tagGrabber.includes(SPACE);

    tagMode = TAG_STATE_NAME;

    while (tagGrabber.hasNext()) {
      tagMode = nextTagState(tagGrabber, !hasSpace);
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
      const word = chars.grabWhile(isWhiteSpace);

      emitToken(TYPE_SPACE, word);

      return STATE_WORD;
    }

    if (chars.getCurr() === openTag) {
      if (contextFreeTag) {
        const fullTagLen = openTag.length + SLASH.length + contextFreeTag.length;
        const fullTagName = `${openTag}${SLASH}${contextFreeTag}`;
        const foundTag = chars.grabN(fullTagLen);
        const isEndContextFreeMode = foundTag === fullTagName;

        if (isEndContextFreeMode) {
          return STATE_TAG;
        }
      } else if (chars.includes(closeTag)) {
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

        if (nextChar && isEscapableChar(nextChar)) {
          chars.skip(); // skip past the [, ] or \ as well

          emitToken(TYPE_WORD, nextChar);

          return STATE_WORD;
        }

        emitToken(TYPE_WORD, currChar);

        return STATE_WORD;
      }

      const isChar = (char: string) => isCharToken(char) && !isEscapeChar(char);

      const word = chars.grabWhile(isChar);

      emitToken(TYPE_WORD, word);

      return STATE_WORD;
    }

    const word = chars.grabWhile(isCharToken);

    emitToken(TYPE_WORD, word);

    return STATE_WORD;
  }

  function tokenize() {
    stateMode = STATE_WORD;

    while (chars.hasNext()) {
      switch (stateMode) {
        case STATE_TAG:
          stateMode = stateTag();
          break;
        case STATE_TAG_ATTRS:
          stateMode = stateAttrs();
          break;
        case STATE_WORD:
        default:
          stateMode = stateWord();
          break;
      }
    }

    tokens.length = tokenIndex + 1;

    return tokens;
  }

  function isTokenNested(token: Token) {
    const value = openTag + SLASH + token.getValue();

    if (nestedMap.has(value)) {
      return !!nestedMap.get(value);
    } else {
      const status = (buffer.indexOf(value) > -1)

      nestedMap.set(value, status);

      return status;
    }
  }

  return {
    tokenize,
    isTokenNested,
  }
}

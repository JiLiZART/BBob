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
} from './Token.js';
import { CharGrabber, createCharGrabber, trimChar, unquote } from './utils.js';

// for cases <!-- -->
const EM = '!';

// Char codes for the reserved/structural characters. Comparing numeric codes
// avoids allocating 1-char strings on every character in the hot scan loops.
const CODE_QUOTEMARK = QUOTEMARK.charCodeAt(0);
const CODE_BACKSLASH = BACKSLASH.charCodeAt(0);
const CODE_SPACE = SPACE.charCodeAt(0);
const CODE_TAB = TAB.charCodeAt(0);
const CODE_EQ = EQ.charCodeAt(0);
const CODE_N = N.charCodeAt(0);

export function createTokenOfType(type: number, value: string, r = 0, cl = 0, p = 0, e = 0) {
  return new Token(type, value, r, cl, p, e);
}

const STATE_WORD = 0;
const STATE_TAG = 1;
const STATE_TAG_ATTRS = 2;

const TAG_STATE_NAME = 0;
const TAG_STATE_ATTR = 1;
const TAG_STATE_VALUE = 2;

const END_POS_OFFSET = 2;  // length + start position offset

const isWhiteSpaceCode = (code: number) => code === CODE_SPACE || code === CODE_TAB;
const isSpecialCode = (code: number) => code === CODE_EQ || code === CODE_SPACE || code === CODE_TAB;
// Both trimChar and unquote only ever act on quotemarks, so an unquoted value
// (the common case) can skip them entirely.
const unq = (val: string) => (
  val.indexOf(QUOTEMARK) === -1 ? val : unquote(trimChar(val, QUOTEMARK))
);

export function createLexer(buffer: string, options: LexerOptions = {}): LexerTokenizer {
  let row = 0;
  let prevCol = 0;
  let col = 0;

  let tokenIndex = -1;
  let stateMode = STATE_WORD;
  let tagMode = TAG_STATE_NAME;
  let contextFreeTag = '';
  // Token count is far smaller than char count; grow on demand rather than
  // reserving one slot per character.
  const tokens: Token[] = [];
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const escapeTags = !!options.enableEscapeTags;
  const contextFreeTags = (options.contextFreeTags || [])
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
  const caseFreeTags = options.caseFreeTags || false;
  const nestedMap = new Map<string, boolean>();
  const onToken = options.onToken || (() => {
  });

  // Structural delimiters are single characters (the char-by-char scan assumes
  // this); cache their codes for numeric comparison in the hot loops.
  const openTagCode = openTag.charCodeAt(0);
  const closeTagCode = closeTag.charCodeAt(0);
  const CODE_EM = EM.charCodeAt(0);

  const RESERVED_CODES_SET = new Set([
    closeTagCode, openTagCode, CODE_QUOTEMARK, CODE_BACKSLASH,
    CODE_SPACE, CODE_TAB, CODE_EQ, CODE_N, CODE_EM,
  ]);
  const isCharReservedCode = (code: number) => RESERVED_CODES_SET.has(code);
  const isCharTokenCode = (code: number) => code !== openTagCode
    && code !== CODE_SPACE && code !== CODE_TAB && code !== CODE_N;
  const isEscapableCode = (code: number) => (code === openTagCode
    || code === closeTagCode || code === CODE_BACKSLASH);
  const onSkip = (count = 1) => {
    col += count;
  };

  const setupContextFreeTag = (name: string, isClosingTag?: boolean) => {
    if (contextFreeTag !== '' && isClosingTag) {
      contextFreeTag = '';
    }

    const tagName = name.toLowerCase()

    if (contextFreeTag === '' && isTokenNested(name) && contextFreeTags.includes(tagName)) {
      contextFreeTag = tagName;
    }
  };
  const toEndTag = (tagName: string) => `${openTag}${SLASH}${tagName}${closeTag}`

  const chars = createCharGrabber(buffer, { onSkip });

  /**
   * Emits newly created token to subscriber
   *
   * @param {number} type - 1 - word, 2 - tag, 3 - attr-name, 4 - attr-value, 5 - space, 6 - new-line
   * @param {string} value - token value
   * @param {number} startPos - start position
   * @param {number} endPos - end position
   */
  function emitToken(type: number, value: string, startPos?: number, endPos?: number) {
    const token = createTokenOfType(type, value, row, prevCol, startPos, endPos);

    onToken(token);

    prevCol = col;
    tokenIndex += 1;
    tokens[tokenIndex] = token;
  }

  function nextTagState(tagChars: CharGrabber, isSingleValueTag: boolean, masterStartPos: number) {
    if (tagMode === TAG_STATE_ATTR) {
      const validAttrName = (code: number) => !(code === CODE_EQ || isWhiteSpaceCode(code));
      const name = tagChars.grabWhileCode(validAttrName);
      const isEnd = tagChars.isLast();
      const isValue = tagChars.getCurrCode() !== CODE_EQ;

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

      const validAttrValue = (code: number) => {
        const isQM = code === CODE_QUOTEMARK;
        const prevCode = tagChars.getPrevCode();
        const nextCode = tagChars.getNextCode();
        const isPrevSLASH = prevCode === CODE_BACKSLASH;
        const isNextEQ = nextCode === CODE_EQ;
        const isWS = isWhiteSpaceCode(code);
        const isNextWS = isWhiteSpaceCode(nextCode);

        if (stateSpecial && isSpecialCode(code)) {
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
        }

        return true;
      };
      const name = tagChars.grabWhileCode(validAttrValue);

      tagChars.skip();

      emitToken(TYPE_ATTR_VALUE, unq(name));
      if (tagChars.getPrevCode() === CODE_QUOTEMARK) {
        prevCol++;
      }

      if (tagChars.isLast()) {
        return TAG_STATE_NAME;
      }

      return TAG_STATE_ATTR;
    }

    const start = masterStartPos + tagChars.getPos() - 1;
    const validName = (code: number) => !(code === CODE_EQ || isWhiteSpaceCode(code) || tagChars.isLast());
    const name = tagChars.grabWhileCode(validName);

    emitToken(TYPE_TAG, name, start, masterStartPos + tagChars.getLength() + 1);

    setupContextFreeTag(name);

    tagChars.skip();
    prevCol++;

    // in cases when we have [url=someval]GET[/url] and we don't need to parse all
    if (isSingleValueTag) {
      return TAG_STATE_VALUE;
    }

    const hasEQ = tagChars.includes(EQ);

    return hasEQ ? TAG_STATE_ATTR : TAG_STATE_VALUE;
  }

  function stateTag() {
    const currChar = chars.getCurr();
    const isNextCharReserved = isCharReservedCode(chars.getNextCode());

    chars.skip(); // skip openTag

    // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
    const substr = chars.substrUntilChar(closeTag);

    const hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;
    const isLastChar = chars.isLast()
    // Only pay for the space scan when whitespace is actually restricted.
    const isSpaceRestricted = options.whitespaceInTags === false && substr.indexOf(SPACE) >= 0;

    if (isNextCharReserved || hasInvalidChars || isLastChar || isSpaceRestricted) {
      emitToken(TYPE_WORD, currChar);

      return STATE_WORD;
    }

    // [myTag   ]
    const isNoAttrsInTag = substr.indexOf(EQ) === -1;
    // [/myTag]
    const isClosingTag = substr[0] === SLASH;

    // [url] or [/url]
    if (isNoAttrsInTag || isClosingTag) {
      const startPos = chars.getPos() - 1;
      // `substr` already holds exactly the tag name (span up to closeTag);
      // consume it directly instead of re-scanning char by char.
      const name = substr;
      const endPos = startPos + name.length + END_POS_OFFSET;

      chars.advance(name.length);
      chars.skip(); // skip closeTag

      emitToken(TYPE_TAG, name, startPos, endPos);

      setupContextFreeTag(name, isClosingTag);

      return STATE_WORD;
    }

    return STATE_TAG_ATTRS;
  }

  function stateAttrs() {
    const startPos = chars.getPos();
    const silent = true;
    const tagStr = chars.grabWhileCode((code) => code !== closeTagCode, silent);
    const tagGrabber = createCharGrabber(tagStr, { onSkip });
    // Only the tag name (part before the first '=') is needed here; slice it out
    // instead of split()-ing the whole tag string into an array.
    const eqIdx = tagStr.indexOf(EQ);
    const tagName = eqIdx === -1 ? tagStr : tagStr.slice(0, eqIdx);
    const isEndTag = tagStr[0] === SLASH;
    const isSingleAttrTag = tagName.indexOf(SPACE) === -1;
    const isSingleValueTag = !isEndTag && isSingleAttrTag

    tagMode = TAG_STATE_NAME;

    while (tagGrabber.hasNext()) {
      tagMode = nextTagState(tagGrabber, isSingleValueTag, startPos);
    }

    chars.skip(); // skip closeTag

    return STATE_WORD;
  }

  function stateWord() {
    const currCode = chars.getCurrCode();

    if (currCode === CODE_N) {
      emitToken(TYPE_NEW_LINE, N);

      chars.skip();

      col = 0;
      prevCol = 0;
      row++;

      return STATE_WORD;
    }

    if (isWhiteSpaceCode(currCode)) {
      const word = chars.grabWhileCode(isWhiteSpaceCode);

      emitToken(TYPE_SPACE, word);

      return STATE_WORD;
    }

    if (currCode === openTagCode) {
      if (contextFreeTag) {
        const fullTagName = toEndTag(contextFreeTag);
        const foundTag = chars.grabN(fullTagName.length);
        const isContextFreeEnded = foundTag.toLowerCase() === fullTagName.toLowerCase();

        if (isContextFreeEnded) {
          return STATE_TAG;
        }
      } else if (chars.includes(closeTag)) {
        return STATE_TAG;
      }

      emitToken(TYPE_WORD, chars.getCurr());

      chars.skip();
      prevCol++;

      return STATE_WORD;
    }

    if (escapeTags) {
      if (currCode === CODE_BACKSLASH) {
        const currChar = chars.getCurr();
        const nextChar = chars.getNext();

        chars.skip(); // skip the \ without emitting anything

        if (nextChar && isEscapableCode(nextChar.charCodeAt(0))) {
          chars.skip(); // skip past the [, ] or \ as well

          emitToken(TYPE_WORD, nextChar);

          return STATE_WORD;
        }

        emitToken(TYPE_WORD, currChar);

        return STATE_WORD;
      }

      const isChar = (code: number) => isCharTokenCode(code) && code !== CODE_BACKSLASH;

      const word = chars.grabWhileCode(isChar);

      emitToken(TYPE_WORD, word);

      return STATE_WORD;
    }

    const word = chars.grabWhileCode(isCharTokenCode);

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

  let lowercaseBuffer: string | null = null;

  function isTokenNested(tokenValue: string) {
    // Key the cache by the raw tag name: building the `[/name]` form on every
    // call allocated a string per tag token, when only a cache miss needs it.
    const cached = nestedMap.get(tokenValue);

    if (cached !== undefined) {
      return cached;
    }

    const value = toEndTag(tokenValue);

    let status: boolean;

    if (caseFreeTags) {
      if (!lowercaseBuffer) lowercaseBuffer = buffer.toLowerCase();
      status = lowercaseBuffer.indexOf(value.toLowerCase()) > -1;
    } else {
      status = buffer.indexOf(value) > -1;
    }

    nestedMap.set(tokenValue, status);

    return status;
  }

  return {
    tokenize,
    isTokenNested,
  };
}

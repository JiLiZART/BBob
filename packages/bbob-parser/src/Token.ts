import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} from '@bbob/plugin-helper';
import type { Token as TokenInterface } from "@bbob/types";

// type, value, line, row, start pos, end pos

export const TYPE_ID = 't'; // 0;
export const VALUE_ID = 'v'; // 1;
export const LINE_ID = 'l'; // 3;
export const COLUMN_ID = 'r'; // 2;
export const START_POS_ID = 's'; // 4;
export const END_POS_ID = 'e'; // 5;
export const TYPE_WORD = 1; // 'word';
export const TYPE_TAG = 2; // 'tag';
export const TYPE_ATTR_NAME = 3; // 'attr-name';
export const TYPE_ATTR_VALUE = 4; // 'attr-value';
export const TYPE_SPACE = 5; // 'space';
export const TYPE_NEW_LINE = 6; // 'new-line';

const getTokenValue = (token: Token) => {
  if (token && typeof token[VALUE_ID] !== 'undefined') {
    return token[VALUE_ID];
  }

  return '';
};

const getTokenLine = (token: Token) => (token && token[LINE_ID]) || 0;

const getTokenColumn = (token: Token) => (token && token[COLUMN_ID]) || 0;

const getStartPosition = (token: Token) => (token && token[START_POS_ID]) || 0;

const getEndPosition = (token: Token) => (token && token[END_POS_ID]) || 0;

const isTextToken = (token: Token) => {
  if (token && typeof token[TYPE_ID] !== 'undefined') {
    return token[TYPE_ID] === TYPE_SPACE
      || token[TYPE_ID] === TYPE_NEW_LINE
      || token[TYPE_ID] === TYPE_WORD;
  }

  return false;
};

const isTagToken = (token: Token) => {
  if (token && typeof token[TYPE_ID] !== 'undefined') {
    return token[TYPE_ID] === TYPE_TAG;
  }

  return false;
};

const isTagEnd = (token: Token) => getTokenValue(token).charCodeAt(0) === SLASH.charCodeAt(0);

const isTagStart = (token: Token) => !isTagEnd(token);

const isAttrNameToken = (token: Token) => {
  if (token && typeof token[TYPE_ID] !== 'undefined') {
    return token[TYPE_ID] === TYPE_ATTR_NAME;
  }

  return false;
};

const isAttrValueToken = (token: Token) => {
  if (token && typeof token[TYPE_ID] !== 'undefined') {
    return token[TYPE_ID] === TYPE_ATTR_VALUE;
  }

  return false;
};

const getTagName = (token: Token) => {
  const value = getTokenValue(token);

  return isTagEnd(token) ? value.slice(1) : value;
};

const tokenToText = (token: Token, openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET) => {
  let text = openTag;

  text += getTokenValue(token);
  text += closeTag;

  return text;
};

/**
 * @export
 * @class Token
 */
class Token<TokenValue = string> implements TokenInterface {
  readonly t: number; // type
  readonly v: string; // value
  readonly l: number; // line
  readonly r: number; // row
  readonly s: number; // start pos
  readonly e: number; // end pos

  constructor(type?: number, value?: TokenValue, row: number = 0, col: number = 0, start: number = 0, end: number = 0) {
    this[LINE_ID] = row;
    this[COLUMN_ID] = col;
    this[TYPE_ID] = type || 0;
    this[VALUE_ID] = String(value);
    this[START_POS_ID] = start;
    this[END_POS_ID] = end;
  }

  get type() {
    return this[TYPE_ID];
  }

  isEmpty() {
    return this[TYPE_ID] === 0 || isNaN(this[TYPE_ID]);
  }

  isText() {
    return isTextToken(this);
  }

  isTag() {
    return isTagToken(this);
  }

  isAttrName() {
    return isAttrNameToken(this);
  }

  isAttrValue() {
    return isAttrValueToken(this);
  }

  isStart() {
    return isTagStart(this);
  }

  isEnd() {
    return isTagEnd(this);
  }

  getName() {
    return getTagName(this);
  }

  getValue() {
    return getTokenValue(this);
  }

  getLine() {
    return getTokenLine(this);
  }

  getColumn() {
    return getTokenColumn(this);
  }

  getStart() {
    return getStartPosition(this);
  }

  getEnd() {
    return getEndPosition(this);
  }

  toString({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    return tokenToText(this, openTag, closeTag);
  }
}

export { Token };
export default Token;

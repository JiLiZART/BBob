import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} from '@bbob/plugin-helper';
import type { Token as TokenInterface } from "@bbob/types";

// type, value, line, row, start pos, end pos

const TOKEN_TYPE_ID = 't'; // 0;
const TOKEN_VALUE_ID = 'v'; // 1;
const TOKEN_COLUMN_ID = 'r'; // 2;
const TOKEN_LINE_ID = 'l'; // 3;
const TOKEN_START_POS_ID = 's'; // 4;
const TOKEN_END_POS_ID = 'e'; // 5;

const TOKEN_TYPE_WORD = 1; // 'word';
const TOKEN_TYPE_TAG = 2; // 'tag';
const TOKEN_TYPE_ATTR_NAME = 3; // 'attr-name';
const TOKEN_TYPE_ATTR_VALUE = 4; // 'attr-value';
const TOKEN_TYPE_SPACE = 5; // 'space';
const TOKEN_TYPE_NEW_LINE = 6; // 'new-line';

const getTokenValue = (token: Token) => {
  if (token && typeof token[TOKEN_VALUE_ID] !== 'undefined') {
    return token[TOKEN_VALUE_ID];
  }

  return '';
};

const getTokenLine = (token: Token) => (token && token[TOKEN_LINE_ID]) || 0;

const getTokenColumn = (token: Token) => (token && token[TOKEN_COLUMN_ID]) || 0;

const getStartPosition = (token: Token) => (token && token[TOKEN_START_POS_ID]) || 0;

const getEndPosition = (token: Token) => (token && token[TOKEN_END_POS_ID]) || 0;

const isTextToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_SPACE
      || token[TOKEN_TYPE_ID] === TOKEN_TYPE_NEW_LINE
      || token[TOKEN_TYPE_ID] === TOKEN_TYPE_WORD;
  }

  return false;
};

const isTagToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
  }

  return false;
};

const isTagEnd = (token: Token) => getTokenValue(token).charCodeAt(0) === SLASH.charCodeAt(0);

const isTagStart = (token: Token) => !isTagEnd(token);

const isAttrNameToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
  }

  return false;
};

const isAttrValueToken = (token: Token) => {
  if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
    return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;
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
    this[TOKEN_LINE_ID] = row;
    this[TOKEN_COLUMN_ID] = col;
    this[TOKEN_TYPE_ID] = type || 0;
    this[TOKEN_VALUE_ID] = String(value);
    this[TOKEN_START_POS_ID] = start;
    this[TOKEN_END_POS_ID] = end;
  }

  get type() {
    return this[TOKEN_TYPE_ID];
  }

  isEmpty() {
    return this[TOKEN_TYPE_ID] === 0 || isNaN(this[TOKEN_TYPE_ID]);
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

export const TYPE_ID = TOKEN_TYPE_ID;
export const VALUE_ID = TOKEN_VALUE_ID;
export const LINE_ID = TOKEN_LINE_ID;
export const COLUMN_ID = TOKEN_COLUMN_ID;
export const START_POS_ID = TOKEN_START_POS_ID;
export const END_POS_ID = TOKEN_END_POS_ID;
export const TYPE_WORD = TOKEN_TYPE_WORD;
export const TYPE_TAG = TOKEN_TYPE_TAG;
export const TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
export const TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
export const TYPE_SPACE = TOKEN_TYPE_SPACE;
export const TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;

export { Token };
export default Token;

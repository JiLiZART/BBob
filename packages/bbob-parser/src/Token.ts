import {
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} from '@bbob/plugin-helper';

// type, value, line, row,

const TOKEN_TYPE_ID = 'type'; // 0;
const TOKEN_VALUE_ID = 'value'; // 1;
const TOKEN_COLUMN_ID = 'row'; // 2;
const TOKEN_LINE_ID = 'line'; // 3;

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

const convertTagToText = (token: Token) => {
  let text = OPEN_BRAKET;

  text += getTokenValue(token);
  text += CLOSE_BRAKET;

  return text;
};

/**
 * @export
 * @class Token
 */
class Token<TokenValue = string> {
  private type: number
  private value: string
  private line: number
  private row: number

  constructor(type?: number, value?: TokenValue, row: number = 0, col: number = 0) {
    this[TOKEN_LINE_ID] = row;
    this[TOKEN_COLUMN_ID] = col;
    this[TOKEN_TYPE_ID] = type || 0;
    this[TOKEN_VALUE_ID] = String(value);
  }

  isEmpty() {
    // eslint-disable-next-line no-restricted-globals
    return isNaN(this[TOKEN_TYPE_ID]);
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

  toString() {
    return convertTagToText(this);
  }
}

export const TYPE_ID = TOKEN_TYPE_ID;
export const VALUE_ID = TOKEN_VALUE_ID;
export const LINE_ID = TOKEN_LINE_ID;
export const COLUMN_ID = TOKEN_COLUMN_ID;
export const TYPE_WORD = TOKEN_TYPE_WORD;
export const TYPE_TAG = TOKEN_TYPE_TAG;
export const TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
export const TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
export const TYPE_SPACE = TOKEN_TYPE_SPACE;
export const TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;

export { Token };
export default Token;

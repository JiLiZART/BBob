const {
  getChar,
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} = require('./char');

// type, value, line, row,
const TOKEN_TYPE_ID = 'type'; // 0;
const TOKEN_VALUE_ID = 'value'; // 1;
const TOKEN_COLUMN_ID = 'row'; // 2;
const TOKEN_LINE_ID = 'line'; // 3;

const TOKEN_TYPE_WORD = 'word';
const TOKEN_TYPE_TAG = 'tag';
const TOKEN_TYPE_ATTR_NAME = 'attr-name';
const TOKEN_TYPE_ATTR_VALUE = 'attr-value';
const TOKEN_TYPE_SPACE = 'space';
const TOKEN_TYPE_NEW_LINE = 'new-line';

const getTokenValue = token => token[TOKEN_VALUE_ID];
const getTokenLine = token => token[TOKEN_LINE_ID];
const getTokenColumn = token => token[TOKEN_COLUMN_ID];

const isTextToken = (token) => {
  const type = token[TOKEN_TYPE_ID];

  return type === TOKEN_TYPE_SPACE || type === TOKEN_TYPE_NEW_LINE || type === TOKEN_TYPE_WORD;
};

const isTagToken = token => token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
const isTagEnd = token => getTokenValue(token).charCodeAt(0) === SLASH;
const isTagStart = token => !isTagEnd(token);
const isAttrNameToken = token => token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
const isAttrValueToken = token => token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;

const getTagName = (token) => {
  const value = getTokenValue(token);

  return isTagEnd(token) ? value.slice(1) : value;
};

const convertTagToText = (token) => {
  let text = getChar(OPEN_BRAKET);

  if (isTagEnd(token)) {
    text += getChar(SLASH);
  }

  text += getTokenValue(token);
  text += getChar(CLOSE_BRAKET);

  return text;
};

class Token {
  constructor(type, value, line, row) {
    this.type = String(type);
    this.value = String(value);
    this.line = Number(line);
    this.row = Number(row);
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

module.exports = Token;

module.exports.TYPE_ID = TOKEN_TYPE_ID;
module.exports.VALUE_ID = TOKEN_VALUE_ID;
module.exports.LINE_ID = TOKEN_LINE_ID;
module.exports.COLUMN_ID = TOKEN_COLUMN_ID;
module.exports.TYPE_WORD = TOKEN_TYPE_WORD;
module.exports.TYPE_TAG = TOKEN_TYPE_TAG;
module.exports.TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
module.exports.TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
module.exports.TYPE_SPACE = TOKEN_TYPE_SPACE;
module.exports.TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;

module.exports.convertTagToText = convertTagToText;
module.exports.getTagName = getTagName;
module.exports.getTokenColumn = getTokenColumn;
module.exports.getTokenLine = getTokenLine;
module.exports.getTokenValue = getTokenValue;
module.exports.isAttrNameToken = isAttrNameToken;
module.exports.isAttrValueToken = isAttrValueToken;
module.exports.isTagStart = isTagStart;
module.exports.isTagToken = isTagToken;
module.exports.isTextToken = isTextToken;
module.exports.isTagEnd = isTagEnd;

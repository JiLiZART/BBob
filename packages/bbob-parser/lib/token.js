const {
  getChar,
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
} = require('./char');

const TOKEN_TYPE_ID = 0;
const TOKEN_VALUE_ID = 1;
const TOKEN_COLUMN_ID = 2;
const TOKEN_LINE_ID = 3;

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


module.exports = {
  TYPE_ID: TOKEN_TYPE_ID,
  VALUE_ID: TOKEN_VALUE_ID,
  LINE_ID: TOKEN_LINE_ID,
  COLUMN_ID: TOKEN_COLUMN_ID,
  TYPE_WORD: TOKEN_TYPE_WORD,
  TYPE_TAG: TOKEN_TYPE_TAG,
  TYPE_ATTR_NAME: TOKEN_TYPE_ATTR_NAME,
  TYPE_ATTR_VALUE: TOKEN_TYPE_ATTR_VALUE,
  TYPE_SPACE: TOKEN_TYPE_SPACE,
  TYPE_NEW_LINE: TOKEN_TYPE_NEW_LINE,
  convertTagToText,
  getTagName,
  getTokenColumn,
  getTokenLine,
  getTokenValue,
  isAttrNameToken,
  isAttrValueToken,
  isTagStart,
  isTagToken,
  isTextToken,
  isTagEnd,
};

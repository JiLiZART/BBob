'use strict';

exports.__esModule = true;
exports.Token = exports.TYPE_NEW_LINE = exports.TYPE_SPACE = exports.TYPE_ATTR_VALUE = exports.TYPE_ATTR_NAME = exports.TYPE_TAG = exports.TYPE_WORD = exports.COLUMN_ID = exports.LINE_ID = exports.VALUE_ID = exports.TYPE_ID = undefined;

var _char = require('@bbob/plugin-helper/lib/char');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// type, value, line, row,
var TOKEN_TYPE_ID = 'type'; // 0;
var TOKEN_VALUE_ID = 'value'; // 1;
var TOKEN_COLUMN_ID = 'row'; // 2;
var TOKEN_LINE_ID = 'line'; // 3;

var TOKEN_TYPE_WORD = 'word';
var TOKEN_TYPE_TAG = 'tag';
var TOKEN_TYPE_ATTR_NAME = 'attr-name';
var TOKEN_TYPE_ATTR_VALUE = 'attr-value';
var TOKEN_TYPE_SPACE = 'space';
var TOKEN_TYPE_NEW_LINE = 'new-line';

var getTokenValue = function getTokenValue(token) {
  return token[TOKEN_VALUE_ID];
};
var getTokenLine = function getTokenLine(token) {
  return token[TOKEN_LINE_ID];
};
var getTokenColumn = function getTokenColumn(token) {
  return token[TOKEN_COLUMN_ID];
};

var isTextToken = function isTextToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_SPACE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_NEW_LINE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_WORD;
};

var isTagToken = function isTagToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
};
var isTagEnd = function isTagEnd(token) {
  return getTokenValue(token).charCodeAt(0) === _char.SLASH.charCodeAt(0);
};
var isTagStart = function isTagStart(token) {
  return !isTagEnd(token);
};
var isAttrNameToken = function isAttrNameToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
};
var isAttrValueToken = function isAttrValueToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;
};

var getTagName = function getTagName(token) {
  var value = getTokenValue(token);

  return isTagEnd(token) ? value.slice(1) : value;
};

var convertTagToText = function convertTagToText(token) {
  var text = _char.OPEN_BRAKET;

  if (isTagEnd(token)) {
    text += _char.SLASH;
  }

  text += getTokenValue(token);
  text += _char.CLOSE_BRAKET;

  return text;
};

var Token = function () {
  function Token(type, value, line, row) {
    _classCallCheck(this, Token);

    this.type = String(type);
    this.value = String(value);
    this.line = Number(line);
    this.row = Number(row);
  }

  Token.prototype.isEmpty = function isEmpty() {
    return !!this.type;
  };

  Token.prototype.isText = function isText() {
    return isTextToken(this);
  };

  Token.prototype.isTag = function isTag() {
    return isTagToken(this);
  };

  Token.prototype.isAttrName = function isAttrName() {
    return isAttrNameToken(this);
  };

  Token.prototype.isAttrValue = function isAttrValue() {
    return isAttrValueToken(this);
  };

  Token.prototype.isStart = function isStart() {
    return isTagStart(this);
  };

  Token.prototype.isEnd = function isEnd() {
    return isTagEnd(this);
  };

  Token.prototype.getName = function getName() {
    return getTagName(this);
  };

  Token.prototype.getValue = function getValue() {
    return getTokenValue(this);
  };

  Token.prototype.getLine = function getLine() {
    return getTokenLine(this);
  };

  Token.prototype.getColumn = function getColumn() {
    return getTokenColumn(this);
  };

  Token.prototype.toString = function toString() {
    return convertTagToText(this);
  };

  return Token;
}();

var TYPE_ID = exports.TYPE_ID = TOKEN_TYPE_ID;
var VALUE_ID = exports.VALUE_ID = TOKEN_VALUE_ID;
var LINE_ID = exports.LINE_ID = TOKEN_LINE_ID;
var COLUMN_ID = exports.COLUMN_ID = TOKEN_COLUMN_ID;
var TYPE_WORD = exports.TYPE_WORD = TOKEN_TYPE_WORD;
var TYPE_TAG = exports.TYPE_TAG = TOKEN_TYPE_TAG;
var TYPE_ATTR_NAME = exports.TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
var TYPE_ATTR_VALUE = exports.TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
var TYPE_SPACE = exports.TYPE_SPACE = TOKEN_TYPE_SPACE;
var TYPE_NEW_LINE = exports.TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;
exports.Token = Token;
exports.default = Token;
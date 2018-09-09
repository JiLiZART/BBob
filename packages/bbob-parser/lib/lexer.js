'use strict';

exports.__esModule = true;
exports.createLexer = exports.createTokenOfType = undefined;

var _char = require('@bbob/plugin-helper/lib/char');

var _Token = require('./Token');

/* eslint-disable no-plusplus,no-param-reassign */
var RESERVED_CHARS = [_char.CLOSE_BRAKET, _char.OPEN_BRAKET, _char.QUOTEMARK, _char.BACKSLASH, _char.SPACE, _char.TAB, _char.EQ, _char.N];
var NOT_CHAR_TOKENS = [_char.OPEN_BRAKET, _char.SPACE, _char.TAB, _char.N];
var WHITESPACES = [_char.SPACE, _char.TAB];

var isCharReserved = function isCharReserved(char) {
  return RESERVED_CHARS.indexOf(char) >= 0;
};
var isWhiteSpace = function isWhiteSpace(char) {
  return WHITESPACES.indexOf(char) >= 0;
};
var isCharToken = function isCharToken(char) {
  return NOT_CHAR_TOKENS.indexOf(char) === -1;
};

var createCharGrabber = function createCharGrabber(source) {
  var idx = 0;

  var skip = function skip() {
    idx += 1;
  };
  var hasNext = function hasNext() {
    return source.length > idx;
  };

  return {
    skip: skip,
    hasNext: hasNext,
    isLast: function isLast() {
      return idx === source.length;
    },
    grabWhile: function grabWhile(cond) {
      var start = idx;

      while (hasNext() && cond(source[idx])) {
        skip();
      }

      return source.substr(start, idx - start);
    },
    getNext: function getNext() {
      return source[idx + 1];
    },
    getPrev: function getPrev() {
      return source[idx - 1];
    },
    getCurr: function getCurr() {
      return source[idx];
    }
  };
};

var trimChar = function trimChar(str, charToRemove) {
  while (str.charAt(0) === charToRemove) {
    str = str.substring(1);
  }

  while (str.charAt(str.length - 1) === charToRemove) {
    str = str.substring(0, str.length - 1);
  }

  return str;
};

var unquote = function unquote(str) {
  return str.replace(_char.BACKSLASH + _char.QUOTEMARK, _char.QUOTEMARK);
};
var createToken = function createToken(type, value) {
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var cl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return new _Token.Token(type, value, r, cl);
};

function createLexer(buffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var row = 0;
  var col = 0;

  var tokenIndex = -1;
  var tokens = new Array(Math.floor(buffer.length));
  var emitToken = function emitToken(token) {
    if (options.onToken) {
      options.onToken(token);
    }

    tokenIndex += 1;
    tokens[tokenIndex] = token;
  };

  var parseAttrs = function parseAttrs(str) {
    var tagName = null;
    var skipSpaces = false;

    var attrTokens = [];
    var attrCharGrabber = createCharGrabber(str);
    var validAttr = function validAttr(val) {
      var isEQ = val === _char.EQ;
      var isWS = isWhiteSpace(val);
      var isPrevSLASH = attrCharGrabber.getPrev() === _char.SLASH;

      if (tagName === null) {
        return !(isEQ || isWS || attrCharGrabber.isLast());
      }

      if (skipSpaces && isWS) {
        return true;
      }

      if (val === _char.QUOTEMARK && !isPrevSLASH) {
        skipSpaces = !skipSpaces;
      }

      return !(isEQ || isWS);
    };

    var nextAttr = function nextAttr() {
      var attrStr = attrCharGrabber.grabWhile(validAttr);

      // first string before space is a tag name
      if (tagName === null) {
        tagName = attrStr;
      } else if (isWhiteSpace(attrCharGrabber.getCurr()) || !attrCharGrabber.hasNext()) {
        var escaped = unquote(trimChar(attrStr, _char.QUOTEMARK));
        attrTokens.push(createToken(_Token.TYPE_ATTR_VALUE, escaped, row, col));
      } else {
        attrTokens.push(createToken(_Token.TYPE_ATTR_NAME, attrStr, row, col));
      }

      attrCharGrabber.skip();
    };

    while (attrCharGrabber.hasNext()) {
      nextAttr();
    }

    return { tag: tagName, attrs: attrTokens };
  };

  var grabber = createCharGrabber(buffer);

  var next = function next() {
    var char = grabber.getCurr();

    if (char === _char.N) {
      grabber.skip();
      col = 0;
      row++;

      emitToken(createToken(_Token.TYPE_NEW_LINE, char, row, col));
    } else if (isWhiteSpace(char)) {
      var str = grabber.grabWhile(isWhiteSpace);
      emitToken(createToken(_Token.TYPE_SPACE, str, row, col));
    } else if (char === _char.OPEN_BRAKET) {
      var nextChar = grabber.getNext();
      grabber.skip(); // skip [

      if (isCharReserved(nextChar)) {
        emitToken(createToken(_Token.TYPE_WORD, char, row, col));
      } else {
        var _str = grabber.grabWhile(function (val) {
          return val !== _char.CLOSE_BRAKET;
        });
        grabber.skip(); // skip ]

        if (!(_str.indexOf(_char.EQ) > 0) || _str[0] === _char.SLASH) {
          emitToken(createToken(_Token.TYPE_TAG, _str, row, col));
        } else {
          var parsed = parseAttrs(_str);

          emitToken(createToken(_Token.TYPE_TAG, parsed.tag, row, col));
          parsed.attrs.map(emitToken);
        }
      }
    } else if (char === _char.CLOSE_BRAKET) {
      grabber.skip();

      emitToken(createToken(_Token.TYPE_WORD, char, row, col));
    } else if (isCharToken(char)) {
      var _str2 = grabber.grabWhile(isCharToken);

      emitToken(createToken(_Token.TYPE_WORD, _str2, row, col));
    }
  };

  var tokenize = function tokenize() {
    while (grabber.hasNext()) {
      next();
    }

    tokens.length = tokenIndex + 1;

    return tokens;
  };

  var isTokenNested = function isTokenNested(token) {
    var value = _char.OPEN_BRAKET + _char.SLASH + token.getValue();
    return buffer.indexOf(value) > -1;
  };

  return {
    tokenize: tokenize,
    isTokenNested: isTokenNested
  };
}

var createTokenOfType = exports.createTokenOfType = createToken;
exports.createLexer = createLexer;
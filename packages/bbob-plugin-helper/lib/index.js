'use strict';

exports.__esModule = true;
exports.isEOL = exports.isStringNode = exports.isTagNode = exports.getNodeLength = exports.appendToNode = exports.attrValue = undefined;

var _char = require('./char');

var isTagNode = function isTagNode(el) {
  return typeof el === 'object' && !!el.tag;
};
var isStringNode = function isStringNode(el) {
  return typeof el === 'string';
};
var isEOL = function isEOL(el) {
  return el === _char.N;
};

var getNodeLength = function getNodeLength(node) {
  if (isTagNode(node)) {
    return node.content.reduce(function (count, contentNode) {
      return count + getNodeLength(contentNode);
    }, 0);
  } else if (isStringNode(node)) {
    return node.length;
  }

  return 0;
};

var appendToNode = function appendToNode(node, value) {
  node.content.push(value);
};

var escapeQuote = function escapeQuote(value) {
  return value.replace(/"/g, '&quot;');
};

var attrValue = function attrValue(name, value) {
  var type = typeof value;

  var types = {
    boolean: function boolean() {
      return value ? '' + name : '';
    },
    number: function number() {
      return name + '="' + value + '"';
    },
    string: function string() {
      return name + '="' + escapeQuote(value) + '"';
    },
    object: function object() {
      return name + '="' + escapeQuote(JSON.stringify(value)) + '"';
    }
  };

  return types[type] ? types[type]() : '';
};

exports.attrValue = attrValue;
exports.appendToNode = appendToNode;
exports.getNodeLength = getNodeLength;
exports.isTagNode = isTagNode;
exports.isStringNode = isStringNode;
exports.isEOL = isEOL;
'use strict';

exports.__esModule = true;

var _require = require('@bbob/plugin-helper'),
    attrValue = _require.attrValue;

/**
 * Transforms attrs to html params string
 * @param values
 */


var attrs = function attrs(values) {
  return Object.keys(values).reduce(function (arr, key) {
    return [].concat(arr, [attrValue(key, values[key])]);
  }, ['']).join(' ');
};

var renderNode = function renderNode(node, _ref) {
  var _ref$stripTags = _ref.stripTags,
      stripTags = _ref$stripTags === undefined ? false : _ref$stripTags;

  if (!node) return '';
  var type = typeof node;

  if (type === 'string' || type === 'number') {
    return node;
  }

  if (type === 'object') {
    if (stripTags === true) {
      // eslint-disable-next-line no-use-before-define
      return renderNodes(node.content, { stripTags: stripTags });
    }

    if (node.content === null) {
      return '<' + node.tag + attrs(node.attrs) + ' />';
    }

    // eslint-disable-next-line no-use-before-define
    return '<' + node.tag + attrs(node.attrs) + '>' + renderNodes(node.content) + '</' + node.tag + '>';
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-use-before-define
    return renderNodes(node, { stripTags: stripTags });
  }

  return '';
};

var renderNodes = function renderNodes(nodes) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$stripTags = _ref2.stripTags,
      stripTags = _ref2$stripTags === undefined ? false : _ref2$stripTags;

  return [].concat(nodes).reduce(function (r, node) {
    return r + renderNode(node, { stripTags: stripTags });
  }, '');
};

var render = exports.render = renderNodes;
exports.default = renderNodes;
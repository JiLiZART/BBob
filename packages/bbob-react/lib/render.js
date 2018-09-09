'use strict';

exports.__esModule = true;
exports.render = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _core = require('@bbob/core');

var _core2 = _interopRequireDefault(_core);

var _pluginHelper = require('@bbob/plugin-helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toAST = function toAST(source, plugins) {
  return (0, _core2.default)(plugins).process(source).tree;
};

function tagToReactElement(node) {
  if (node.content === null) {
    return _react2.default.createElement(node.tag, node.attrs, null);
  }

  return _react2.default.createElement(node.tag, node.attrs,
  // eslint-disable-next-line no-use-before-define
  renderNodes(node.content));
}

function renderNodes(nodes) {
  var els = nodes.reduce(function (arr, node) {
    if ((0, _pluginHelper.isTagNode)(node)) {
      arr.push(tagToReactElement(node));
    } else if ((0, _pluginHelper.isStringNode)(node)) {
      arr.push(node);
    }

    return arr;
  }, []);

  return els;
}

function render(source, plugins) {
  return renderNodes(toAST(source, plugins));
}

exports.render = render;
exports.default = render;
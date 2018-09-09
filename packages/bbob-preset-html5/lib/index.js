'use strict';

exports.__esModule = true;

var _pluginHelper = require('@bbob/plugin-helper');

var _defaultTags = require('./defaultTags');

var _defaultTags2 = _interopRequireDefault(_defaultTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable indent */
function process(tags, tree, core) {
  tree.walk(function (node) {
    return (0, _pluginHelper.isTagNode)(node) && tags[node.tag] ? tags[node.tag](node, core) : node;
  });
}

function html5Preset() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var tags = Object.assign({}, _defaultTags2.default, opts.tags || {});

  return function (tree, core) {
    return process(tags, tree, core);
  };
}

function extend(callback) {
  var tags = callback(_defaultTags2.default);

  return function () {
    return function (tree, core) {
      return process(tags, tree, core);
    };
  };
}

html5Preset.extend = extend;

exports.default = html5Preset;
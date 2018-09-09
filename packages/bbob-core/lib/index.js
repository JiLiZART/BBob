'use strict';

exports.__esModule = true;
exports.default = bbob;

var _parser = require('@bbob/parser');

var _utils = require('./utils');

function walk(cb) {
  return (0, _utils.iterate)(this, cb);
}

function bbob(plugs) {
  var plugins = typeof plugs === 'function' ? [plugs] : plugs || [];

  var options = {
    skipParse: false
  };

  return {
    process: function process(input, opts) {
      options = opts || {};

      var parseFn = options.parser || _parser.parse;
      var renderFn = options.render;

      var tree = options.skipParse ? input || [] : parseFn(input, options);

      tree.walk = walk;
      tree.match = _utils.match;

      plugins.forEach(function (plugin) {
        tree = plugin(tree, {
          parse: parseFn,
          render: renderFn,
          iterate: _utils.iterate,
          match: _utils.match
        }) || tree;
      });

      return {
        get html() {
          if (typeof renderFn !== 'function') {
            throw new Error('"render" function not defined, please pass to "process(input, { render })"');
          }
          return renderFn(tree, tree.options);
        },
        tree: tree,
        messages: tree.messages
      };
    }
  };
}
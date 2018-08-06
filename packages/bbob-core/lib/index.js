const parser = require('@bbob/parser');
const render = require('@bbob/html');

const { iterate, match } = require('./utils');

function walk(cb) {
  return iterate(this, cb);
}

module.exports = function bbob(plugs) {
  const plugins = typeof plugs === 'function' ? [plugs] : plugs || [];

  let options = {
    skipParse: false,
  };

  return {
    process(input, opts) {
      options = opts || {};

      const parseFn = options.parser || parser;
      const renderFn = options.render || render;

      let tree = options.skipParse
        ? input || []
        : parseFn(input, options);

      tree.walk = walk;
      tree.match = match;

      plugins.forEach((plugin) => {
        tree = plugin(tree, {
          parse: parseFn,
          render: renderFn,
          iterate,
          match,
        }) || tree;
      });

      return {
        get html() {
          return renderFn(tree, tree.options);
        },
        tree,
        messages: tree.messages,
      };
    },
  };
};

import { parse } from '@bbob/parser';
import { iterate, match } from './utils';

function walk(cb) {
  return iterate(this, cb);
}

export default function bbob(plugs) {
  const plugins = typeof plugs === 'function' ? [plugs] : plugs || [];

  let options = {
    skipParse: false,
  };

  return {
    process(input, opts) {
      options = opts || {};

      const parseFn = options.parser || parse;
      const renderFn = options.render;

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
          if (typeof renderFn !== 'function') {
            throw new Error('"render" function not defined, please pass to "process(input, { render })"');
          }
          return renderFn(tree, tree.options);
        },
        tree,
        messages: tree.messages,
      };
    },
  };
}

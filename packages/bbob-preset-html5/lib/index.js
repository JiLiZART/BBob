const { isTagNode } = require('@bbob/plugin-helper');
const defaultProcessors = require('./default');

module.exports = function html5Preset(opts = {}) {
  const processors = Object.assign({}, defaultProcessors, opts.processors || {});

  return function process(tree, core) {
    tree.walk(node => (isTagNode(node) && processors[node.tag]
      ? processors[node.tag](node, core)
      : node));
  };
};

/* eslint-disable indent */
const { isTagNode } = require('@bbob/plugin-helper');
const defaultTags = require('./default');

function process(tags, tree, core) {
  tree.walk(node => (isTagNode(node) && tags[node.tag]
      ? tags[node.tag](node, core)
      : node));
}

function html5Preset(opts = {}) {
  const tags = Object.assign({}, defaultTags, opts.tags || {});

  return (tree, core) => process(tags, tree, core);
}

function extend(callback) {
  const tags = callback(defaultTags);

  return () => (tree, core) => process(tags, tree, core);
}

module.exports = html5Preset;
module.exports.extend = extend;

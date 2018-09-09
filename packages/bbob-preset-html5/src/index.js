/* eslint-disable indent */
import { isTagNode } from '@bbob/plugin-helper';
import defaultTags from './defaultTags';

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

html5Preset.extend = extend;

export default html5Preset;

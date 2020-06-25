/* eslint-disable indent */
import { isTagNode } from '@bbob/plugin-helper';

function process(tags, tree, core, options) {
  tree.walk((node) => (isTagNode(node) && tags[node.tag]
      ? tags[node.tag](node, core, options)
      : node));
}

/**
 * @param defTags
 * @return {function(*=, *=)}
 */
function createPreset(defTags) {
  const instance = (opts = {}) => {
    instance.options = Object.assign(instance.options || {}, opts);
    return (tree, core) => process(defTags, tree, core, instance.options);
  };

  instance.extend = (callback) => createPreset(callback(defTags, instance.options));

  return instance;
}

export { createPreset };
export default createPreset;

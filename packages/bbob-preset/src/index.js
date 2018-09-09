/* eslint-disable indent */
import { isTagNode } from '@bbob/plugin-helper';

function process(tags, tree, ...rest) {
  tree.walk(node => (isTagNode(node) && tags[node.tag]
      ? tags[node.tag](node, ...rest)
      : node));
}

/**
 * @param tags
 * @return {function(*=, *=)}
 */
function createPreset(tags) {
  const instance = (tree, ...rest) => process(tags, tree, ...rest);

  instance.extend = (callback) => {
    const newTags = callback(tags);

    return () => createPreset(newTags);
  };

  return instance;
}

export { createPreset };
export default createPreset;

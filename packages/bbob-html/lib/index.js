const { attrValue } = require('@bbob/plugin-helper');

/**
 * Transforms attrs to html params string
 * @param values
 */
const attrs = values =>
  Object.keys(values)
    .reduce((arr, key) => [...arr, attrValue(key, values[key])], [''])
    .join(' ');

const renderNode = (node, { stripTags = false }) => {
  if (!node) return '';
  const type = typeof node;

  if (type === 'string' || type === 'number') {
    return node;
  }

  if (type === 'object') {
    if (stripTags === true) {
      // eslint-disable-next-line no-use-before-define
      return renderNodes(node.content);
    }

    if (node.content === null) {
      return `<${node.tag}${attrs(node.attrs)} />`;
    }

    // eslint-disable-next-line no-use-before-define
    return `<${node.tag}${attrs(node.attrs)}>${renderNodes(node.content)}</${node.tag}>`;
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-use-before-define
    return renderNodes(node);
  }

  return '';
};

const renderNodes = (nodes, { stripTags = false } = {}) => []
  .concat(nodes)
  .reduce((r, node) => r + renderNode(node, { stripTags }), '');

module.exports = renderNodes;

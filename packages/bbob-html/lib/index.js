function escapeQuote(value) {
  return value.replace(/"/g, '&quot;');
}

function attrValue(name, value) {
  if (typeof value === 'boolean' && value) {
    return `${name}`;
  } else if (typeof value === 'number') {
    return `${name}="${value}"`;
  } else if (typeof value === 'string') {
    return `${name}="${escapeQuote(value)}"`;
  } else if (typeof value === 'object') {
    return `${name}="${escapeQuote(JSON.stringify(value))}"`;
  }
  return '';
}

/**
 * Transforms attrs to html params string
 * @param values
 */
const attrs = values =>
  Object.keys(values)
    .reduce((arr, key) => [...arr, attrValue(key, values[key])], [''])
    .join(' ');

const renderNode = (node) => {
  if (!node) return '';

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  if (typeof node === 'object') {
    // eslint-disable-next-line no-use-before-define
    return `<${node.tag}${attrs(node.attrs)}>${renderNodes(node.content)}</${node.tag}>`;
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-use-before-define
    return renderNodes(node);
  }

  return '';
};

const renderNodes = nodes => [].concat(nodes).reduce((r, node) => r + renderNode(node), '');

module.exports = renderNodes;

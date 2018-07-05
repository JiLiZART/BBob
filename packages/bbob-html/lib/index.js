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

function traverse(tree, cb) {
  if (Array.isArray(tree)) {
    tree.forEach((_, i) => {
      traverse(cb(tree[i]), cb);
    });
  } else if (typeof tree === 'object' && tree.content) {
    traverse(tree.content, cb);
  }

  return tree;
}

function renderNodes(nodes) {
  return [].concat(nodes).reduce((r, node) => r + renderNode(node), '');
}

function renderNode(node) {
  if (!node) return;

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  if (typeof node === 'object') {
    return `<${node.tag}${attrs(node.attrs)}>${renderNodes(node.content)}</${node.tag}>`;
  }

  if (Array.isArray(node)) {
    return renderNodes(node);
  }

  return '';
}

module.exports = renderNodes;

function attrs(obj) {
  let attr = '';

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'boolean' && obj[key]) {
      attr += ` ${key}`;
    } else if (typeof obj[key] === 'number') {
      attr += ` ${key}="${obj[key]}"`;
    } else if (typeof obj[key] === 'string') {
      attr += ` ${key}="${obj[key].replace(/"/g, '&quot;')}"`;
    }
  });

  return attr;
}

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

function render(ast) {
  function html(tree) {
    let result = '';

    traverse([].concat(tree), (node) => {
      if (!node) return;

      if (typeof node === 'string' || typeof node === 'number') {
        result += node;

        return;
      }

      if (typeof node === 'object') {
        result += `<${node.tag} ${attrs(node.attrs)}></${node.tag}>`;
      }

      // treat as new root tree if node is an array
      if (Array.isArray(node)) {
        result += html(node);
      }
    });

    return result;
  }

  return html(ast);
}

module.exports = render;

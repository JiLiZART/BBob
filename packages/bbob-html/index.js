function render(tree, options) {

}

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
    let i = 0,
      length = tree.length;
    for (; i < length; i++) {
      traverse(cb(tree[i]), cb);
    }
  } else if (typeof tree === 'object' && tree.hasOwnProperty('content')) {
    traverse(tree.content, cb);
  }

  return tree;
}

module.exports = render;

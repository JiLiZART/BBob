/* eslint-disable no-plusplus */
/**
 * @param {Boolean} value
 * @returns {boolean}
 */
const isObj = (value) => (typeof value === 'object');
/**
 * @param {Boolean} value
 * @returns {boolean}
 */
const isBool = (value) => (typeof value === 'boolean');

/**
 * @param t
 * @param cb
 * @returns {*}
 */
export function iterate(t, cb) {
  const tree = t;

  if (Array.isArray(tree)) {
    for (let idx = 0; idx < tree.length; idx++) {
      tree[idx] = iterate(cb(tree[idx]), cb);
    }
  } else if (tree && isObj(tree) && tree.content) {
    iterate(tree.content, cb);
  }

  return tree;
}

/**
 * @param expected
 * @param actual
 * @returns {Boolean}
 */
export function same(expected, actual) {
  if (typeof expected !== typeof actual) {
    return false;
  }

  if (!isObj(expected) || expected === null) {
    return expected === actual;
  }

  if (Array.isArray(expected)) {
    return expected.every((exp) => [].some.call(actual, (act) => same(exp, act)));
  }

  return Object.keys(expected).every((key) => {
    const ao = actual[key];
    const eo = expected[key];

    if (isObj(eo) && eo !== null && ao !== null) {
      return same(eo, ao);
    }

    if (isBool(eo)) {
      return eo !== (ao === null);
    }

    return ao === eo;
  });
}

export function match(expression, cb) {
  return Array.isArray(expression)
    ? iterate(this, (node) => {
      for (let idx = 0; idx < expression.length; idx++) {
        if (same(expression[idx], node)) {
          return cb(node);
        }
      }

      return node;
    })
    : iterate(this, (node) => (same(expression, node) ? cb(node) : node));
}

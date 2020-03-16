import { N } from './char';

const isTagNode = (el) => typeof el === 'object' && !!el.tag;
const isStringNode = (el) => typeof el === 'string';
const isEOL = (el) => el === N;

const getNodeLength = (node) => {
  if (isTagNode(node)) {
    return node.content.reduce((count, contentNode) => count + getNodeLength(contentNode), 0);
  } if (isStringNode(node)) {
    return node.length;
  }

  return 0;
};

/**
 * Appends value to Tag Node
 * @param {TagNode} node
 * @param value
 */
const appendToNode = (node, value) => {
  node.content.push(value);
};

/**
 * Replaces " to &qquot;
 * @param {String} value
 */
const escapeQuote = (value) => value.replace(/"/g, '&quot;');

/**
 * Acept name and value and return valid html5 attribute string
 * @param {String} name
 * @param {String} value
 * @return {string}
 */
const attrValue = (name, value) => {
  const type = typeof value;

  const types = {
    boolean: () => (value ? `${name}` : ''),
    number: () => `${name}="${value}"`,
    string: () => `${name}="${escapeQuote(value)}"`,
    object: () => `${name}="${escapeQuote(JSON.stringify(value))}"`,
  };

  return types[type] ? types[type]() : '';
};

/**
 * Transforms attrs to html params string
 * @param values
 */
const attrsToString = (values) => {
  // To avoid some malformed attributes
  if (typeof values === 'undefined') {
    return '';
  }

  return Object.keys(values)
    .reduce((arr, key) => [...arr, attrValue(key, values[key])], [''])
    .join(' ');
};

export {
  attrsToString,
  attrValue,
  appendToNode,
  getNodeLength,
  isTagNode,
  isStringNode,
  isEOL,
};

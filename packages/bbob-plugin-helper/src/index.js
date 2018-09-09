import { N } from './char';

const isTagNode = el => typeof el === 'object' && !!el.tag;
const isStringNode = el => typeof el === 'string';
const isEOL = el => el === N;

const getNodeLength = (node) => {
  if (isTagNode(node)) {
    return node.content.reduce((count, contentNode) => count + getNodeLength(contentNode), 0);
  } else if (isStringNode(node)) {
    return node.length;
  }

  return 0;
};

const appendToNode = (node, value) => {
  node.content.push(value);
};

const escapeQuote = value => value.replace(/"/g, '&quot;');

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

export {
  attrValue,
  appendToNode,
  getNodeLength,
  isTagNode,
  isStringNode,
  isEOL,
};

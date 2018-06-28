const {
  getChar, N, CLOSE_BRAKET, OPEN_BRAKET, SLASH,
} = require('./char');

const EOL = getChar(N);
const isNode = el => typeof el === 'object' && el.tag;
const isStringNode = el => typeof el === 'string';
const isEOL = el => el === EOL;

const getNodeLength = (node) => {
  if (isNode(node)) {
    return node.content.reduce((count, contentNode) => count + getNodeLength(contentNode), 0);
  } else if (isStringNode(node)) {
    return node.length;
  }

  return 0;
};

const appendToNode = (node, value) => {
  node.content.push(value);
};

class TagNode {
  constructor(tag, attrs, content) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
  }

  attr(name, value) {
    if (typeof value !== 'undefined') {
      this.attrs[name] = value;
    }

    return this.attrs[name];
  }

  append(value) {
    return appendToNode(this, value);
  }

  get length() {
    return getNodeLength(this);
  }

  toString() {
    const OB = getChar(OPEN_BRAKET);
    const CB = getChar(CLOSE_BRAKET);

    return OB + this.tag + CB + this.content.reduce((r, node) => r + node.toString(), '') + OB + getChar(SLASH) + this.tag + CB;
  }
}

module.exports = TagNode;
module.exports.isNode = isNode;
module.exports.isStringNode = isStringNode;
module.exports.isEOL = isEOL;
module.exports.appendToNode = appendToNode;

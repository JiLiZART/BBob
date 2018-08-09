const {
  getChar, OPEN_BRAKET, CLOSE_BRAKET, SLASH,
} = require('./char');
const { getNodeLength, appendToNode } = require('./index');

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
    const SL = getChar(SLASH);

    return OB + this.tag + CB + this.content.reduce((r, node) => r + node.toString(), '') + OB + SL + this.tag + CB;
  }
}

module.exports = TagNode;
module.exports.create = (tag, attrs = {}, content = []) => new TagNode(tag, attrs, content);
module.exports.isOf = (node, type) => (node.tag === type);

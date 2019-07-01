import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import { getNodeLength, appendToNode } from './index';

class TagNode {
  constructor(tag, attrs, content) {
    this.tag = tag.toLowerCase();
    this.attrs = attrs;
    this.content = [].concat(content);
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
    const OB = OPEN_BRAKET;
    const CB = CLOSE_BRAKET;

    return OB + this.tag + CB + this.content.reduce((r, node) => r + node.toString(), '') + OB + SLASH + this.tag + CB;
  }
}

TagNode.create = (tag, attrs = {}, content = []) => new TagNode(tag, attrs, content);
TagNode.isOf = (node, type) => (node.tag === type);

export { TagNode };
export default TagNode;

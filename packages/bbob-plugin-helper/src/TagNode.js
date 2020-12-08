import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
  getNodeLength, appendToNode, attrsToString, attrValue, getUniqAttr,
} from './index';

const getTagAttrs = (tag, params) => {
  const uniqAattr = getUniqAttr(params);

  if (uniqAattr) {
    const tagAttr = attrValue(tag, uniqAattr);
    const attrs = { ...params };

    delete attrs[uniqAattr];

    const attrsStr = attrsToString(attrs);

    return `${tagAttr}${attrsStr}`;
  }

  return `${tag}${attrsToString(params)}`;
};

class TagNode {
  constructor(tag, attrs, content) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = Array.isArray(content) ? content : [content];
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

  toTagNode() {
    return new TagNode(this.tag.toLowerCase(), this.attrs, this.content);
  }

  toString() {
    const OB = OPEN_BRAKET;
    const CB = CLOSE_BRAKET;
    const isEmpty = this.content.length === 0;
    const content = this.content.reduce((r, node) => r + node.toString(), '');
    const tagAttrs = getTagAttrs(this.tag, this.attrs);

    if (isEmpty) {
      return `${OB}${tagAttrs}${CB}`;
    }

    return `${OB}${tagAttrs}${CB}${content}${OB}${SLASH}${this.tag}${CB}`;
  }
}

TagNode.create = (tag, attrs = {}, content = []) => new TagNode(tag, attrs, content);
TagNode.isOf = (node, type) => (node.tag === type);

export { TagNode };
export default TagNode;

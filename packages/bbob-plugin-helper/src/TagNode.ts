import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
  getNodeLength, appendToNode, attrsToString, attrValue, getUniqAttr,
} from './helpers';

export type TagAttrs = Record<string, string | boolean | number>

export type TagContent = TagNode | string | Array<TagNode | string>

const getTagAttrs = (tag: string, params: TagAttrs) => {
  const uniqAattr = getUniqAttr(params);

  if (uniqAattr) {
    const tagAttr = attrValue(tag, uniqAattr);
    const attrs = { ...params };

    delete attrs[String(uniqAattr)];

    const attrsStr = attrsToString(attrs);

    return `${tagAttr}${attrsStr}`;
  }

  return `${tag}${attrsToString(params)}`;
};

/**
 * @export
 * @class TagNode
 */
class TagNode {
  public readonly tag: string
  private readonly attrs: TagAttrs
  public content: Array<TagNode | string>

  constructor(tag: string, attrs: TagAttrs, content: TagContent = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = Array.isArray(content) ? content : [content];
  }

  attr(name: string, value?: string) {
    if (typeof value !== 'undefined') {
      this.attrs[name] = value;
    }

    return this.attrs[name];
  }

  append(value: string) {
    return appendToNode(this, value);
  }

  get length() {
    return getNodeLength(this);
  }

  toTagStart({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    const tagAttrs = getTagAttrs(this.tag, this.attrs);

    return `${openTag}${tagAttrs}${closeTag}`;
  }

  toTagEnd({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    return `${openTag}${SLASH}${this.tag}${closeTag}`;
  }

  toTagNode() {
    return new TagNode(this.tag.toLowerCase(), this.attrs, this.content);
  }

  toString({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}): string {
    const isEmpty = this.content.length === 0;
    const content = this.content.reduce((r, node) => r + node.toString({ openTag, closeTag }), '');
    const tagStart = this.toTagStart({ openTag, closeTag });

    if (isEmpty) {
      return tagStart;
    }

    return `${tagStart}${content}${this.toTagEnd({ openTag, closeTag })}`;
  }

  static create(tag: string, attrs: TagAttrs = {}, content: TagContent = []) {
    return  new TagNode(tag, attrs, content)
  }

  static isOf(node: TagNode, type: string) {
    return (node.tag === type)
  }
}

export { TagNode };

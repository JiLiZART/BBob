import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
    getUniqAttr,
    getNodeLength,
    appendToNode,
    attrsToString,
    attrValue,
} from './helpers';

export type StringNode = string

export type NodeContent<TagName = string, AttrValue = unknown> = TagNode<TagName, AttrValue> | StringNode

export type TagNodeTree<TagName = string, AttrValue = unknown> = NodeContent<TagName, AttrValue> | Array<NodeContent<TagName, AttrValue>>

const getTagAttrs = <AttrValue>(tag: string, params: Record<string, AttrValue>) => {
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

class TagNode<TagName = string, AttrValue = unknown> {
  public readonly tag: string
  public readonly attrs: Record<string, AttrValue>
  public content: NodeContent<TagName, AttrValue>[]

  constructor(tag: string, attrs: Record<string, AttrValue>, content: TagNodeTree<TagName, AttrValue> = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = Array.isArray(content) ? content : [content];
  }

  attr(name: string, value?: AttrValue) {
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

  static create<TagName = string, AttrValue = unknown>(tag: string, attrs: Record<string, AttrValue> = {}, content: TagNodeTree<TagName, AttrValue> = []) {
    return new TagNode(tag, attrs, content)
  }

  static isOf<TagName = string, AttrValue = unknown>(node: TagNode<TagName, AttrValue>, type: string) {
    return (node.tag === type)
  }
}

export { TagNode };

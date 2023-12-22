import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
    getUniqAttr,
    getNodeLength,
    appendToNode,
    attrsToString,
    attrValue,
} from './helpers';

export type StringNode = string

export type NodeContent = TagNode | StringNode

export type TagNodeTree = NodeContent | Array<NodeContent>

const getTagAttrs = <AttrValue>(tag: string, params: Record<string, AttrValue>) => {
  const uniqAttr = getUniqAttr(params);

  if (uniqAttr) {
    const tagAttr = attrValue(tag, uniqAttr);
    const attrs = { ...params };

    delete attrs[String(uniqAttr)];

    const attrsStr = attrsToString(attrs);

    return `${tagAttr}${attrsStr}`;
  }

  return `${tag}${attrsToString(params)}`;
};

class TagNode {
  public readonly tag: string
  public readonly attrs: Record<string, unknown>
  public content: NodeContent[]

  constructor(tag: string, attrs: Record<string, unknown>, content: TagNodeTree = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = Array.isArray(content) ? content : [content];
  }

  attr(name: string, value?: unknown) {
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

  static create(tag: string, attrs: Record<string, unknown> = {}, content: TagNodeTree = []) {
    return new TagNode(tag, attrs, content)
  }

  static isOf(node: TagNode, type: string) {
    return (node.tag === type)
  }
}

export { TagNode };

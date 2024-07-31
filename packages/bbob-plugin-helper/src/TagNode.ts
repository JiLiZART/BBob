import type { NodeContent, TagNodeObject, TagNodeTree, TagPosition } from "@bbob/types";

import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from './char';
import {
  getUniqAttr,
  getNodeLength,
  appendToNode,
  attrsToString,
  attrValue,
  isTagNode,
} from './helpers';

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

const renderContent = (content: TagNodeTree, openTag: string, closeTag: string) => {
  const toString = (node: NodeContent) => {
    if (isTagNode(node)) {
      return node.toString({ openTag, closeTag });
    }

    return String(node);
  };

  if (Array.isArray(content)) {
    return content.reduce<string>((r, node) => {
      if (node !== null) {
        return r + toString(node);
      }

      return r;
    }, '');
  }

  if (content) {
    return toString(content);
  }

  return null;
};

export class TagNode<TagValue extends any = any> implements TagNodeObject {
  public readonly tag: string | TagValue;
  public attrs: Record<string, unknown>;
  public content: TagNodeTree;
  public start?: TagPosition;
  public end?: TagPosition;

  constructor(tag: string | TagValue, attrs: Record<string, unknown>, content: TagNodeTree) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
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

  setStart(value: TagPosition) {
    this.start = value;
  }

  setEnd(value: TagPosition) {
    this.end = value;
  }

  get length(): number {
    return getNodeLength(this);
  }

  toTagStart({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    const tagAttrs = getTagAttrs(String(this.tag), this.attrs);

    return `${openTag}${tagAttrs}${closeTag}`;
  }

  toTagEnd({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    return `${openTag}${SLASH}${this.tag}${closeTag}`;
  }

  toTagNode() {
    const newNode = new TagNode(String(this.tag).toLowerCase(), this.attrs, this.content);
    if (this.start) {
      newNode.setStart(this.start);
    }
    if (this.end) {
      newNode.setEnd(this.end);
    }
    return newNode;
  }

  toString({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}): string {
    const content = this.content ? renderContent(this.content, openTag, closeTag) : '';
    const tagStart = this.toTagStart({ openTag, closeTag });

    if (this.content === null || Array.isArray(this.content) && this.content.length === 0) {
      return tagStart;
    }

    return `${tagStart}${content}${this.toTagEnd({ openTag, closeTag })}`;
  }

  static create(tag: string, attrs: Record<string, unknown> = {}, content: TagNodeTree = null, start?: TagPosition) {
    const node = new TagNode(tag, attrs, content);
    if (start) {
      node.setStart(start);
    }
    return node;
  }

  static isOf(node: TagNode, type: string) {
    return (node.tag === type);
  }
}

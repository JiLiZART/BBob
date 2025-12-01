import type { NodeContent, TagNodeObject, TagNodeTree, TagPosition } from "@bbob/types";

import { CLOSE_BRAKET, OPEN_BRAKET, SLASH } from './char.js';
import { appendToNode, attrsToString, attrValue, getNodeLength, getUniqAttr, isTagNode, } from './helpers.js';

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

const toString = (node: NodeContent, openTag: string, closeTag: string) => {
  if (isTagNode(node)) {
    return node.toString({ openTag, closeTag });
  }

  return String(node);
};

const nodeTreeToString = (content: TagNodeTree, openTag: string, closeTag: string) => {
  if (Array.isArray(content)) {
    return content.reduce<string>((r, node) => {
      if (node !== null) {
        return r + toString(node, openTag, closeTag);
      }

      return r;
    }, '');
  }

  if (content) {
    return toString(content, openTag, closeTag);
  }

  return null;
};

export class TagNode<TagValue extends any = any> implements TagNodeObject {
  public readonly tag: string | TagValue;
  public attrs: Record<string, unknown>;
  public content: TagNodeTree;
  public start?: TagPosition;
  public end?: TagPosition;

  constructor(tag: string | TagValue, attrs: Record<string, unknown>, content: TagNodeTree, start?: TagPosition, end?: TagPosition) {
    this.tag = tag
    this.attrs = attrs;
    this.content = content;
    this.start = start;
    this.end = end;
  }

  get length(): number {
    return getNodeLength(this);
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

  toTagStart({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    const tagAttrs = getTagAttrs(String(this.tag), this.attrs);

    return `${openTag}${tagAttrs}${closeTag}`;
  }

  toTagEnd({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}) {
    return `${openTag}${SLASH}${this.tag}${closeTag}`;
  }

  toTagNode() {
    return new TagNode(this.tag, this.attrs, this.content, this.start, this.end);
  }

  toString({ openTag = OPEN_BRAKET, closeTag = CLOSE_BRAKET } = {}): string {
    const content = this.content ? nodeTreeToString(this.content, openTag, closeTag) : '';
    const tagStart = this.toTagStart({ openTag, closeTag });

    if (this.content === null || Array.isArray(this.content) && this.content.length === 0) {
      return tagStart;
    }

    return `${tagStart}${content}${this.toTagEnd({ openTag, closeTag })}`;
  }

  toJSON() {
    return {
      tag: this.tag,
      attrs: this.attrs,
      content: this.content,
      start: this.start,
      end: this.end,
    };
  }

  static create(tag: string, attrs: Record<string, unknown> = {}, content: TagNodeTree = null, start?: TagPosition) {
    return new TagNode(tag, attrs, content, start);
  }

  static isOf(node: TagNode, type: string) {
    return (node.tag === type);
  }
}

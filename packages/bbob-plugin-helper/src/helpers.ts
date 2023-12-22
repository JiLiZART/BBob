import { N } from './char';
import type { NodeContent, StringNode, TagNode } from "./TagNode";

function isTagNode(el: NodeContent): el is TagNode {
  return typeof el === 'object' && el !== null && !!el.tag;
}

function isStringNode(el: unknown): el is StringNode {
  return typeof el === 'string';
}

// check string is end of line
function isEOL(el: string) {
  return el === N
}

function keysReduce<Res, Def extends Res, T extends Record<string, unknown>>(obj: T, reduce: (acc: Def, key: keyof T) => Res, def: Def): Res {
  const keys = Object.keys(obj)

  return keys.reduce((acc, key) => reduce(acc, key), def)
}

function getNodeLength(node: NodeContent): number {
  if (isTagNode(node) && Array.isArray(node.content)) {
    return node.content.reduce<number>((count, contentNode) => {
      return count + getNodeLength(contentNode)
    }, 0);
  }

  if (isStringNode(node)) {
    return String(node).length;
  }

  return 0;
}

function appendToNode(node: TagNode, value: NodeContent) {
  if (Array.isArray(node.content)) {
    node.content.push(value);
  }
}

/**
 * Replaces " to &qquot;
 * @param {string} value
 */
function escapeAttrValue(value: string) {
  return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      // eslint-disable-next-line no-script-url
      .replace(/(javascript|data|vbscript):/gi, '$1%3A');
}

/**
 * @deprecated use escapeAttrValue
 */
const escapeHTML = escapeAttrValue

/**
 * Accept name and value and return valid html5 attribute string
 */
function attrValue<AttrValue = unknown>(name: string, value: AttrValue) {
  // in case of performance
  switch (typeof value) {
    case 'boolean':
      return value ? `${name}` : ''
    case 'number':
      return `${name}="${value}"`
    case 'string':
      return `${name}="${escapeAttrValue(value as string)}"`
    case 'object':
      return `${name}="${escapeAttrValue(JSON.stringify(value))}"`
    default:
      return ''
  }
}

/**
 * Transforms attrs to html params string
 * @example
 * attrsToString({ 'foo': true, 'bar': bar' }) => 'foo="true" bar="bar"'
 */
function attrsToString<AttrValue = unknown>(values: Record<string, AttrValue> | null) {
  // To avoid some malformed attributes
  if (values == null) {
    return '';
  }

  return keysReduce(
      values,
      (arr, key) => [...arr, attrValue(key, values[key])],
      [''],
  ).join(' ');
}

/**
 * Gets value from
 * @example
 * getUniqAttr({ 'foo': true, 'bar': bar' }) => 'bar'
 */
function getUniqAttr<Value>(attrs: Record<string, Value>) {
  return keysReduce(
      attrs,
      (res, key) => (attrs[key] === key ? attrs[key] : null),
      null,
  )
}

export {
  attrsToString,
  attrValue,
  appendToNode,
  escapeHTML,
  escapeAttrValue,
  getNodeLength,
  getUniqAttr,
  isTagNode,
  isStringNode,
  isEOL,
};

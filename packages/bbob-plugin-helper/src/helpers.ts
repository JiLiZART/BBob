import type { NodeContent, StringNode } from "@bbob/types";

import { N } from './char.js';
import type { TagNode } from "./TagNode.js";

function isTagNode(el: unknown): el is TagNode {
  return typeof el === 'object' && el !== null && 'tag' in el;
}

function isStringNode(el: unknown): el is StringNode {
  return typeof el === 'string';
}

// check string is end of line
function isEOL(el: string) {
  return el === N
}

function keysReduce<Res, Def extends Res, T extends Record<string, unknown>>(obj: T, reduce: (acc: Def, key: keyof T, obj: T) => Res, def: Def): Res {
  const keys = Object.keys(obj)

  return keys.reduce((acc, key) => reduce(acc, key, obj), def)
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
 * C0 control characters (plus DEL). Browsers remove ASCII tab/newline/CR and
 * ignore other control chars when resolving a URL scheme, so a control char
 * inside the scheme keyword (e.g. "java\tscript:") would otherwise slip past
 * the scheme guard below while still executing. Strip them so the scheme can't
 * be split apart. Harmless for non-URL attributes, where such chars aren't valid.
 */
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F]/g;

/**
 * Escapes an attribute value for safe HTML output and neutralizes
 * dangerous URL schemes.
 * @param {string} value
 */
function escapeAttrValue(value: string) {
    return value
        .replace(CONTROL_CHARS_RE, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        // eslint-disable-next-line no-script-url
        .replace(/(javascript|data|vbscript|file):/gi, '$1%3A');
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
function attrsToString<AttrValue = unknown>(values?: Record<string, AttrValue> | null) {
  // To avoid some malformed attributes
  if (values == null) {
    return '';
  }

  return keysReduce(
      values,
      (arr, key, obj) => [...arr, attrValue(key, obj[key])],
      [''],
  ).join(' ');
}

/**
 * Gets value from
 * @example
 * getUniqAttr({ 'foo': true, 'bar': bar' }) => 'bar'
 */
function getUniqAttr<Value>(attrs?: Record<string, Value>) {
  return keysReduce(
      attrs || {},
      (res, key, obj) => (obj[key] === key ? obj[key] : null),
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

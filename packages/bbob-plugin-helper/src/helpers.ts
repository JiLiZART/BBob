import {N} from './char';
import type {TagNode} from "./TagNode";

const isTagNode = (el: TagNode | string): el is TagNode => typeof el === 'object' && !!el.tag;

const isStringNode = (el: unknown) => typeof el === 'string';

const isEOL = (el: string) => el === N;

const keysReduce = <Res, Def extends Res, T extends Record<string, string>>(obj: T, reduce: (acc: Def, key: keyof T) => Res, def: Def): Res => {
  const keys = Object.keys(obj)

  return keys.reduce((acc, key) => reduce(acc, key), def)
};

const getNodeLength = (node: TagNode | string): number => {
  if (isTagNode(node)) {
    return node.content.reduce((count, contentNode) => count + getNodeLength(contentNode), 0);
  } if (isStringNode(node)) {
    return node.length;
  }

  return 0;
};

const appendToNode = (node: TagNode, value: string) => {
  node.content.push(value);
};

/**
 * Replaces " to &qquot;
 * @param {string} value
 */
const escapeHTML = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')
// eslint-disable-next-line no-script-url
  .replace(/(javascript|data|vbscript):/gi, '$1%3A');

/**
 * Accept name and value and return valid html5 attribute string
 */
const attrValue = (name: string, value: string) => {
  const type = typeof value;

  const types = {
    boolean: () => (value ? `${name}` : ''),
    number: () => `${name}="${value}"`,
    string: () => `${name}="${escapeHTML(value)}"`,
    object: () => `${name}="${escapeHTML(JSON.stringify(value))}"`,
  } as Record<string, () => string>;

  return types[type] ? types[type]() : '';
};

/**
 * Transforms attrs to html params string
 * @param {Record<string, string>|null} values
 */
const attrsToString = (values: Record<string, string> | null) => {
  // To avoid some malformed attributes
  if (values == null) {
    return '';
  }

  return keysReduce(
    values,
    (arr, key) => [...arr, attrValue(key, values[key])],
    [''],
  ).join(' ');
};

/**
 * Gets value from
 * @example
 * getUniqAttr({ 'foo': true, 'bar': bar' }) => 'bar'
 */
const getUniqAttr = (attrs: Record<string, string>) => keysReduce(
  attrs,
  (res, key) => (attrs[key] === key ? attrs[key] : null),
  null,
);

export {
  attrsToString,
  attrValue,
  appendToNode,
  escapeHTML,
  getNodeLength,
  getUniqAttr,
  isTagNode,
  isStringNode,
  isEOL,
};

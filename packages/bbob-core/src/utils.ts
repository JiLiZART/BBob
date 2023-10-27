/* eslint-disable no-plusplus */
import type { NodeContent, TagNode, TagNodeTree } from '@bbob/plugin-helper'

const isObj = (value: unknown): value is Record<string, unknown> => (typeof value === 'object');
const isBool = (value: unknown): value is boolean => (typeof value === 'boolean');
const isNodeTree = <TagName, AttrValue>(value: unknown): value is TagNode<TagName, AttrValue> => Boolean(value && isObj(value) && 'content' in value)

export type IterateCallback<TagName = string, AttrValue = unknown> = (node: NodeContent<TagName, AttrValue>) => NodeContent<TagName, AttrValue>

export function iterate<TagName = string, AttrValue = unknown>(t: TagNodeTree<TagName, AttrValue>, cb: IterateCallback<TagName, AttrValue>): TagNodeTree<TagName, AttrValue> {
  const tree = t;

  if (Array.isArray(tree)) {
      for (let idx = 0; idx < tree.length; idx++) {
          const oldNode = tree[idx] as NodeContent<TagName, AttrValue>
          tree[idx] = iterate<TagName, AttrValue>(cb(oldNode), cb) as NodeContent<TagName, AttrValue>;
      }
  } else if (isNodeTree(tree)) {
      iterate(tree.content, cb);
  }

  return tree;
}

export function same(expected: unknown, actual: unknown): boolean {
  if (typeof expected !== typeof actual) {
    return false;
  }

  if (!isObj(expected) || expected === null) {
    return expected === actual;
  }

  if (Array.isArray(expected)) {
    return expected.every((exp) => [].some.call(actual, (act) => same(exp, act)));
  }

  if (isObj(expected) && isObj(actual)) {
      return Object.keys(expected).every((key) => {
          const ao = actual[key];
          const eo = expected[key];

          if (isObj(eo) && eo !== null && ao !== null) {
              return same(eo, ao);
          }

          if (isBool(eo)) {
              return eo !== (ao === null);
          }

          return ao === eo;
      });
  }

  return false
}

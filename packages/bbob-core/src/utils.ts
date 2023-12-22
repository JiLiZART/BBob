/* eslint-disable no-plusplus */
import type { NodeContent, TagNode, TagNodeTree } from '@bbob/plugin-helper'

const isObj = (value: unknown): value is Record<string, unknown> => (typeof value === 'object');
const isBool = (value: unknown): value is boolean => (typeof value === 'boolean');
const isNodeTree = (value: unknown): value is TagNode => Boolean(value && isObj(value) && 'content' in value)

export type IterateCallback<Content> = (node: Content) => Content

export function iterate<Content = NodeContent, Iterable = ArrayLike<Content>>(t: Iterable, cb: IterateCallback<Content>): Iterable {
  const tree = t;

  if (Array.isArray(tree)) {
      for (let idx = 0; idx < tree.length; idx++) {
          const oldNode = tree[idx] as Content
          tree[idx] = iterate(cb(oldNode), cb) as Content;
      }
  } else if (isNodeTree(tree) && tree.content) {
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

export function match<Content = NodeContent, Iterable = ArrayLike<Content>>(
    t: Iterable,
    expression: Partial<TagNode>[] | Partial<TagNode>,
    cb: IterateCallback<Content>
) {
  return iterate<Content, Iterable>(t, (node) => {
    if (Array.isArray(expression)) {
      for (let idx = 0; idx < expression.length; idx++) {
        if (same(expression[idx], node)) {
          return cb(node);
        }
      }
    }

    return same(expression, node) ? cb(node) : node;
  })
}

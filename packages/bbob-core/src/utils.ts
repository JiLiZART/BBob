/* eslint-disable no-plusplus */
import { IterateCallback } from "@bbob/types";

const isObj = (value: unknown): value is Record<string, unknown> => (typeof value === 'object' && value !== null);
const isBool = (value: unknown): value is boolean => (typeof value === 'boolean');

export function iterate<Content, Iterable = ArrayLike<Content> | Content>(t: Iterable, cb: IterateCallback<Content>): Iterable {
  const tree = t;

  if (Array.isArray(tree)) {
    for (let idx = 0; idx < tree.length; idx++) {
      tree[idx] = iterate(cb(tree[idx]), cb);
    }
  } else if (isObj(tree) && 'content' in tree) {
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

          if (isObj(eo) && isObj(ao)) {
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

export function match<Content, Iterable = ArrayLike<Content>>(
    t: Iterable,
    expression: Content | ArrayLike<Content>,
    cb: IterateCallback<Content>
) {
  if (Array.isArray(expression)) {
    return iterate<Content, Iterable>(t, (node) => {
      for (let idx = 0; idx < expression.length; idx++) {
        if (same(expression[idx], node)) {
          return cb(node);
        }
      }

      return node;
    })
  }

  return iterate<Content, Iterable>(t, (node) => (same(expression, node) ? cb(node) : node));
}

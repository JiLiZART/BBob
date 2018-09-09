'use strict';

exports.__esModule = true;
/* eslint-disable no-plusplus */
var isObj = function isObj(value) {
  return typeof value === 'object';
};
var isBool = function isBool(value) {
  return typeof value === 'boolean';
};

function iterate(t, cb) {
  var tree = t;

  if (Array.isArray(tree)) {
    for (var idx = 0; idx < tree.length; idx++) {
      tree[idx] = iterate(cb(tree[idx]), cb);
    }
  } else if (tree && isObj(tree) && tree.content) {
    iterate(tree.content, cb);
  }

  return tree;
}

function same(expected, actual) {
  if (typeof expected !== typeof actual) {
    return false;
  }

  if (!isObj(expected) || expected === null) {
    return expected === actual;
  }

  if (Array.isArray(expected)) {
    return expected.every(function (exp) {
      return [].some.call(actual, function (act) {
        return same(exp, act);
      });
    });
  }

  return Object.keys(expected).every(function (key) {
    var ao = actual[key];
    var eo = expected[key];

    if (isObj(eo) && eo !== null && ao !== null) {
      return same(eo, ao);
    }

    if (isBool(eo)) {
      return eo !== (ao === null);
    }

    return ao === eo;
  });
}

function match(expression, cb) {
  return Array.isArray(expression) ? iterate(this, function (node) {
    for (var idx = 0; idx < expression.length; idx++) {
      if (same(expression[idx], node)) {
        return cb(node);
      }
    }

    return node;
  }) : iterate(this, function (node) {
    return same(expression, node) ? cb(node) : node;
  });
}

exports.iterate = iterate;
exports.match = match;
import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper/lib/char';

function CharGrabber(source, options) {
  const cursor = {
    pos: 0,
    len: source.length,
  };

  const substrUntilChar = (char) => {
    const { pos } = cursor;
    const idx = source.indexOf(char, pos);

    return idx >= 0 ? source.substr(pos, idx - pos) : '';
  };
  const includes = (val) => source.indexOf(val, cursor.pos) >= 0;
  const hasNext = () => cursor.len > cursor.pos;
  const isLast = () => cursor.pos === cursor.len;
  const skip = (num = 1, silent) => {
    cursor.pos += num;

    if (options && options.onSkip && !silent) {
      options.onSkip();
    }
  };
  const rest = () => source.substr(cursor.pos);
  const curr = () => source[cursor.pos];
  const prev = () => {
    const prevPos = cursor.pos - 1;

    return typeof source[prevPos] !== 'undefined' ? source[prevPos] : null;
  };
  const next = () => {
    const nextPos = cursor.pos + 1;

    return nextPos <= (source.length - 1) ? source[nextPos] : null;
  };
  const grabWhile = (cond, silent) => {
    let start = 0;

    if (hasNext()) {
      start = cursor.pos;

      while (hasNext() && cond(curr())) {
        skip(1, silent);
      }
    }

    return source.substr(start, cursor.pos - start);
  };
  /**
   * @type {skip}
   */
  this.skip = skip;
  /**
   * @returns {Boolean}
   */
  this.hasNext = hasNext;
  /**
   * @returns {String}
   */
  this.getCurr = curr;
  /**
   * @returns {String}
   */
  this.getRest = rest;
  /**
   * @returns {String}
   */
  this.getNext = next;
  /**
   * @returns {String}
   */
  this.getPrev = prev;
  /**
   * @returns {Boolean}
   */
  this.isLast = isLast;
  /**
   * @returns {Boolean}
   */
  this.includes = includes;
  /**
   * @param {Function} cond
   * @param {Boolean} silent
   * @return {String}
   */
  this.grabWhile = grabWhile;
  /**
   * Grabs rest of string until it find a char
   * @param {String} char
   * @return {String}
   */
  this.substrUntilChar = substrUntilChar;
}

/**
 * Creates a grabber wrapper for source string, that helps to iterate over string char by char
 * @param {String} source
 * @param {Object} options
 * @param {Function} options.onSkip
 * @return CharGrabber
 */
export const createCharGrabber = (source, options) => new CharGrabber(source, options);

/**
 * Trims string from start and end by char
 * @example
 *  trimChar('*hello*', '*') ==> 'hello'
 * @param {String} str
 * @param {String} charToRemove
 * @returns {String}
 */
export const trimChar = (str, charToRemove) => {
  while (str.charAt(0) === charToRemove) {
    // eslint-disable-next-line no-param-reassign
    str = str.substring(1);
  }

  while (str.charAt(str.length - 1) === charToRemove) {
    // eslint-disable-next-line no-param-reassign
    str = str.substring(0, str.length - 1);
  }

  return str;
};

/**
 * Unquotes \" to "
 * @param str
 * @return {String}
 */
export const unquote = (str) => str.replace(BACKSLASH + QUOTEMARK, QUOTEMARK);

function NodeList(values = []) {
  const nodes = values;

  const getLast = () => (
    Array.isArray(nodes) && nodes.length > 0 && typeof nodes[nodes.length - 1] !== 'undefined'
      ? nodes[nodes.length - 1]
      : null);
  const flushLast = () => (nodes.length ? nodes.pop() : false);
  const push = (value) => nodes.push(value);
  const toArray = () => nodes;

  this.push = push;
  this.toArray = toArray;
  this.getLast = getLast;
  this.flushLast = flushLast;
}

/**
 *
 * @param values
 * @return {NodeList}
 */
export const createList = (values = []) => new NodeList(values);

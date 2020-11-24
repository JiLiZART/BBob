import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper/lib/char';

function CharGrabber(source, options) {
  const cursor = {
    pos: 0,
    len: source.length,
    get curr() {
      return source[cursor.pos];
    },
    get prev() {
      const prevPos = cursor.pos - 1;

      if (typeof source[prevPos] !== 'undefined') {
        return source[prevPos];
      }

      return null;
    },
    get next() {
      const nextPos = cursor.pos + 1;

      if (nextPos <= (source.length - 1)) {
        return source[nextPos];
      }

      return null;
    },
    get rest() {
      return source.substr(cursor.pos);
    },
    get hasNext() {
      return cursor.len > cursor.pos;
    },
    get isLast() {
      return cursor.pos === cursor.len;
    },
  };
  const skip = (num = 1, silent) => {
    cursor.pos += num;

    if (options && options.onSkip && !silent) {
      options.onSkip();
    }
  };

  this.cursor = cursor;

  /**
   * @type {skip}
   */
  this.skip = skip;
  /**
   * @returns {Boolean}
   */
  this.hasNext = () => cursor.hasNext;
  /**
   * @returns {String}
   */
  this.getCurr = () => cursor.curr;
  /**
   * @returns {String}
   */
  this.getRest = () => cursor.rest;
  /**
   * @returns {String}
   */
  this.getNext = () => cursor.next;
  /**
   * @returns {String}
   */
  this.getPrev = () => cursor.prev;
  /**
   * @returns {Boolean}
   */
  this.isLast = () => cursor.isLast;
  /**
   * @returns {Boolean}
   */
  this.includes = (searchValue) => source.indexOf(searchValue, cursor.pos) >= 0;
  /**
   * @param {Function} cond
   * @param {Boolean} silent
   * @return {String}
   */
  this.grabWhile = (cond, silent) => {
    let start = 0;

    if (cursor.hasNext) {
      start = cursor.pos;

      while (cursor.hasNext && cond(cursor.curr)) {
        skip(1, silent);
      }
    }

    return source.substr(start, cursor.pos - start);
  };
  /**
   * Grabs rest of string until it find a char
   * @param {String} char
   * @return {String}
   */
  this.substrUntilChar = (char) => {
    const { pos } = cursor;
    const idx = source.indexOf(char, pos);

    if (idx >= 0) {
      return source.substr(pos, idx - pos);
    }

    return '';
  };
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

  this.getLast = () => {
    if (Array.isArray(nodes) && nodes.length > 0 && typeof nodes[nodes.length - 1] !== 'undefined') {
      return nodes[nodes.length - 1];
    }

    return null;
  };
  this.flushLast = () => {
    if (nodes.length) {
      return nodes.pop();
    }

    return false;
  };
  this.push = (value) => nodes.push(value);
  this.toArray = () => nodes;
}

/**
 *
 * @param values
 * @return {NodeList}
 */
export const createList = (values = []) => new NodeList(values);

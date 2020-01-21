import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper/lib/char';

/**
 * @typedef {Object} CharGrabber
 * @property {Function} skip
 * @property {Function} hasNext
 * @property {Function} isLast
 * @property {Function} grabWhile
 */

/**
 * Creates a grabber wrapper for source string, that helps to iterate over string char by char
 * @param {String} source
 * @param {Object} options
 * @param {Function} options.onSkip
 * @returns
 */
export const createCharGrabber = (source, options) => {
  // let idx = 0;
  const cursor = {
    pos: 0,
    length: source.length,
  };

  const skip = () => {
    cursor.pos += 1;

    if (options && options.onSkip) {
      options.onSkip();
    }
  };
  const hasNext = () => cursor.length > cursor.pos;
  const getRest = () => source.substr(cursor.pos);
  const getCurr = () => source[cursor.pos];

  return {
    skip,
    hasNext,
    isLast: () => (cursor.pos === cursor.length),
    /**
     * @param {Function} cond
     * @returns {string}
     */
    grabWhile: (cond) => {
      let start = 0;

      if (hasNext()) {
        start = cursor.pos;

        while (hasNext() && cond(getCurr())) {
          skip();
        }
      }

      return source.substr(start, cursor.pos - start);
    },
    getNext: () => source[cursor.pos + 1],
    getPrev: () => source[cursor.pos - 1],
    getCurr,
    getRest,
    /**
     * Grabs rest of string until it find a char
     * @param {String} char
     * @return {String}
     */
    substrUntilChar: (char) => {
      const restStr = getRest();
      const indexOfChar = restStr.indexOf(char);

      if (indexOfChar >= 0) {
        return restStr.substr(0, indexOfChar);
      }

      return '';
    },
  };
};

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

/**
 * @typedef {Object} ItemList
 * @type {Object}
 * @property {getLastCb} getLast
 * @property {flushLastCb} flushLast
 * @property {pushCb} push
 * @property {toArrayCb} toArray
 */

/**
 *
 * @param values
 * @return {ItemList}
 */
export const createList = (values = []) => {
  const nodes = values;
  /**
   * @callback getLastCb
   */
  const getLast = () => (nodes.length ? nodes[nodes.length - 1] : null);
  /**
   * @callback flushLastCb
   * @return {*}
   */
  const flushLast = () => {
    if (nodes.length) {
      return nodes.pop();
    }

    return false;
  };
  /**
   * @callback pushCb
   * @param value
   */
  const push = (value) => nodes.push(value);

  /**
   * @callback toArrayCb
   * @return {Array}
   */

  return {
    getLast,
    flushLast,
    push,
    toArray: () => nodes,
  };
};

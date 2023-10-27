import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper';

export type CharGrabberOptions = {
  onSkip?: () => void
}

export class CharGrabber {
  private source: string;
  private cursor: { len: number; pos: number };
  private options: CharGrabberOptions;

  constructor(source: string, options: CharGrabberOptions = {}) {
    this.source = source
    this.cursor = {
      pos: 0,
      len: source.length,
    };

    this.options = options
  }

  skip(num = 1, silent?: boolean) {
    this.cursor.pos += num;

    if (this.options && this.options.onSkip && !silent) {
      this.options.onSkip();
    }
  }

  hasNext() {
    return this.cursor.len > this.cursor.pos
  }

  getCurr() {
    return this.source[this.cursor.pos]
  }

  getRest() {
    return this.source.substring(this.cursor.pos)
  }

  getNext() {
    const nextPos = this.cursor.pos + 1;

    return nextPos <= (this.source.length - 1) ? this.source[nextPos] : null;
  }

  getPrev() {
    const prevPos = this.cursor.pos - 1;

    return typeof this.source[prevPos] !== 'undefined' ? this.source[prevPos] : null;
  }

  isLast() {
    return this.cursor.pos === this.cursor.len
  }

  includes(val: string) {
    return this.source.indexOf(val, this.cursor.pos) >= 0
  }

  grabWhile(cond: (curr: string) => boolean, silent?: boolean) {
    let start = 0;

    if (this.hasNext()) {
      start = this.cursor.pos;

      while (this.hasNext() && cond(this.getCurr())) {
        this.skip(1, silent);
      }
    }

    return this.source.substring(start, this.cursor.pos);
  }

  grabN(num: number = 0) {
    return this.source.substring(this.cursor.pos, this.cursor.pos + num)
  }

  /**
   * Grabs rest of string until it find a char
   */
  substrUntilChar(char: string) {
    const { pos } = this.cursor;
    const idx = this.source.indexOf(char, pos);

    return idx >= 0 ? this.source.substring(pos, idx) : '';
  }
}

/**
 * Creates a grabber wrapper for source string, that helps to iterate over string char by char
 */
export const createCharGrabber = (source: string, options?: CharGrabberOptions) => new CharGrabber(source, options);

/**
 * Trims string from start and end by char
 * @example
 *  trimChar('*hello*', '*') ==> 'hello'
 */
export const trimChar = (str: string, charToRemove: string) => {
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
 */
export const unquote = (str: string) => str.replace(BACKSLASH + QUOTEMARK, QUOTEMARK);

export class NodeList<Value> {
  constructor(private nodes: Value[] = []) {
  }

  getLast() {
    return (
        Array.isArray(this.nodes) && this.nodes.length > 0 && typeof this.nodes[this.nodes.length - 1] !== 'undefined'
            ? this.nodes[this.nodes.length - 1]
            : null)
  }

  flushLast() {
    return (this.nodes.length ? this.nodes.pop() : false)
  }

  push(value: Value) {
    return this.nodes.push(value)
  }

  toArray() {
    return this.nodes
  }
}

export const createList = <Type>(values: Type[] = []) => new NodeList(values);

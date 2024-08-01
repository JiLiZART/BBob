import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper';

export type CharGrabberOptions = {
  onSkip?: () => void
}

export class CharGrabber {
  private s: string;
  private c: { len: number; pos: number };
  private o: CharGrabberOptions;

  constructor(source: string, options: CharGrabberOptions = {}) {
    this.s = source
    this.c = {
      pos: 0,
      len: source.length,
    };

    this.o = options
  }

  skip(num = 1, silent?: boolean) {
    this.c.pos += num;

    if (this.o && this.o.onSkip && !silent) {
      this.o.onSkip();
    }
  }

  hasNext() {
    return this.c.len > this.c.pos
  }

  getCurr() {
    if (typeof this.s[this.c.pos] === 'undefined') {
      return ''
    }

    return this.s[this.c.pos]
  }

  getPos() {
    return this.c.pos;
  }

  getLength() {
    return this.c.len;
  }

  getRest() {
    return this.s.substring(this.c.pos)
  }

  getNext() {
    const nextPos = this.c.pos + 1;

    return nextPos <= (this.s.length - 1) ? this.s[nextPos] : null;
  }

  getPrev() {
    const prevPos = this.c.pos - 1;

    if (typeof this.s[prevPos] === 'undefined') {
      return null
    }

    return this.s[prevPos];
  }

  isLast() {
    return this.c.pos === this.c.len
  }

  includes(val: string) {
    return this.s.indexOf(val, this.c.pos) >= 0
  }

  grabWhile(condition: (curr: string) => boolean, silent?: boolean) {
    let start = 0;

    if (this.hasNext()) {
      start = this.c.pos;

      while (this.hasNext() && condition(this.getCurr())) {
        this.skip(1, silent);
      }
    }

    return this.s.substring(start, this.c.pos);
  }

  grabN(num: number = 0) {
    return this.s.substring(this.c.pos, this.c.pos + num)
  }

  /**
   * Grabs rest of string until it find a char
   */
  substrUntilChar(char: string) {
    const { pos } = this.c;
    const idx = this.s.indexOf(char, pos);

    return idx >= 0 ? this.s.substring(pos, idx) : '';
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

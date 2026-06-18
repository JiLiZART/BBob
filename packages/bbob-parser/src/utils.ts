import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper';

export type CharGrabberOptions = {
  onSkip?: () => void
}

export class CharGrabber {
  private s: string;
  private pos: number;
  private len: number;
  private onSkip: (() => void) | null;

  constructor(source: string, options: CharGrabberOptions = {}) {
    this.s = source;
    this.pos = 0;
    this.len = source.length;
    this.onSkip = options.onSkip || null;
  }

  skip(num = 1, silent?: boolean) {
    this.pos += num;

    if (!silent && this.onSkip) {
      this.onSkip();
    }
  }

  hasNext() {
    return this.len > this.pos;
  }

  getCurr() {
    return this.pos < this.len ? this.s[this.pos] : '';
  }

  getPos() {
    return this.pos;
  }

  getLength() {
    return this.len;
  }

  getRest() {
    return this.s.substring(this.pos);
  }

  getNext() {
    const nextPos = this.pos + 1;

    return nextPos < this.len ? this.s[nextPos] : null;
  }

  getPrev() {
    const prevPos = this.pos - 1;

    return prevPos >= 0 ? this.s[prevPos] : null;
  }

  isLast() {
    return this.pos === this.len;
  }

  includes(val: string) {
    return this.s.indexOf(val, this.pos) >= 0;
  }

  grabWhile(condition: (curr: string) => boolean, silent?: boolean) {
    let start = 0;

    if (this.hasNext()) {
      start = this.pos;
      const onSkip = silent ? null : this.onSkip;

      while (this.pos < this.len && condition(this.s[this.pos])) {
        this.pos++;
        if (onSkip) onSkip();
      }
    }

    return this.s.substring(start, this.pos);
  }

  grabN(num: number = 0) {
    return this.s.substring(this.pos, this.pos + num);
  }

  /**
   * Grabs rest of string until it find a char
   */
  substrUntilChar(char: string) {
    const pos = this.pos;
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
  let start = 0;
  let end = str.length;

  while (start < end && str[start] === charToRemove) start++;
  while (end > start && str[end - 1] === charToRemove) end--;

  return start === 0 && end === str.length ? str : str.substring(start, end);
};

/**
 * Unquotes \" to "
 */
export const unquote = (str: string) => str.replace(BACKSLASH + QUOTEMARK, QUOTEMARK);

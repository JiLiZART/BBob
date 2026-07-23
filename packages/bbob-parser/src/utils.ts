import {
  QUOTEMARK,
  BACKSLASH,
} from '@bbob/plugin-helper';

export type CharGrabberOptions = {
  onSkip?: (count?: number) => void
}

export class CharGrabber {
  private s: string;
  private pos: number;
  private len: number;
  private onSkip: ((count?: number) => void) | null;

  constructor(source: string, options: CharGrabberOptions = {}) {
    this.s = source;
    this.pos = 0;
    this.len = source.length;
    this.onSkip = options.onSkip || null;
  }

  skip(num = 1, silent?: boolean) {
    this.pos += num;

    // Preserve original semantics: a manual skip bumps the column by one,
    // regardless of num (all call sites use num === 1).
    if (!silent && this.onSkip) {
      this.onSkip(1);
    }
  }

  /**
   * Advance the cursor by `num` chars, bumping the column by the same amount.
   * Use when a span was already scanned (e.g. via substrUntilChar) and we want
   * to consume it without re-walking it character by character.
   */
  advance(num: number) {
    this.pos += num;

    if (this.onSkip && num > 0) {
      this.onSkip(num);
    }
  }

  hasNext() {
    return this.len > this.pos;
  }

  getCurr() {
    return this.pos < this.len ? this.s[this.pos] : '';
  }

  /** Char code at current position, or -1 past end. Avoids 1-char string alloc. */
  getCurrCode() {
    return this.pos < this.len ? this.s.charCodeAt(this.pos) : -1;
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

  /** Char code at next position, or -1 if none. */
  getNextCode() {
    const nextPos = this.pos + 1;

    return nextPos < this.len ? this.s.charCodeAt(nextPos) : -1;
  }

  getPrev() {
    const prevPos = this.pos - 1;

    return prevPos >= 0 ? this.s[prevPos] : null;
  }

  /** Char code at previous position, or -1 if none. */
  getPrevCode() {
    const prevPos = this.pos - 1;

    return prevPos >= 0 ? this.s.charCodeAt(prevPos) : -1;
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

      while (this.pos < this.len && condition(this.s[this.pos])) {
        this.pos++;
      }

      // Batch the skip notification: one call for the whole run instead of
      // one per character. Equivalent when onSkip only accumulates a count.
      if (!silent && this.onSkip && this.pos > start) this.onSkip(this.pos - start);
    }

    return this.s.substring(start, this.pos);
  }

  /**
   * Same as grabWhile but the predicate receives a char *code* (number),
   * avoiding a 1-char string allocation per character in hot loops.
   */
  grabWhileCode(condition: (code: number) => boolean, silent?: boolean) {
    let start = 0;

    if (this.hasNext()) {
      start = this.pos;

      while (this.pos < this.len && condition(this.s.charCodeAt(this.pos))) {
        this.pos++;
      }

      if (!silent && this.onSkip && this.pos > start) this.onSkip(this.pos - start);
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

const ESCAPED_QUOTE = BACKSLASH + QUOTEMARK;

/**
 * Unquotes \" to "
 */
export const unquote = (str: string) => (
  // The vast majority of attribute values contain no escaped quote at all;
  // indexOf is far cheaper than entering replace().
  str.indexOf(ESCAPED_QUOTE) === -1 ? str : str.replace(ESCAPED_QUOTE, QUOTEMARK)
);

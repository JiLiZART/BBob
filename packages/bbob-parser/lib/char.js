const N = '\n'.charCodeAt(0);
const TAB = '\t'.charCodeAt(0);
const F = '\f'.charCodeAt(0);
const R = '\r'.charCodeAt(0);

const EQ = '='.charCodeAt(0);
const QUOTEMARK = '"'.charCodeAt(0);
const SPACE = ' '.charCodeAt(0);

const OPEN_BRAKET = '['.charCodeAt(0);
const CLOSE_BRAKET = ']'.charCodeAt(0);

const SLASH = '/'.charCodeAt(0);
const BACKSLASH = '\\'.charCodeAt(0);

const PLACEHOLDER_SPACE_TAB = '    ';
const PLACEHOLDER_SPACE = ' ';

const getChar = String.fromCharCode;

module.exports = {
  getChar,
  N,
  F,
  R,
  TAB,
  EQ,
  QUOTEMARK,
  SPACE,
  OPEN_BRAKET,
  CLOSE_BRAKET,
  SLASH,
  PLACEHOLDER_SPACE_TAB,
  PLACEHOLDER_SPACE,
  BACKSLASH,
};

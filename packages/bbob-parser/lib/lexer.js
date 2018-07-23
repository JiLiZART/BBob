const c = require('./char');
const Token = require('./Token');

const OPEN_BRAKET = c.getChar(c.OPEN_BRAKET);
const CLOSE_BRAKET = c.getChar(c.CLOSE_BRAKET);
const QUOTEMARK = c.getChar(c.QUOTEMARK);
const BACKSLASH = c.getChar(c.BACKSLASH);
const SLASH = c.getChar(c.SLASH);
const SPACE = c.getChar(c.SPACE);
const TAB = c.getChar(c.TAB);
const EQ = c.getChar(c.EQ);
const N = c.getChar(c.N);

const RESERVED_CHARS = [
  CLOSE_BRAKET,
  OPEN_BRAKET,
  QUOTEMARK,
  BACKSLASH,
  SPACE,
  TAB,
  EQ,
  N,
];

const NOT_CHAR_TOKENS = [
  CLOSE_BRAKET,
  OPEN_BRAKET,
  SPACE,
  TAB,
  N,
];

const WHITESPACES = [SPACE, TAB];

const isCharReserved = char => (RESERVED_CHARS.indexOf(char) >= 0);

const isWhiteSpace = char => (WHITESPACES.indexOf(char) >= 0);

function createLexer(buffer, options = {}) {
  let idx = 0;
  let row = 0;
  let col = 0;
  const tokens = [];

  const emitToken = (token) => {
    options.onToken && options.onToken(token);

    tokens.push(token);
  };

  const createToken = (type, value, r = row, cl = col) => new Token(type, value, r, cl);

  const hasNext = () => idx < buffer.length;

  const getStrFrom = start => buffer.substr(start, idx - start);

  const forwardUntil = (cond) => {
    while (hasNext() && cond(buffer[idx])) {
      idx++;
    }
  };

  const next = () => {
    const char = buffer[idx];
    const nextChar = buffer[idx + 1];

    if (char === N) {
      idx++;
      col = 0;
      row++;
      emitToken(createToken(Token.TYPE_NEW_LINE, char));
    } else if (isWhiteSpace(char)) {
      const start = idx;

      forwardUntil(val => isWhiteSpace(val));

      const str = getStrFrom(start);
      emitToken(createToken(Token.TYPE_SPACE, str));
    } else if (char === OPEN_BRAKET) {
      idx++;
      if (isCharReserved(nextChar)) {
        next();
      } else {
        const start = idx;

        forwardUntil(val => val !== CLOSE_BRAKET);

        const str = getStrFrom(start);
        idx++;
        emitToken(createToken(Token.TYPE_TAG, str));
      }
    } else if (NOT_CHAR_TOKENS.indexOf(char) === -1) {
      const start = idx;

      forwardUntil(val => NOT_CHAR_TOKENS.indexOf(val) === -1);

      const str = getStrFrom(start);
      emitToken(createToken(Token.TYPE_WORD, str));
    }
  };

  const tokenize = () => {
    while (hasNext()) {
      next();
    }

    return tokens;
  };

  const isTokenNested = (token) => {
    const value = OPEN_BRAKET + SLASH + token.getValue();
    return buffer.indexOf(value) > -1;
  };

  return {
    // next,
    // hasNext,
    tokenize,
    isTokenNested,
  };
}

module.exports = createLexer;

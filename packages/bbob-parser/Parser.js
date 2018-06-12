const {
  convertTokenToText,
  getTagName,
  getTokenColumn,
  getTokenLine,
  getTokenValue,
  isAttrNameToken,
  isAttrValueToken,
  isTagStart,
  isTagToken,
  isTextToken,
  isTagEnd,
} = require('./token');

const {
  SLASH,
  getChar,
} = require('./char');

const createTagNode = (tag, attrs = {}, content = []) => ({ tag, attrs, content });

/**
 *
 {
     tag: 'div',
     attrs: {
         class: 'foo'
     },
     content: ['hello world!']
 }
 */
module.exports = class Parser {
  constructor(tokens, options = {}) {
    this.tokens = tokens;
    this.options = options;
  }

  parse() {
    const nodes = [];
    const nestedNodes = [];
    const curTags = [];
    const curTagsAttrName = [];

    const closableTags = this.findNestedTags();

    const isNestedTag = token => closableTags.indexOf(getTokenValue(token)) >= 0;

    const getCurTag = () => {
      if (curTags.length) {
        return curTags[curTags.length - 1];
      }

      return null;
    };

    const createCurTag = (token) => {
      curTags.push(createTagNode(getTokenValue(token)));
    };

    const getCurTagAttrName = () => {
      if (curTagsAttrName.length) {
        return curTagsAttrName[curTagsAttrName.length - 1];
      }

      return null;
    };

    const createCurTagAttrName = (token) => {
      curTagsAttrName.push(getTokenValue(token));
    };

    const clearCurTagAttrName = () => {
      if (curTagsAttrName.length) {
        curTagsAttrName.pop();
      }
    };

    const clearCurTag = () => {
      if (curTags.length) {
        curTags.pop();

        clearCurTagAttrName();
      }
    };

    const getNodes = () => {
      if (nestedNodes.length) {
        const nestedNode = nestedNodes[nestedNodes.length - 1];
        return nestedNode.content;
      }

      return nodes;
    };

    let token;
    // eslint-disable-next-line no-cond-assign
    while (token = this.tokens.shift()) {
      if (!token) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (isTagToken(token)) {
        if (this.isAllowedTag(getTagName(token))) {
          // [tag]
          if (isTagStart(token)) {
            createCurTag(token);

            if (isNestedTag(token)) {
              nestedNodes.push(getCurTag());
            } else {
              getNodes().push(getCurTag());
              clearCurTag();
            }
          }

          // [/tag]
          if (isTagEnd(token)) {
            clearCurTag();

            const lastNestedNode = nestedNodes.pop();

            if (lastNestedNode) {
              getNodes().push(lastNestedNode);
            } else {
              // eslint-disable-next-line no-console
              console.warn(`Inconsistent tag '${getTokenValue(token)}' on line ${getTokenLine(token)} and column ${getTokenColumn(token)}`);
            }
          }
        } else {
          getNodes().push(convertTokenToText(token));
        }
      }

      if (getCurTag()) {
        if (isAttrNameToken(token)) {
          createCurTagAttrName(token);
          getCurTag().attrs[getCurTagAttrName()] = null;
        } else if (isAttrValueToken(token)) {
          getCurTag().attrs[getCurTagAttrName()] = getTokenValue(token);
          clearCurTagAttrName();
        } else if (isTextToken(token)) {
          getCurTag().content.push(getTokenValue(token));
        }
      } else if (isTextToken(token)) {
        getNodes().push(getTokenValue(token));
      }
    }

    return nodes;
  }

  findNestedTags() {
    const tags = this.tokens.filter(isTagToken).reduce((acc, token) => {
      acc[getTokenValue(token)] = true;

      return acc;
    }, {});

    const closeChar = getChar(SLASH);

    return Object.keys(tags).reduce((arr, key) => {
      if (tags[key] && tags[closeChar + key]) {
        arr.push(key);
      }

      return arr;
    }, []);
  }

  isAllowedTag(value) {
    if (this.options.onlyAllowTags && this.options.onlyAllowTags.length) {
      return this.options.onlyAllowTags.indexOf(value) >= 0;
    }

    return true;
  }
};

module.exports.createTagNode = createTagNode;

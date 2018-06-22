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

    this.closableTags = this.findNestedTags();
    this.nodes = [];
    this.nestedNodes = [];
    this.curTags = [];
    this.curTagsAttrName = [];
  }

  isNestedTag(token) {
    return this.closableTags.indexOf(getTokenValue(token)) >= 0;
  }

  getCurTag() {
    if (this.curTags.length) {
      return this.curTags[this.curTags.length - 1];
    }

    return null;
  }

  createCurTag(token) {
    this.curTags.push(createTagNode(getTokenValue(token)));
  }

  createCurTagAttrName(token) {
    this.curTagsAttrName.push(getTokenValue(token));
  }

  getCurTagAttrName() {
    if (this.curTagsAttrName.length) {
      return this.curTagsAttrName[this.curTagsAttrName.length - 1];
    }

    return this.getCurTag().tag;
  }

  clearCurTagAttrName() {
    if (this.curTagsAttrName.length) {
      this.curTagsAttrName.pop();
    }
  }

  clearCurTag() {
    if (this.curTags.length) {
      this.curTags.pop();

      this.clearCurTagAttrName();
    }
  }

  getNodes() {
    if (this.nestedNodes.length) {
      const nestedNode = this.nestedNodes[this.nestedNodes.length - 1];
      return nestedNode.content;
    }

    return this.nodes;
  }

  appendNode(tag) {
    this.getNodes().push(tag);
  }

  handleTagStart(token) {
    if (isTagStart(token)) {
      this.createCurTag(token);

      if (this.isNestedTag(token)) {
        this.nestedNodes.push(this.getCurTag());
      } else {
        this.appendNode(this.getCurTag());
        this.clearCurTag();
      }
    }
  }

  handleTagEnd(token) {
    if (isTagEnd(token)) {
      this.clearCurTag();

      const lastNestedNode = this.nestedNodes.pop();

      if (lastNestedNode) {
        this.appendNode(lastNestedNode);
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Inconsistent tag '${getTokenValue(token)}' on line ${getTokenLine(token)} and column ${getTokenColumn(token)}`);
      }
    }
  }

  handleTagToken(token) {
    if (isTagToken(token)) {
      if (this.isAllowedTag(getTagName(token))) {
        // [tag]
        this.handleTagStart(token);

        // [/tag]
        this.handleTagEnd(token);
      } else {
        this.appendNode(convertTokenToText(token));
      }
    }
  }

  handleCurTag(token) {
    if (this.getCurTag()) {
      if (isAttrNameToken(token)) {
        this.createCurTagAttrName(token);
        this.getCurTag().attrs[this.getCurTagAttrName()] = null;
      } else if (isAttrValueToken(token)) {
        this.getCurTag().attrs[this.getCurTagAttrName()] = getTokenValue(token);
        this.clearCurTagAttrName();
      } else if (isTextToken(token)) {
        this.getCurTag().content.push(getTokenValue(token));
      }
    } else if (isTextToken(token)) {
      this.appendNode(getTokenValue(token));
    }
  }

  parse() {
    let token;
    // eslint-disable-next-line no-cond-assign
    while (token = this.tokens.shift()) {
      if (!token) {
        // eslint-disable-next-line no-continue
        continue;
      }

      this.handleTagToken(token);

      this.handleCurTag(token);
    }

    return this.nodes;
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

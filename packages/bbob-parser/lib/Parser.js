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
} = require('./Token');

const Tokenizer = require('./Tokenizer');
const TagNode = require('./TagNode');

const createTagNode = (tag, attrs = {}, content = []) => new TagNode(tag, attrs, content);

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
class Parser {
  constructor(input, options = {}) {
    this.createTokenizer(input);

    this.options = options;

    this.nodes = [];
    this.nestedNodes = [];
    this.tagNodes = [];
    this.tagNodesAttrName = [];
  }

  createTokenizer(input) {
    this.tokenizer = new Tokenizer(input, {
      onToken: (token) => {
        this.parseToken(token);
      },
    });
  }

  isTagNested(token) {
    return this.tokenizer.isTokenNested(token);
  }

  /**
   * @return {TagNode}
   */
  getTagNode() {
    if (this.tagNodes.length) {
      return this.tagNodes[this.tagNodes.length - 1];
    }

    return null;
  }

  createTagNode(token) {
    this.tagNodes.push(createTagNode(getTokenValue(token)));
  }

  createTagNodeAttrName(token) {
    this.tagNodesAttrName.push(getTokenValue(token));
  }

  getTagNodeAttrName() {
    if (this.tagNodesAttrName.length) {
      return this.tagNodesAttrName[this.tagNodesAttrName.length - 1];
    }

    return this.getTagNode().tag;
  }

  clearTagNodeAttrName() {
    if (this.tagNodesAttrName.length) {
      this.tagNodesAttrName.pop();
    }
  }

  clearTagNode() {
    if (this.tagNodes.length) {
      this.tagNodes.pop();

      this.clearTagNodeAttrName();
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
      this.createTagNode(token);

      if (this.isTagNested(token)) {
        this.nestedNodes.push(this.getTagNode());
      } else {
        this.appendNode(this.getTagNode());
        this.clearTagNode();
      }
    }
  }

  handleTagEnd(token) {
    if (isTagEnd(token)) {
      this.clearTagNode();

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

  handleTagNode(token) {
    const tagNode = this.getTagNode();

    if (tagNode) {
      if (isAttrNameToken(token)) {
        this.createTagNodeAttrName(token);
        tagNode.attr(this.getTagNodeAttrName(), null);
      } else if (isAttrValueToken(token)) {
        tagNode.attr(this.getTagNodeAttrName(), getTokenValue(token));
        this.clearTagNodeAttrName();
      } else if (isTextToken(token)) {
        tagNode.append(getTokenValue(token));
      }
    } else if (isTextToken(token)) {
      this.appendNode(getTokenValue(token));
    }
  }

  parseToken(token) {
    this.handleTagToken(token);
    this.handleTagNode(token);
  }

  parse() {
    if (this.tokens) {
      let token;
      // eslint-disable-next-line no-cond-assign
      while (token = this.tokens.shift()) {
        if (!token) {
          // eslint-disable-next-line no-continue
          continue;
        }

        this.parseToken(token);
      }
    } else {
      this.tokens = this.tokenizer.tokenize();
    }

    return this.nodes;
  }

  isAllowedTag(value) {
    if (this.options.onlyAllowTags && this.options.onlyAllowTags.length) {
      return this.options.onlyAllowTags.indexOf(value) >= 0;
    }

    return true;
  }
}

module.exports = Parser;
module.exports.createTagNode = createTagNode;

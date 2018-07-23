const Tokenizer = require('./Tokenizer');
const TagNode = require('./TagNode');
const createLexer = require('./lexer');

/**
 * @private
 * @type {Array}
 */
let nodes;
/**
 * @private
 * @type {Array}
 */
let nestedNodes;
/**
 * @private
 * @type {Array}
 */
let tagNodes;
/**
 * @private
 * @type {Array}
 */
let tagNodesAttrName;

let options = {};
let tokenizer = null;

// eslint-disable-next-line no-unused-vars
let tokens = null;

/**
 *
 * @param tag
 * @param attrs
 * @param content
 */
const newTagNode = (tag, attrs = {}, content = []) => new TagNode(tag, attrs, content);

const createTokenizer = (input, onToken) => new Tokenizer(input, { onToken });

/**
 * @private
 * @param token
 * @return {*}
 */
const isTagNested = token => tokenizer.isTokenNested(token);

/**
 * @private
 * @return {TagNode}
 */
const getTagNode = () => (tagNodes.length ? tagNodes[tagNodes.length - 1] : null);

/**
 * @private
 * @param {Token} token
 * @return {Array}
 */
const createTagNode = token => tagNodes.push(newTagNode(token.getValue()));
/**
 * @private
 * @param {Token} token
 * @return {Array}
 */
const createTagNodeAttrName = token => tagNodesAttrName.push(token.getValue());

/**
 * @private
 * @return {Array}
 */
const getTagNodeAttrName = () =>
  (tagNodesAttrName.length ? tagNodesAttrName[tagNodesAttrName.length - 1] : getTagNode().tag);

/**
 * @private
 * @return {Array}
 */
const clearTagNodeAttrName = () => {
  if (tagNodesAttrName.length) {
    tagNodesAttrName.pop();
  }
};

/**
 * @private
 * @return {Array}
 */
const clearTagNode = () => {
  if (tagNodes.length) {
    tagNodes.pop();

    clearTagNodeAttrName();
  }
};

/**
 * @private
 * @return {Array}
 */
const getNodes = () => {
  if (nestedNodes.length) {
    const nestedNode = nestedNodes[nestedNodes.length - 1];
    return nestedNode.content;
  }

  return nodes;
};

/**
 * @private
 * @param tag
 */
const appendNode = (tag) => {
  getNodes().push(tag);
};

/**
 * @private
 * @param value
 * @return {boolean}
 */
const isAllowedTag = (value) => {
  if (options.onlyAllowTags && options.onlyAllowTags.length) {
    return options.onlyAllowTags.indexOf(value) >= 0;
  }

  return true;
};
/**
 * @private
 * @param {Token} token
 */
const handleTagStart = (token) => {
  if (token.isStart()) {
    createTagNode(token);

    if (isTagNested(token)) {
      nestedNodes.push(getTagNode());
    } else {
      appendNode(getTagNode());
      clearTagNode();
    }
  }
};

/**
 * @private
 * @param {Token} token
 */
const handleTagEnd = (token) => {
  if (token.isEnd()) {
    clearTagNode();

    const lastNestedNode = nestedNodes.pop();

    if (lastNestedNode) {
      appendNode(lastNestedNode);
    } else if (options.onError) {
      const tag = token.getValue();
      const line = token.getLine();
      const column = token.getColumn();
      options.onError({
        message: `Inconsistent tag '${tag}' on line ${line} and column ${column}`,
        lineNumber: line,
        columnNumber: column,
      });
    }
  }
};

/**
 * @private
 * @param {Token} token
 */
const handleTagToken = (token) => {
  if (token.isTag()) {
    if (isAllowedTag(token.getName())) {
      // [tag]
      handleTagStart(token);

      // [/tag]
      handleTagEnd(token);
    } else {
      appendNode(token.toString());
    }
  }
};

/**
 * @private
 * @param {Token} token
 */
const handleTagNode = (token) => {
  const tagNode = getTagNode();

  if (tagNode) {
    if (token.isAttrName()) {
      createTagNodeAttrName(token);
      tagNode.attr(getTagNodeAttrName(), null);
    } else if (token.isAttrValue()) {
      tagNode.attr(getTagNodeAttrName(), token.getValue());
      clearTagNodeAttrName();
    } else if (token.isText()) {
      tagNode.append(token.getValue());
    }
  } else if (token.isText()) {
    appendNode(token.getValue());
  }
};

/**
 * @private
 * @param token
 */
const parseToken = (token) => {
  handleTagToken(token);
  handleTagNode(token);
};

/**
 * @public
 * @return {Array}
 */
const parse = (input, opts = {}) => {
  options = opts;
  tokenizer = (opts.createTokenizer ? opts.createTokenizer : createTokenizer)(input, parseToken);

  nodes = [];
  nestedNodes = [];
  tagNodes = [];
  tagNodesAttrName = [];

  tokens = tokenizer.tokenize();

  return nodes;
};

module.exports = parse;
module.exports.createTagNode = createTagNode;

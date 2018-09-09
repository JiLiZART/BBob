'use strict';

exports.__esModule = true;
exports.parse = exports.createTagNode = undefined;

var _TagNode = require('@bbob/plugin-helper/lib/TagNode');

var _TagNode2 = _interopRequireDefault(_TagNode);

var _lexer = require('./lexer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 * @type {Array}
 */
var nodes = void 0;
/**
 * @private
 * @type {Array}
 */
var nestedNodes = void 0;
/**
 * @private
 * @type {Array}
 */
var tagNodes = void 0;
/**
 * @private
 * @type {Array}
 */
var tagNodesAttrName = void 0;

var options = {};
var tokenizer = null;

// eslint-disable-next-line no-unused-vars
var tokens = null;

var createTokenizer = function createTokenizer(input, onToken) {
  return (0, _lexer.createLexer)(input, { onToken: onToken });
};

/**
 * @private
 * @param token
 * @return {*}
 */
var isTagNested = function isTagNested(token) {
  return tokenizer.isTokenNested(token);
};

/**
 * @private
 * @return {TagNode}
 */
var getTagNode = function getTagNode() {
  return tagNodes.length ? tagNodes[tagNodes.length - 1] : null;
};

/**
 * @private
 * @param {Token} token
 * @return {Array}
 */
var createTagNode = function createTagNode(token) {
  return tagNodes.push(_TagNode2.default.create(token.getValue()));
};
/**
 * @private
 * @param {Token} token
 * @return {Array}
 */
var createTagNodeAttrName = function createTagNodeAttrName(token) {
  return tagNodesAttrName.push(token.getValue());
};

/**
 * @private
 * @return {Array}
 */
var getTagNodeAttrName = function getTagNodeAttrName() {
  return tagNodesAttrName.length ? tagNodesAttrName[tagNodesAttrName.length - 1] : getTagNode().tag;
};

/**
 * @private
 * @return {Array}
 */
var clearTagNodeAttrName = function clearTagNodeAttrName() {
  if (tagNodesAttrName.length) {
    tagNodesAttrName.pop();
  }
};

/**
 * @private
 * @return {Array}
 */
var clearTagNode = function clearTagNode() {
  if (tagNodes.length) {
    tagNodes.pop();

    clearTagNodeAttrName();
  }
};

/**
 * @private
 * @return {Array}
 */
var getNodes = function getNodes() {
  if (nestedNodes.length) {
    var nestedNode = nestedNodes[nestedNodes.length - 1];
    return nestedNode.content;
  }

  return nodes;
};

/**
 * @private
 * @param tag
 */
var appendNode = function appendNode(tag) {
  getNodes().push(tag);
};

/**
 * @private
 * @param value
 * @return {boolean}
 */
var isAllowedTag = function isAllowedTag(value) {
  if (options.onlyAllowTags && options.onlyAllowTags.length) {
    return options.onlyAllowTags.indexOf(value) >= 0;
  }

  return true;
};
/**
 * @private
 * @param {Token} token
 */
var handleTagStart = function handleTagStart(token) {
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
var handleTagEnd = function handleTagEnd(token) {
  if (token.isEnd()) {
    clearTagNode();

    var lastNestedNode = nestedNodes.pop();

    if (lastNestedNode) {
      appendNode(lastNestedNode);
    } else if (options.onError) {
      var tag = token.getValue();
      var line = token.getLine();
      var column = token.getColumn();
      options.onError({
        message: 'Inconsistent tag \'' + tag + '\' on line ' + line + ' and column ' + column,
        lineNumber: line,
        columnNumber: column
      });
    }
  }
};

/**
 * @private
 * @param {Token} token
 */
var handleTagToken = function handleTagToken(token) {
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
var handleTagNode = function handleTagNode(token) {
  var tagNode = getTagNode();

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
var parseToken = function parseToken(token) {
  handleTagToken(token);
  handleTagNode(token);
};

/**
 * @public
 * @return {Array}
 */
var parse = function parse(input) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = opts;
  tokenizer = (opts.createTokenizer ? opts.createTokenizer : createTokenizer)(input, parseToken);

  nodes = [];
  nestedNodes = [];
  tagNodes = [];
  tagNodesAttrName = [];

  tokens = tokenizer.tokenize();

  return nodes;
};

exports.createTagNode = createTagNode;
exports.parse = parse;
exports.default = parse;
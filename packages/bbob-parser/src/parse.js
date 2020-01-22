import TagNode from '@bbob/plugin-helper/lib/TagNode';
import { createLexer } from './lexer';
import { createList } from './utils';

/**
 * @public
 * @param {String} input
 * @param {Object} opts
 * @param {Function} opts.createTokenizer
 * @param {Array<string>} opts.onlyAllowTags
 * @param {String} opts.openTag
 * @param {String} opts.closeTag
 * @param {Boolean} opts.enableEscapeTags
 * @return {Array}
 */
const parse = (input, opts = {}) => {
  const options = opts;

  let tokenizer = null;

  /**
   * Result AST of nodes
   * @private
   * @type {ItemList}
   */
  const nodes = createList();
  /**
   * Temp buffer of nodes that's nested to another node
   * @private
   * @type {ItemList}
   */
  const nestedNodes = createList();
  /**
   * Temp buffer of nodes [tag..]...[/tag]
   * @private
   * @type {ItemList}
   */
  const tagNodes = createList();
  /**
   * Temp buffer of tag attributes
   * @private
   * @type {ItemList}
   */
  const tagNodesAttrName = createList();

  /**
   * Cache for nested tags checks
   * @type {{}}
   */
  const nestedTagsMap = {};

  const isTokenNested = (token) => {
    if (typeof nestedTagsMap[token.getValue()] === 'undefined') {
      nestedTagsMap[token.getValue()] = tokenizer.isTokenNested(token);
    }

    return nestedTagsMap[token.getValue()];
  };

  const isTagNested = (tagName) => !!nestedTagsMap[tagName];

  /**
   * Flushes temp tag nodes and its attributes buffers
   * @private
   * @return {Array}
   */
  const flushTagNodes = () => {
    if (tagNodes.flushLast()) {
      tagNodesAttrName.flushLast();
    }
  };

  /**
   * @private
   * @return {Array}
   */
  const getNodes = () => {
    const lastNestedNode = nestedNodes.getLast();

    return lastNestedNode ? lastNestedNode.content : nodes.toArray();
  };

  /**
   * @private
   * @param {TagNode} tag
   */
  const appendNodes = (tag) => {
    getNodes().push(tag);
  };

  /**
   * @private
   * @param {String} value
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
    flushTagNodes();

    const tagNode = TagNode.create(token.getValue());
    const isNested = isTokenNested(token);

    tagNodes.push(tagNode);

    if (isNested) {
      nestedNodes.push(tagNode);
    } else {
      appendNodes(tagNode);
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const handleTagEnd = (token) => {
    flushTagNodes();

    const lastNestedNode = nestedNodes.flushLast();

    if (lastNestedNode) {
      appendNodes(lastNestedNode);
    } else if (options.onError) {
      const tag = token.getValue();
      const line = token.getLine();
      const column = token.getColumn();

      options.onError({
        message: `Inconsistent tag '${tag}' on line ${line} and column ${column}`,
        tagName: tag,
        lineNumber: line,
        columnNumber: column,
      });
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const handleTag = (token) => {
    // [tag]
    if (token.isStart()) {
      handleTagStart(token);
    }

    // [/tag]
    if (token.isEnd()) {
      handleTagEnd(token);
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const handleNode = (token) => {
    /**
     * @type {TagNode}
     */
    const lastTagNode = tagNodes.getLast();
    const tokenValue = token.getValue();
    const isNested = isTagNested(token);

    if (lastTagNode) {
      if (token.isAttrName()) {
        tagNodesAttrName.push(tokenValue);
        lastTagNode.attr(tagNodesAttrName.getLast(), '');
      } else if (token.isAttrValue()) {
        const attrName = tagNodesAttrName.getLast();

        if (attrName) {
          lastTagNode.attr(attrName, tokenValue);
          tagNodesAttrName.flushLast();
        } else {
          lastTagNode.attr(tokenValue, tokenValue);
        }
      } else if (token.isText()) {
        if (isNested) {
          lastTagNode.append(tokenValue);
        } else {
          appendNodes(tokenValue);
        }
      } else if (token.isTag()) {
        // if tag is not allowed, just past it as is
        appendNodes(token.toString());
      }
    } else if (token.isText()) {
      appendNodes(tokenValue);
    } else if (token.isTag()) {
      // if tag is not allowed, just past it as is
      appendNodes(token.toString());
    }
  };

  /**
   * @private
   * @param {Token} token
   */
  const onToken = (token) => {
    if (token.isTag() && isAllowedTag(token.getName())) {
      handleTag(token);
    } else {
      handleNode(token);
    }
  };

  tokenizer = (opts.createTokenizer ? opts.createTokenizer : createLexer)(input, {
    onToken,
    onlyAllowTags: options.onlyAllowTags,
    openTag: options.openTag,
    closeTag: options.closeTag,
    enableEscapeTags: options.enableEscapeTags,
  });

  // eslint-disable-next-line no-unused-vars
  const tokens = tokenizer.tokenize();

  return nodes.toArray();
};

export { parse };
export default parse;

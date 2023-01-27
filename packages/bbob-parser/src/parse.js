import {
  TagNode, CLOSE_BRAKET, OPEN_BRAKET, isTagNode,
} from '@bbob/plugin-helper';
import { createLexer } from './lexer';
import { createList } from './utils';

/**
 * @public
 * @param {String} input
 * @param {Object} opts
 * @param {Function} opts.createTokenizer
 * @param {Array<string>} opts.onlyAllowTags
 * @param {Array<string>} opts.contextFreeTags
 * @param {Boolean} opts.enableEscapeTags
 * @param {String} opts.openTag
 * @param {String} opts.closeTag
 * @return {Array}
 */
const parse = (input, opts = {}) => {
  const options = opts;
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;

  let tokenizer = null;

  /**
   * Result AST of nodes
   * @private
   * @type {NodeList}
   */
  const nodes = createList();
  /**
   * Temp buffer of nodes that's nested to another node
   * @private
   * @type {NodeList}
   */
  const nestedNodes = createList();
  /**
   * Temp buffer of nodes [tag..]...[/tag]
   * @private
   * @type {NodeList}
   */
  const tagNodes = createList();
  /**
   * Temp buffer of tag attributes
   * @private
   * @type {NodeList}
   */
  const tagNodesAttrName = createList();

  /**
   * Cache for nested tags checks
   */
  const nestedTagsMap = new Set();

  /**
   *
   * @param token
   * @returns {boolean}
   */
  const isTokenNested = (token) => {
    const value = token.getValue();

    if (!nestedTagsMap.has(value) && tokenizer.isTokenNested && tokenizer.isTokenNested(token)) {
      nestedTagsMap.add(value);

      return true;
    }

    return nestedTagsMap.has(value);
  };

  /**
   * @param tagName
   * @returns {boolean}
   */
  const isTagNested = (tagName) => Boolean(nestedTagsMap.has(tagName));

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

    if (lastNestedNode && Array.isArray(lastNestedNode.content)) {
      return lastNestedNode.content;
    }

    return nodes.toArray();
  };

  /**
   * @private
   * @param {string|TagNode} node
   */
  const appendNodes = (node) => {
    const items = getNodes();

    if (Array.isArray(items)) {
      if (isTagNode(node)) {
        if (isAllowedTag(node.tag)) {
          items.push(node.toTagNode());
        } else {
          items.push(node.toTagStart({ openTag, closeTag }));

          if (node.content.length) {
            node.content.forEach((item) => {
              items.push(item);
            });

            items.push(node.toTagEnd({ openTag, closeTag }));
          }
        }
      } else {
        items.push(node);
      }
    }
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
      appendNodes(tagNode, token);
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
      appendNodes(lastNestedNode, token);
    } else if (typeof options.onError === 'function') {
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
    if (token.isTag()) {
      handleTag(token);
    } else {
      handleNode(token);
    }
  };

  tokenizer = (opts.createTokenizer ? opts.createTokenizer : createLexer)(input, {
    onToken,
    openTag,
    closeTag,
    onlyAllowTags: options.onlyAllowTags,
    contextFreeTags: options.contextFreeTags,
    enableEscapeTags: options.enableEscapeTags,
  });

  // eslint-disable-next-line no-unused-vars
  const tokens = tokenizer.tokenize();

  return nodes.toArray();
};

export { parse };
export default parse;

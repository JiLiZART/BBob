import type { NodeContent, TagNodeTree, LexerTokenizer, ParseOptions } from "@bbob/types";

import {
  CLOSE_BRAKET,
  OPEN_BRAKET,
  TagNode,
  isTagNode,
} from "@bbob/plugin-helper";

import { createLexer } from "./lexer";

import type { Token } from "./Token";

class NodeList<Value> {
  private n: Value[];

  constructor() {
    this.n = [];
  }

  last() {
    if (
      Array.isArray(this.n) &&
      this.n.length > 0 &&
      typeof this.n[this.n.length - 1] !== "undefined"
    ) {
      return this.n[this.n.length - 1];
    }

    return null;
  }

  flush() {
    return this.n.length ? this.n.pop() : false;
  }

  push(value: Value) {
    this.n.push(value);
  }

  toArray() {
    return this.n;
  }
}

const createList = <Type>() => new NodeList<Type>();

function parse(input: string, opts: ParseOptions = {}) {
  const options = opts;
  const openTag = options.openTag || OPEN_BRAKET;
  const closeTag = options.closeTag || CLOSE_BRAKET;
  const onlyAllowTags = (options.onlyAllowTags || [])
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
  const caseSensitiveTags = options.caseFreeTags || false;

  let tokenizer: LexerTokenizer | null = null;

  /**
   * Result AST of nodes
   * @private
   * @type {NodeList}
   */
  const nodes = createList<TagNode>();
  /**
   * Temp buffer of nodes that's nested to another node
   * @private
   */
  const nestedNodes = createList<NodeContent>();
  /**
   * Temp buffer of nodes [tag..]...[/tag]
   * @private
   * @type {NodeList}
   */
  const tagNodes = createList<TagNode>();
  /**
   * Temp buffer of tag attributes
   * @private
   * @type {NodeList}
   */
  const tagNodesAttrName = createList<string>();

  /**
   * Cache for nested tags checks
   */
  const nestedTagsMap = new Set<string>();

  function isTokenNested(token: Token) {
    const value = token.getValue();
    const { isTokenNested } = tokenizer || {};

    if (!nestedTagsMap.has(value) && isTokenNested && isTokenNested(token)) {
      nestedTagsMap.add(value);

      return true;
    }

    return nestedTagsMap.has(value);
  }

  /**
   * @private
   */
  function isTagNested(tagName: string) {
    return Boolean(nestedTagsMap.has(tagName));
  }

  /**
   * @private
   */
  function isAllowedTag(value: string) {
    if (onlyAllowTags.length) {
      return onlyAllowTags.indexOf(value.toLowerCase()) >= 0;
    }

    return true;
  }

  /**
   * Flushes temp tag nodes and its attributes buffers
   * @private
   */
  function flushTagNodes() {
    if (tagNodes.flush()) {
      tagNodesAttrName.flush();
    }
  }

  /**
   * @private
   */
  function getNodes() {
    const lastNestedNode = nestedNodes.last();

    if (lastNestedNode && isTagNode(lastNestedNode)) {
      return lastNestedNode.content;
    }

    return nodes.toArray();
  }

  /**
   * @private
   */
  function appendNodeAsString(
    nodes?: TagNodeTree,
    node?: TagNode,
    isNested = true
  ) {
    if (Array.isArray(nodes) && typeof node !== "undefined") {
      nodes.push(node.toTagStart({ openTag, closeTag }));

      if (Array.isArray(node.content) && node.content.length) {
        node.content.forEach((item) => {
          nodes.push(item);
        });

        if (isNested) {
          nodes.push(node.toTagEnd({ openTag, closeTag }));
        }
      }
    }
  }

  /**
   * @private
   */
  function appendNodes(nodes?: TagNodeTree, node?: NodeContent) {
    if (Array.isArray(nodes) && typeof node !== "undefined") {
      if (isTagNode(node)) {
        if (isAllowedTag(node.tag)) {
          nodes.push(node.toTagNode());
        } else {
          appendNodeAsString(nodes, node);
        }
      } else {
        nodes.push(node);
      }
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function handleTagStart(token: Token) {
    flushTagNodes();

    const tagNode = TagNode.create(token.getValue(), {}, [], { from: token.getStart(), to: token.getEnd() });
    const isNested = isTokenNested(token);

    tagNodes.push(tagNode);

    if (isNested) {
      nestedNodes.push(tagNode);
    } else {
      const nodes = getNodes();
      appendNodes(nodes, tagNode);
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function handleTagEnd(token: Token) {
    const lastTagNode = nestedNodes.last();
    if (isTagNode(lastTagNode)) {
      lastTagNode.setEnd({ from: token.getStart(), to: token.getEnd() });
    }
    flushTagNodes();

    const lastNestedNode = nestedNodes.flush();

    if (lastNestedNode) {
      const nodes = getNodes();
      appendNodes(nodes, lastNestedNode);
    } else if (typeof options.onError === "function") {
      const tag = token.getValue();
      const line = token.getLine();
      const column = token.getColumn();

      options.onError({
        tagName: tag,
        lineNumber: line,
        columnNumber: column,
      });
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function handleTag(token: Token) {
    // [tag]
    if (token.isStart()) {
      handleTagStart(token);
    }

    // [/tag]
    if (token.isEnd()) {
      handleTagEnd(token);
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function handleNode(token: Token) {
    /**
     * @type {TagNode}
     */
    const activeTagNode = tagNodes.last();
    const tokenValue = token.getValue();
    const isNested = isTagNested(token.toString());
    const nodes = getNodes();

    if (activeTagNode !== null) {
      if (token.isAttrName()) {
        tagNodesAttrName.push(tokenValue);
        const attrName = tagNodesAttrName.last();

        if (attrName) {
          activeTagNode.attr(attrName, "");
        }
      } else if (token.isAttrValue()) {
        const attrName = tagNodesAttrName.last();

        if (attrName) {
          activeTagNode.attr(attrName, tokenValue);
          tagNodesAttrName.flush();
        } else {
          activeTagNode.attr(tokenValue, tokenValue);
        }
      } else if (token.isText()) {
        if (isNested) {
          activeTagNode.append(tokenValue);
        } else {
          appendNodes(nodes, tokenValue);
        }
      } else if (token.isTag()) {
        // if tag is not allowed, just pass it as is
        appendNodes(nodes, token.toString());
      }
    } else if (token.isText()) {
      appendNodes(nodes, tokenValue);
    } else if (token.isTag()) {
      // if tag is not allowed, just pass it as is
      appendNodes(nodes, token.toString());
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function onToken(token: Token) {
    if (token.isTag()) {
      handleTag(token);
    } else {
      handleNode(token);
    }
  }

  const lexer = opts.createTokenizer ? opts.createTokenizer : createLexer;

  tokenizer = lexer(input, {
    onToken,
    openTag,
    closeTag,
    onlyAllowTags: options.onlyAllowTags,
    contextFreeTags: options.contextFreeTags,
    enableEscapeTags: options.enableEscapeTags,
  });

  // eslint-disable-next-line no-unused-vars
  const tokens = tokenizer.tokenize();

  // handles situations where we open tag, but forgot close them
  // for ex [q]test[/q][u]some[/u][q]some [u]some[/u] // forgot to close [/q]
  // so we need to flush nested content to nodes array
  const lastNestedNode = nestedNodes.flush();
  if (
    lastNestedNode !== null &&
    lastNestedNode &&
    isTagNode(lastNestedNode) &&
    isTagNested(lastNestedNode.tag)
  ) {
    appendNodeAsString(getNodes(), lastNestedNode, false);
  }

  return nodes.toArray();
}

export { parse };
export default parse;

import type { NodeContent, ParseOptions, TagNodeTree } from "@bbob/types";

import { CLOSE_BRAKET, isTagNode, OPEN_BRAKET, TagNode, } from "@bbob/plugin-helper";

import { createLexer } from "./lexer.js";

import { Token, TYPE_ATTR_NAME, TYPE_ATTR_VALUE, TYPE_NEW_LINE, TYPE_SPACE, TYPE_TAG, TYPE_WORD } from "./Token.js";

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
  const caseFreeTags = options.caseFreeTags || false;

  let tokenizer: ReturnType<typeof createLexer> | null = null;

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

  function getValue(tokenValue: string) {
    return caseFreeTags ? tokenValue.toLowerCase() : tokenValue;
  }

  function isTokenNested(token: Token) {
    const tokenValue = token.getValue();
    const value = getValue(tokenValue);
    const { isTokenNested } = tokenizer || {};

    if (!nestedTagsMap.has(value) && typeof isTokenNested === "function") {
      if (isTokenNested(value)) {
        nestedTagsMap.add(value);

        return true;
      }
    }

    return nestedTagsMap.has(value);
  }

  /**
   * @private
   */
  function isTagNested(tagName: string) {
    return Boolean(nestedTagsMap.has(getValue(tagName)));
  }

  /**
   * @private
   */
  function isTagAllowed(value: string) {
    if (onlyAllowTags.length) {
      return onlyAllowTags.indexOf(value.toLowerCase()) >= 0;
    }

    return true;
  }

  /**
   * Flushes temp tag nodes and its attributes buffers
   * @private
   */
  function tagNodesFlush() {
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
  function nodesAppendAsString(
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
  function nodesAppend(nodes?: TagNodeTree, node?: NodeContent) {
    if (Array.isArray(nodes) && typeof node !== "undefined") {
      if (isTagNode(node)) {
        if (isTagAllowed(node.tag)) {
          nodes.push(node.toTagNode());
        } else {
          nodesAppendAsString(nodes, node);
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
  function tagHandleStart(token: Token) {
    tagNodesFlush();

    const tagNode = TagNode.create(token.getValue(), {}, [], { from: token.getStart(), to: token.getEnd() });
    const isNested = isTokenNested(token);

    tagNodes.push(tagNode);

    if (isNested) {
      nestedNodes.push(tagNode);
    } else {
      const nodes = getNodes();
      nodesAppend(nodes, tagNode);
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function tagHandleEnd(token: Token) {
    const tagName = token.getValue().slice(1);
    const lastNestedNode = nestedNodes.flush();

    tagNodesFlush();

    if (lastNestedNode) {
      const nodes = getNodes()

      if (isTagNode(lastNestedNode)) {
        lastNestedNode.setEnd({ from: token.getStart(), to: token.getEnd() });
      }

      nodesAppend(nodes, lastNestedNode);
    } else if (!isTagNested(tagName)) { // when we have only close tag [/some] without any open tag
      const nodes = getNodes();

      nodesAppend(nodes, token.toString({ openTag, closeTag }));
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
  function nodeHandle(token: Token) {
    /**
     * @type {TagNode}
     */
    const activeTagNode = tagNodes.last();
    const tokenValue = token.getValue();
    const isNested = isTagNested(token.toString());
    const nodes = getNodes();

    if (activeTagNode !== null) {
      switch (token.type) {
        case TYPE_ATTR_NAME:
          tagNodesAttrName.push(tokenValue);
          const attrName = tagNodesAttrName.last();

          if (attrName) {
            activeTagNode.attr(attrName, "");
          }
          break;
        case TYPE_ATTR_VALUE:
          const attrValName = tagNodesAttrName.last();

          if (attrValName) {
            activeTagNode.attr(attrValName, tokenValue);
            tagNodesAttrName.flush();
          } else {
            activeTagNode.attr(tokenValue, tokenValue);
          }
          break;
        case TYPE_SPACE:
        case TYPE_NEW_LINE:
        case TYPE_WORD:
          if (isNested) {
            activeTagNode.append(tokenValue);
          } else {
            nodesAppend(nodes, tokenValue);
          }
          break;

        case TYPE_TAG:
          // if tag is not allowed, just pass it as is
          nodesAppend(nodes, token.toString({ openTag, closeTag }));
          break;
      }
    } else if (token.isText()) {
      nodesAppend(nodes, tokenValue);
    } else if (token.isTag()) {
      // if tag is not allowed, just pass it as is
      nodesAppend(nodes, token.toString({ openTag, closeTag }));
    }
  }

  /**
   * @private
   * @param {Token} token
   */
  function onToken(token: Token) {
    if (token.isTag()) {
      // [tag]
      if (token.isStart()) {
        tagHandleStart(token);
      }

      // [/tag]
      if (token.isEnd()) {
        tagHandleEnd(token);
      }
    } else {
      nodeHandle(token);
    }
  }

  const lexer = opts.createTokenizer ? opts.createTokenizer : createLexer;

  tokenizer = lexer(input, {
    onToken,
    openTag,
    closeTag,
    onlyAllowTags: options.onlyAllowTags,
    contextFreeTags: options.contextFreeTags,
    caseFreeTags: options.caseFreeTags,
    enableEscapeTags: options.enableEscapeTags,
    whitespaceInTags: options.whitespaceInTags,
  });

  // eslint-disable-next-line no-unused-vars
  const tokens = tokenizer.tokenize();

  // handles situations where we open tag, but forgot close them
  // for ex [q]test[/q][u]some[/u][q]some [u]some[/u] // forgot to close [/q]
  // so we need to flush nested content to nodes array
  const lastNestedNode = nestedNodes.flush();
  if (isTagNode(lastNestedNode) && isTagNested(lastNestedNode.tag)) {
    nodesAppendAsString(getNodes(), lastNestedNode, false);
  }

  return nodes.toArray();
}

export { parse };
export default parse;

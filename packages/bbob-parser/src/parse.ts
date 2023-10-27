import {
    CLOSE_BRAKET,
    OPEN_BRAKET,
    TagNode,
    isTagNode,
} from '@bbob/plugin-helper';

import { createLexer } from './lexer';
import { createList } from './utils';

import type { LexerTokenizer, LexerOptions } from './lexer';
import type { Token } from './Token';

type ParseError = {
    message: string
    tagName: string,
    lineNumber: number,
    columnNumber: number,
}

export type ParseOptions = {
    createTokenizer?: (input: string, options?: LexerOptions) => LexerTokenizer
    openTag?: string
    closeTag?: string
    onlyAllowTags?: string[]
    contextFreeTags?: string[]
    enableEscapeTags?: boolean
    onError?: (error: ParseError) => void
}

function parse<TagName = string, AttrValue = unknown>(input: string, opts: ParseOptions = {}) {
    const options = opts;
    const openTag = options.openTag || OPEN_BRAKET;
    const closeTag = options.closeTag || CLOSE_BRAKET;
    const onlyAllowTags = (options.onlyAllowTags || [])
        .filter(Boolean)
        .map((tag) => tag.toLowerCase());

    let tokenizer: LexerTokenizer | null = null;

    /**
     * Result AST of nodes
     * @private
     * @type {NodeList}
     */
    const nodes = createList<TagNode<TagName, AttrValue>>();
    /**
     * Temp buffer of nodes that's nested to another node
     * @private
     */
    const nestedNodes = createList<TagNode<TagName, AttrValue>>();
    /**
     * Temp buffer of nodes [tag..]...[/tag]
     * @private
     * @type {NodeList}
     */
    const tagNodes = createList<TagNode<TagName, AttrValue>>();
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
        const { isTokenNested } = tokenizer || {}

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
        return Boolean(nestedTagsMap.has(tagName))
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
        if (tagNodes.flushLast()) {
            tagNodesAttrName.flushLast();
        }
    }

    /**
     * @private
     */
    function getNodes() {
        const lastNestedNode = nestedNodes.getLast();

        if (lastNestedNode && isTagNode(lastNestedNode)) {
            return lastNestedNode.content;
        }

        return nodes.toArray();
    }

    /**
     * @private
     */
    function appendNodeAsString(node: TagNode, isNested = true) {
        const items = getNodes();

        if (Array.isArray(items)) {
            items.push(node.toTagStart({ openTag, closeTag }));

            if (node.content.length) {
                node.content.forEach((item) => {
                    items.push(item);
                });

                if (isNested) {
                    items.push(node.toTagEnd({ openTag, closeTag }));
                }
            }
        }
    }

    /**
     * @private
     */
    function appendNodes(node: TagNode | string) {
        const items = getNodes();

        if (Array.isArray(items)) {
            if (isTagNode(node)) {
                if (isAllowedTag(node.tag)) {
                    items.push(node.toTagNode());
                } else {
                    appendNodeAsString(node);
                }
            } else {
                items.push(node);
            }
        }
    }

    /**
     * @private
     * @param {Token} token
     */
    function handleTagStart(token: Token) {
        flushTagNodes();

        const tagNode = TagNode.create<TagName, AttrValue>(token.getValue());
        const isNested = isTokenNested(token);

        tagNodes.push(tagNode);

        if (isNested) {
            nestedNodes.push(tagNode);
        } else {
            appendNodes(tagNode);
        }
    }

    /**
     * @private
     * @param {Token} token
     */
    function handleTagEnd(token: Token) {
        flushTagNodes();

        const lastNestedNode = nestedNodes.flushLast();

        if (lastNestedNode) {
            appendNodes(lastNestedNode);
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
        const lastTagNode = tagNodes.getLast();
        const tokenValue = token.getValue();
        const isNested = isTagNested(token.toString());

        if (lastTagNode !== null) {
            if (token.isAttrName()) {
                tagNodesAttrName.push(tokenValue);
                const last = tagNodesAttrName.getLast()

                if (last) {
                    lastTagNode.attr(last, '' as AttrValue);
                }
            } else if (token.isAttrValue()) {
                const attrName = tagNodesAttrName.getLast();

                if (attrName) {
                    lastTagNode.attr(attrName, tokenValue as AttrValue);
                    tagNodesAttrName.flushLast();
                } else {
                    lastTagNode.attr(tokenValue, tokenValue as AttrValue);
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

    // handles situations where we open tag, but forgot close them
    // for ex [q]test[/q][u]some[/u][q]some [u]some[/u] // forgot to close [/q]
    // so we need to flush nested content to nodes array
    const lastNestedNode = nestedNodes.flushLast();
    if (lastNestedNode && isTagNested(lastNestedNode.tag)) {
        appendNodeAsString(lastNestedNode, false);
    }

    return nodes.toArray();
}

export { parse };
export default parse;

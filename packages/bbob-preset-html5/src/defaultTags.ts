/* eslint-disable no-plusplus,no-lonely-if */
import {
  getUniqAttr,
  isStringNode,
  isTagNode,
  TagNode,
} from "@bbob/plugin-helper";
import type { NodeContent, TagNodeTree, TagNodeObject } from "@bbob/plugin-helper";
import type { PresetTagsDefinition } from "@bbob/preset";
import type { BBobPluginOptions } from "@bbob/core";

const isStartsWith = (node: string, type: string) => node[0] === type;

const styleAttrs = (attrs?: Record<string, unknown>) => {
  const values = attrs || {}

  return Object.keys(values)
    .reduce<string[]>((acc, key: "color" | "size") => {
      const value = values[key];

      if (typeof value === "string") {
        if (key === "color") {
          return acc.concat(`color:${value};`);
        }

        if (key === "size") {
          return acc.concat(`font-size:${value};`);
        }
      }

      return acc;
    }, [])
    .join(" ");
};

export const toListNodes = (content?: TagNodeTree) => {
  if (content && Array.isArray(content)) {
    return content.reduce<NodeContent[]>((acc, node) => {
      const listItem = acc[acc.length - 1];

      // *Entry
      if (isStringNode(node) && isStartsWith(String(node), "*")) {
        // from '*Entry' to 'Entry'
        const content = String(node).slice(1)

        acc.push(TagNode.create("li", {}, [content]));

        return acc
      }

      // { tag: '*', attrs: {}, content: [] }
      if (isTagNode(node) && TagNode.isOf(node, "*")) {
        acc.push(TagNode.create("li", {}, []));

        return acc
      }

      if (!isTagNode(listItem)) {
        acc.push(node);
        return acc
      }

      if (listItem && isTagNode(listItem) && Array.isArray(listItem.content)) {
        listItem.content = listItem.content.concat(node);

        return acc
      }

      acc.push(node);

      return acc
    }, []);
  }

  return content
};

const renderUrl = (node: TagNodeObject, render: BBobPluginOptions["render"]) =>
  getUniqAttr(node.attrs)
    ? getUniqAttr(node.attrs)
    : render(node.content || []);

const toNode = (
  tag: string,
  attrs: Record<string, unknown>,
  content?: TagNodeTree
) => TagNode.create(tag, attrs, content);

const toStyle = (style: string) => ({ style });

export const defineStyleNode = (tag: string, style: string) => (node: TagNodeObject) => toNode(tag, toStyle(style), node.content)

export const defaultTags = (function createTags() {
  const tags: PresetTagsDefinition<string> = {
    b: defineStyleNode("span", "font-weight: bold;"),
    i: defineStyleNode("span", "font-style: italic;"),
    u: defineStyleNode("span", "text-decoration: underline;"),
    s: defineStyleNode("span", "text-decoration: line-through;"),
    url: (node, { render }) =>
        toNode(
            "a",
            {
              href: renderUrl(node, render),
            },
            node.content
        ),
    img: (node, { render }) =>
        toNode(
            "img",
            {
              src: render(node.content),
            },
            null
        ),
    quote: (node) => toNode("blockquote", {}, [toNode("p", {}, node.content)]),
    code: (node) => toNode("pre", {}, node.content),
    style: (node) =>
        toNode("span", toStyle(styleAttrs(node.attrs)), node.content),
    list: (node) => {
      const type = getUniqAttr(node.attrs);

      return toNode(
          type ? "ol" : "ul",
          type ? { type } : {},
          toListNodes(node.content)
      );
    },
    color: (node) =>
        toNode("span", toStyle(`color: ${getUniqAttr(node.attrs)};`), node.content),
  }

  return tags
})();

export default defaultTags;

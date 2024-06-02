/* eslint-disable no-use-before-define */
import React, { ReactNode } from "react";
import { render as htmlrender } from "@bbob/html";
import core from "@bbob/core";

import {
  isTagNode,
  isStringNode,
  isEOL,
  TagNode,
} from "@bbob/plugin-helper";

import type {
  BBobCoreOptions,
  BBobCoreTagNodeTree,
  BBobPlugins,
  TagNodeTree,
} from "@bbob/types";

const toAST = (
  source: string,
  plugins?: BBobPlugins,
  options?: BBobCoreOptions
) =>
  core(plugins).process(source, {
    ...options,
    render: (input) => htmlrender(input, { stripTags: true }),
  }).tree;

const isContentEmpty = (content: TagNodeTree) => {
  if (!content) {
    return true;
  }

  if (typeof content === "number") {
    return String(content).length === 0;
  }

  return Array.isArray(content) ? content.length === 0 : !content;
};

function tagToReactElement(node: TagNode, index: number) {
  return React.createElement(
    node.tag,
    { ...node.attrs, key: index },
    isContentEmpty(node.content) ? null : renderToReactNodes(node.content)
  );
}

function renderToReactNodes(nodes?: BBobCoreTagNodeTree | TagNodeTree) {
  if (nodes && Array.isArray(nodes) && nodes.length) {
    return nodes.reduce<ReactNode[]>((arr, node, index) => {
      if (isTagNode(node)) {
        arr.push(tagToReactElement(node, index));
        return arr;
      }

      if (isStringNode(node)) {
        if (isEOL(String(node))) {
          arr.push(node);
          return arr;
        }

        const lastIdx = arr.length - 1;
        const prevArr = arr; // stupid eslint
        const prevNode = lastIdx >= 0 ? prevArr[lastIdx] : null;

        if (prevArr[lastIdx] && prevNode !== null && !isEOL(String(prevNode))) {
          prevArr[lastIdx] += String(node);

          return prevArr;
        }

        arr.push(node);
      }

      return arr;
    }, []);
  }
  return [];
}

function render(
  source: string,
  plugins?: BBobPlugins,
  options?: BBobCoreOptions
) {
  return renderToReactNodes(toAST(source, plugins, options));
}

export { render };
export default render;

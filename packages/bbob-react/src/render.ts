/* eslint-disable no-use-before-define */
import React, { ReactNode } from 'react';
import { render as htmlrender } from '@bbob/html';
import core, { BBobCoreOptions, BBobCoreTagNodeTree, BBobPlugins } from '@bbob/core';

import { isTagNode, isEOL, TagNode, TagNodeTree } from '@bbob/plugin-helper';

const toAST = (source: string, plugins?: BBobPlugins, options?: BBobCoreOptions) => core(plugins)
  .process(source, {
    ...options,
    render: (input) => htmlrender(input, { stripTags: true }),
  }).tree;

const isContentEmpty = (content: TagNodeTree) => {
  if (!content) {
    return true
  }

  if (typeof content === 'number') {
    return String(content).length === 0
  }

  return Array.isArray(content) ? content.length === 0 : !content;
};

function tagToReactElement(node: TagNode, index: number) {
  return React.createElement(
    node.tag,
    { ...node.attrs, key: index },
    isContentEmpty(node.content) ? null : renderToReactNodes(node.content),
  );
}

function renderToReactNodes(nodes: BBobCoreTagNodeTree | TagNodeTree) {
  if (Array.isArray(nodes) && nodes.length) {
    return nodes.reduce<ReactNode[]>((arr, node, index) => {
      if (isTagNode(node)) {
        arr.push(tagToReactElement(node, index));
        return arr;
      }

      if (isEOL(node)) {
        arr.push(node);
        return arr;
      }

      const lastIdx = arr.length - 1;
      const prevNode = lastIdx >= 0 ? arr[lastIdx] : null;

      if (prevNode !== null && !isTagNode(prevNode) && !isEOL(prevNode)) {
        const prevArr = arr; // stupid eslint
        prevArr[lastIdx] += node;
        return prevArr;
      }

      arr.push(node);

      return arr;
    }, []);
  }
  return []
}

function render(source: string, plugins?: BBobPlugins, options?: BBobCoreOptions) {
  return renderToReactNodes(toAST(source, plugins, options));
}

export { render };
export default render;

/* eslint-disable no-use-before-define */
import React from 'react';
import core from '@bbob/core';
import * as html from '@bbob/html';

import { isTagNode, isEOL } from '@bbob/plugin-helper';

const toAST = (source, plugins, options) => core(plugins)
  .process(source, {
    ...options,
    render: (input) => html.render(input, { stripTags: true }),
  }).tree;

const isContentEmpty = (content) => (!content || content.length === 0);

function tagToReactElement(node, index) {
  return React.createElement(
    node.tag,
    { ...node.attrs, key: index },
    isContentEmpty(node.content) ? null : renderToReactNodes(node.content),
  );
}

function renderToReactNodes(nodes) {
  const els = [].concat(nodes).reduce((arr, node, index) => {
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
  return els;
}

function render(source, plugins, options) {
  return renderToReactNodes(toAST(source, plugins, options));
}

export { render };
export default render;

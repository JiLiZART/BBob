import React from 'react';
import core from '@bbob/core';
import * as html from '@bbob/html';

import { isTagNode, isStringNode } from '@bbob/plugin-helper';

const toAST = (source, plugins) => core(plugins)
  .process(source, {
    render: input => html.render(input, { stripTags: true }),
  }).tree;

function tagToReactElement(node) {
  return React.createElement(
    node.tag,
    node.attrs,
    // eslint-disable-next-line no-use-before-define
    node.content ? renderToReactNodes(node.content) : null,
  );
}

function renderToReactNodes(nodes) {
  const els = [].concat(nodes).reduce((arr, node) => {
    if (isTagNode(node)) {
      arr.push(tagToReactElement(node));
    } else if (isStringNode(node)) {
      arr.push(node);
    }

    return arr;
  }, []);

  return els;
}

function render(source, plugins) {
  return renderToReactNodes(toAST(source, plugins));
}

export { render };
export default render;

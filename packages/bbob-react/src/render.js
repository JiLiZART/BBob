/* eslint-disable no-use-before-define */
import React from 'react';
import core from '@bbob/core';
import * as html from '@bbob/html';

import { isTagNode, isStringNode } from '@bbob/plugin-helper';

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
  var content = '';
  var els = [].concat(nodes).reduce(function(arr, node, index) {
      if ((0, _pluginHelper.isTagNode)(node)) {
          if (content !== '') {
              arr.push(content);
              content = '';
          }
          arr.push(tagToReactElement(node, index));
      } else if ((0, _pluginHelper.isStringNode)(node)) {
          if (content === '') {
              content = node;
          } else {
              content += node;
          }
      }
      if (index === nodes.length - 1 && content !== '') {
          arr.push(content);
      }
      return arr;
  }, []);
  return els;
}

function render(source, plugins, options) {
  return renderToReactNodes(toAST(source, plugins, options));
}

export { render };
export default render;

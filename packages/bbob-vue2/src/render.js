/* eslint-disable no-use-before-define,import/prefer-default-export */
import core from '@bbob/core';
import * as html from '@bbob/html';

import { isStringNode, isTagNode } from '@bbob/plugin-helper';

const toAST = (source, plugins, options) => core(plugins)
  .process(source, {
    ...options,
    render: (input) => html.render(input, { stripTags: true }),
  }).tree;

const isContentEmpty = (content) => (!content || content.length === 0);

function tagToVueNode(createElement, node, index) {
  const { class: className, style, ...domProps } = node.attrs || {};

  return createElement(
    node.tag,
    {
      key: index,
      class: className,
      style,
      domProps,
    },
    isContentEmpty(node.content) ? null : renderToVueNodes(createElement, node.content),
  );
}

function renderToVueNodes(createElement, nodes) {
  return [].concat(nodes).reduce((arr, node, index) => {
    if (isTagNode(node)) {
      arr.push(tagToVueNode(createElement, node, index));
    } else if (isStringNode(node)) {
      arr.push(node);
    }

    return arr;
  }, []);
}

/**
 * Converts string to Vue 2 VNodes
 * @param createElement {CreateElement}
 * @param source {String}
 * @param plugins {Array<Function>}
 * @param options {Object}
 * @returns {Array<VNode>}
 */
export function render(createElement, source, plugins, options) {
  return renderToVueNodes(createElement, toAST(source, plugins, options));
}

/* eslint-disable no-use-before-define,import/prefer-default-export */
import core, { BBobPlugins, BBobCoreOptions } from '@bbob/core';
import * as html from '@bbob/html';

import { isStringNode, isTagNode } from '@bbob/plugin-helper';
import type { TagNodeTree, TagNode } from "@bbob/plugin-helper";
import type { CreateElement, VNodeChildrenArrayContents } from 'vue';
import type { StyleValue } from 'vue/types/jsx';

const toAST = (source: string, plugins: BBobPlugins = [], options: BBobCoreOptions = {}) => core(plugins)
  .process(source, {
    ...options,
    render: (input) => html.render(input, { stripTags: true }),
  }).tree;

const isContentEmpty = (content: TagNodeTree) => (!content || Array.isArray(content) && content?.length === 0);

function tagToVueNode(createElement: CreateElement, node: TagNode, index: number) {
  const { class: className, style, ...domProps } = node.attrs || {};

  return createElement(
    node.tag,
    {
      key: index,
      class: className,
      style: style as StyleValue,
      domProps,
    },
    isContentEmpty(node.content) ? null : renderToVueNodes(createElement, node.content),
  );
}

function renderToVueNodes(createElement: CreateElement, nodes: TagNodeTree) {
  if (Array.isArray(nodes)) {
    return nodes.reduce((arr, node, index) => {
      if (isTagNode(node)) {
        arr.push(tagToVueNode(createElement, node, index));
      } else if (isStringNode(node)) {
        arr.push(String(node));
      }
  
      return arr;
    }, [] as VNodeChildrenArrayContents);
  }
}

/**
 * Converts string to Vue 2 VNodes
 * @param createElement {CreateElement}
 * @param source {String}
 * @param plugins {Array<Function>}
 * @param options {Object}
 * @returns {Array<VNode>}
 */
export function render(createElement: CreateElement, source: string, plugins?: BBobPlugins, options?: BBobCoreOptions) {
  return renderToVueNodes(createElement, toAST(source, plugins, options));
}

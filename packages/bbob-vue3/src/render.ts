/* eslint-disable no-use-before-define,import/prefer-default-export */
import core from "@bbob/core";
import * as html from "@bbob/html";
import { h, VNodeArrayChildren } from "vue";

import type { BBobCoreOptions, BBobPlugins, TagNodeTree } from "@bbob/types";

import {
  TagNode,
  isStringNode,
  isTagNode,
} from "@bbob/plugin-helper";

type CreateElement = typeof h;

const toAST = (
  source: string,
  plugins?: BBobPlugins,
  options?: BBobCoreOptions
) =>
  core(plugins).process(source, {
    ...options,
    render: (input) => html.render(input, { stripTags: true }),
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

function tagToVueNode(
  createElement: CreateElement,
  node: TagNode,
  index: number
) {
  const { class: className, style, ...domProps } = node.attrs;

  return createElement(
    node.tag,
    {
      key: index,
      class: className,
      style,
      ...domProps,
    },
      isContentEmpty(node.content) ? undefined : renderToVueNodes(createElement, node.content),
  );
}

function renderToVueNodes(
  createElement: CreateElement,
  nodes: TagNodeTree
): VNodeArrayChildren {
  if (Array.isArray(nodes) && nodes.length) {
    return nodes.reduce((arr, node, index) => {
      if (isTagNode(node)) {
        arr.push(tagToVueNode(createElement, node, index));
      } else if (isStringNode(node)) {
        arr.push(String(node));
      }

      return arr;
    }, [] as VNodeArrayChildren);
  }

  return [];
}

/**
 * Converts string to Vue 3 VNodes
 * @param createElement {CreateElement}
 * @param source {String}
 * @param plugins {Array<Function>}
 * @param options {Object}
 * @returns {Array<VNode>}
 */
export function render(
  createElement: CreateElement,
  source: string,
  plugins?: BBobPlugins,
  options?: BBobCoreOptions
) {
  return renderToVueNodes(createElement, toAST(source, plugins, options));
}

import core, { BBobCoreOptions, BBobPlugins } from '@bbob/core';
import { attrsToString, isTagNode, TagNode, TagNodeTree } from '@bbob/plugin-helper';

const SELFCLOSE_END_TAG = '/>';
const CLOSE_START_TAG = '</';
const START_TAG = '<';
const END_TAG = '>';

export type BBobHTMLOptions = {
  stripTags?: boolean
} & BBobCoreOptions

function renderNode(node?: TagNodeTree, options?: BBobHTMLOptions): string {
  const { stripTags = false } = options || {}

  if (typeof node === 'undefined' || node === null) {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return renderNodes(node, options);
  }

  if (isTagNode(node)) {
    if (stripTags) {
      return renderNodes(node.content, options);
    }

    const attrs = attrsToString(node.attrs)

    console.log('renderNode', node, attrs);

    if (node.content === null) {
      debugger
      const tag = START_TAG + node.tag + attrs + SELFCLOSE_END_TAG

      console.log('renderNode NULL', tag)

      return tag
    }

    const tag = START_TAG + node.tag + attrs + END_TAG + renderNodes(node.content, options) + CLOSE_START_TAG + node.tag + END_TAG

    console.log('renderNode CLOSE', tag)

    return tag;
  }

  return '';
}

function renderNodes(nodes: TagNodeTree, options?: BBobHTMLOptions): string {
  if (Array.isArray(nodes)) {
    return nodes.reduce<string>((r, node) => r + renderNode(node, options), '')
  }

  if (nodes) {
    return renderNode(nodes, options)
  }

  return ''
}

function toHTML<InputValue = string | TagNode[]>(source: InputValue, plugins: BBobPlugins, options?: BBobHTMLOptions) {
  return core<InputValue, BBobHTMLOptions>(plugins).process(source, { ...options, render: renderNodes }).html
}

export const render = renderNodes;

export default toHTML;

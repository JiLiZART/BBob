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
    return render(node, options);
  }

  if (isTagNode(node)) {
    if (stripTags) {
      return render(node.content, options);
    }

    const attrs = attrsToString(node.attrs)

    if (node.content === null) {
      return START_TAG + node.tag + attrs + SELFCLOSE_END_TAG
    }

    return START_TAG + node.tag + attrs + END_TAG + render(node.content, options) + CLOSE_START_TAG + node.tag + END_TAG;
  }

  return '';
}

export function render(nodes: TagNodeTree, options?: BBobHTMLOptions): string {
  if (Array.isArray(nodes)) {
    return nodes.reduce<string>((r, node) => r + renderNode(node, options), '')
  }

  if (nodes) {
    return renderNode(nodes, options)
  }

  return ''
}

export function html<InputValue = string | TagNode[]>(source: InputValue, plugins: BBobPlugins, options?: BBobHTMLOptions) {
  return core<InputValue, BBobHTMLOptions>(plugins).process(source, { ...options, render: render }).html
}

export default html;

import core from '@bbob/core';
import { attrValue } from '@bbob/plugin-helper';

/**
 * Transforms attrs to html params string
 * @param values
 */
const attrs = values =>
  Object.keys(values)
    .reduce((arr, key) => [...arr, attrValue(key, values[key])], [''])
    .join(' ');

const SELFCLOSE_END_TAG = '/>';
const CLOSE_START_TAG = '</';
const START_TAG = '<';
const END_TAG = '>';

const renderNode = (node, { stripTags = false }) => {
  if (!node) return '';
  const type = typeof node;

  if (type === 'string' || type === 'number') {
    return node;
  }

  if (type === 'object') {
    if (stripTags === true) {
      // eslint-disable-next-line no-use-before-define
      return renderNodes(node.content, { stripTags });
    }

    if (node.content === null) {
      return [START_TAG, node.tag, attrs(node.attrs), SELFCLOSE_END_TAG].join('');
    }

    // eslint-disable-next-line no-use-before-define
    return [START_TAG, node.tag, attrs(node.attrs), END_TAG, renderNodes(node.content), CLOSE_START_TAG, node.tag, END_TAG].join('');
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-use-before-define
    return renderNodes(node, { stripTags });
  }

  return '';
};

const renderNodes = (nodes, { stripTags = false } = {}) => []
  .concat(nodes)
  .reduce((r, node) => r + renderNode(node, { stripTags }), '');

const toHTML = (source, plugins) => core(plugins).process(source, { render: renderNodes }).html;

export const render = renderNodes;
export default toHTML;

/* eslint-disable no-plusplus,no-lonely-if */
import {
    TagNode,
    getUniqAttr,
    isStringNode,
    isTagNode,
} from '@bbob/plugin-helper';

import type { NodeContent } from '@bbob/plugin-helper';
import type { PresetTagsDefinition } from "@bbob/preset";
import type { BbobPluginOptions } from '@bbob/core'

const isStartsWith = (node: string, type: string) => (node[0] === type);

const getStyleFromAttrs = <AttrValue extends string = string>(attrs: Record<string, AttrValue>) => {
    const styleMap = {
        color: (val: string) => `color:${val};`,
        size: (val: string) => `font-size:${val};`,
    };

    return Object
        .keys(attrs)
        .reduce((acc, key: 'color' | 'size') => {
            if (styleMap[key]) {
                const styleFunc = styleMap[key]
                const value = attrs[key]

                return acc.concat(styleFunc(value))
            }

            return acc
        }, [] as string[])
        .join(' ')
};

const asListItems = (content: NodeContent[]): NodeContent[] => {
  let listIdx = 0;
  const listItems = [] as TagNode[];

  const createItemNode = () => TagNode.create('li');
  const ensureListItem = (val: TagNode) => {
    listItems[listIdx] = listItems[listIdx] || val;
  };
  const addItem = (val: NodeContent) => {
    if (listItems[listIdx] && listItems[listIdx].content) {
      listItems[listIdx].content = listItems[listIdx].content.concat(val);
    } else if(Array.isArray(listItems[listIdx])) {
      listItems[listIdx] = listItems[listIdx].concat(val);
    }
  };

  content.forEach((el) => {
    if (isStringNode(el) && isStartsWith(el, '*')) {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
      addItem(el.substr(1));
    } else if (isTagNode(el) && TagNode.isOf(el, '*')) {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
    } else if (!isTagNode(listItems[listIdx])) {
      listIdx++;
      ensureListItem(el);
    } else if (listItems[listIdx]) {
      addItem(el);
    } else {
      ensureListItem(el);
    }
  });

  return [].concat(listItems);
};

const renderUrl = (node: TagNode, render: BbobPluginOptions['render']) => (getUniqAttr(node.attrs)
  ? getUniqAttr(node.attrs)
  : render(node.content));

const toNode = <TagName = string, AttrValue = unknown>(
    tag: string,
    attrs: Record<string, AttrValue>,
    content: NodeContent<TagName, AttrValue>[] = []
) => TagNode.create<TagName, AttrValue>(tag, attrs, content);

const toStyle = (style: string) => ({ style });

const defaultTags: PresetTagsDefinition = {
  b: (node) => toNode('span', toStyle('font-weight: bold;'), node.content),
  i: (node) => toNode('span', toStyle('font-style: italic;'), node.content),
  u: (node) => toNode('span', toStyle('text-decoration: underline;'), node.content),
  s: (node) => toNode('span', toStyle('text-decoration: line-through;'), node.content),
  url: (node, { render }) => toNode('a', {
    href: renderUrl(node, render),
  }, node.content),
  img: (node, { render }) => toNode('img', {
    src: render(node.content),
  }, undefined),
  quote: (node) => toNode('blockquote', {}, [toNode('p', {}, node.content)]),
  code: (node) => toNode('pre', {}, node.content),
  style: (node) => toNode('span', toStyle(getStyleFromAttrs(node.attrs)), node.content),
  list: (node) => {
    const type = getUniqAttr(node.attrs);

    return toNode(type ? 'ol' : 'ul', type ? { type } : {}, asListItems(node.content));
  },
  color: (node) => toNode('span', toStyle(`color: ${getUniqAttr(node.attrs)};`), node.content),
};

export default defaultTags

/* eslint-disable no-plusplus,no-lonely-if */
import type { NodeContent } from '@bbob/plugin-helper';
import { getUniqAttr, isStringNode, isTagNode, TagNode, TagNodeTree, } from '@bbob/plugin-helper';
import type { PresetTagsDefinition } from "@bbob/preset";
import type { BbobPluginOptions } from '@bbob/core'

const isStartsWith = (node: string, type: string) => (node[0] === type);

const getStyleFromAttrs = (attrs: Record<string, unknown>) => {
  return Object
      .keys(attrs)
      .reduce<string[]>((acc, key: 'color' | 'size') => {
        const value = attrs[key]

        if (typeof value === 'string') {
          if (key === 'color') {
            return acc.concat(`color:${value};`)
          }

          if (key === 'size') {
            return acc.concat(`font-size:${value};`)
          }
        }

        return acc
      }, [])
      .join(' ')
};

const asListItems = (content: TagNodeTree): NodeContent[] => {
    let listIdx = 0;
    const listItems = [] as Array<NodeContent>;

    const createItemNode = () => TagNode.create('li');
    const ensureListItem = (val: NodeContent) => {
        listItems[listIdx] = listItems[listIdx] || val;
    };
    const addItem = (val: NodeContent) => {
        const listItem = listItems[listIdx]

        if (listItem && isTagNode(listItem) && Array.isArray(listItem.content)) {
            listItem.content = listItem.content.concat(val);
        }
        // else if (Array.isArray(listItem) && Array.isArray(listItems[listIdx])) {
        //     listItems[listIdx] = listItems[listIdx].concat(val);
        // }
    };

    if (Array.isArray(content)) {
      content.forEach((el) => {
        if (isStringNode(el) && isStartsWith(String(el), '*')) {
          if (listItems[listIdx]) {
            listIdx++;
          }
          ensureListItem(createItemNode());
          addItem(String(el).substr(1));
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
    }

    return listItems;
};

const renderUrl = (node: TagNode, render: BbobPluginOptions['render']) => (getUniqAttr(node.attrs)
    ? getUniqAttr(node.attrs)
    : render(node.content || []));

const toNode = (
    tag: string,
    attrs: Record<string, unknown>,
    content: TagNodeTree
) => TagNode.create(tag, attrs, content);

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
    }, null),
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

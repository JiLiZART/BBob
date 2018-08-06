/* eslint-disable no-plusplus,no-lonely-if */
const isStringNode = node => (typeof node === 'string');
const isStartsWith = (node, type) => (node[0] === type);

const isTagNode = node => (typeof node === 'object' && Boolean(node.tag));
const isTagOf = (node, type) => (node.tag === type);
const createTagNode = tag => ({ tag, attrs: {}, content: [] });

const styleMap = {
  color: val => `color:${val};`,
  size: val => `font-size:${val};`,
};

const getStyleFromAttrs = attrs =>
  Object
    .keys(attrs)
    .reduce((acc, key) => (styleMap[key] ? acc.concat(styleMap[key](attrs[key])) : acc), [])
    .join(' ');

const asListItems = (content) => {
  const listItems = [];
  let listIdx = 0;
  const createItemNode = () => createTagNode('li');
  const ensureListItem = (val) => {
    listItems[listIdx] = listItems[listIdx] || val;
  };
  const addItem = (val) => {
    if (listItems[listIdx] && listItems[listIdx].content) {
      listItems[listIdx].content = listItems[listIdx].content.concat(val);
    } else {
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
    } else if (isTagNode(el) && isTagOf(el, '*')) {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
    } else {
      if (!isTagNode(listItems[listIdx])) {
        listIdx++;
        ensureListItem(el);
      } else if (listItems[listIdx]) {
        addItem(el);
      } else {
        ensureListItem(el);
      }
    }
  });

  return [].concat(listItems);
};

const defaultProcessors = {
  b: node => ({
    tag: 'span',
    attrs: {
      style: 'font-weight: bold;',
    },
    content: node.content,
  }),
  i: node => ({
    tag: 'span',
    attrs: {
      style: 'font-style: italic;',
    },
    content: node.content,
  }),
  u: node => ({
    tag: 'span',
    attrs: {
      style: 'text-decoration: underline;',
    },
    content: node.content,
  }),
  s: node => ({
    tag: 'span',
    attrs: {
      style: 'text-decoration: line-through;',
    },
    content: node.content,
  }),
  url: (node, { render }) => ({
    tag: 'a',
    attrs: {
      href: node.attrs.url ? node.attrs.url : render(node.content),
    },
    content: node.content,
  }),
  img: (node, { render }) => ({
    tag: 'img',
    attrs: {
      src: render(node.content),
    },
    content: null,
  }),
  quote: node => ({
    tag: 'blockquote',
    attrs: {},
    content: [{
      tag: 'p',
      attrs: {},
      content: node.content,
    }],
  }),
  code: node => ({
    tag: 'pre',
    attrs: {},
    content: node.content,
  }),
  style: node => ({
    tag: 'span',
    attrs: {
      style: getStyleFromAttrs(node.attrs),
    },
    content: node.content,
  }),
  list: node => ({
    tag: 'ul',
    attrs: {},
    content: asListItems(node.content),
  }),
};

module.exports = function html5Preset(opts = {}) {
  const processors = Object.assign({}, defaultProcessors, opts.processors || {});

  return function process(tree, core) {
    tree.walk(node => (isTagNode(node) && processors[node.tag]
      ? processors[node.tag](node, core)
      : node));
  };
};

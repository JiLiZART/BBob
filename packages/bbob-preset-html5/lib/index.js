// [b]bolded text[/b] => <span style="font-weight: bold;">bolded text</span>
// [i]italicized text[/i] => <span style="font-style: italic;">italicized text</span>
// [u]underlined text[/u] =>  <span style="text-decoration: underline;">underlined text</span>
// [s]strikethrough text[/s]
// => <span style="text-decoration: line-through;">strikethrough text</span>
// [url]https://en.wikipedia.org[/url] => <a href="https://en.wikipedia.org">https://en.wikipedia.org</a>
// [url=http://step.pgc.edu/]ECAT[/url] => <a href="http://step.pgc.edu/">ECAT</a>
// [img]https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png[/img]
// => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png" />
// [quote="author"]quoted text[/quote] => <blockquote><p>quoted text</p></blockquote>
// [code]monospaced text[/code] => <pre>monospaced text</pre>
// [style size="15px"]Large Text[/style] => <span style="font-size:15px">Large Text</span>
// [style color="red"]Red Text[/style] => <span style="color:red;">Red Text</span>

/**
 [list]
 [*]Entry 1
 [*]Entry 2
 [/list]

 [list]
 *Entry 1
 *Entry 2
 [/list]

 => <ul><li>Entry 1</li><li>Entry 2</li></ul>

 */

/**
 [table]
 [tr]
 [td]table 1[/td]
 [td]table 2[/td]
 [/tr]
 [tr]
 [td]table 3[/td]
 [td]table 4[/td]
 [/tr]
 [/table]
 => <table>
 <tr><td>table 1</td><td>table 2</td></tr>
 <tr><td>table 3</td><td>table 4</td></tr>
 </table>
 */

// [b]bolded text[/b] => <span style="font-weight: bold;">bolded text</span>

const getStyleFromAttrs = (attrs) => {
  const styles = [];

  if (attrs.color) {
    styles.push(`color:${attrs.color};`);
  }

  if (attrs.size) {
    styles.push(`font-size:${attrs.size};`);
  }

  return styles.join(' ');
};

const asListItems = (content) => {
  const listItems = [];
  let listIdx = 0;
  const createItemNode = () => ({ tag: 'li', attrs: {}, content: [] });
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
  content.forEach(el => {
    if (typeof el === 'string' && el[0] === '*') {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
      addItem(el.substr(1));
    } else if (typeof el === 'object' && el.tag && el.tag === '*') {
      if (listItems[listIdx]) {
        listIdx++;
      }
      ensureListItem(createItemNode());
    } else {
      if (listItems[listIdx] && !listItems[listIdx].tag) {
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

const processors = {
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
  return function process(tree, core) {
    tree.walk(node => (node.tag && processors[node.tag]
      ? processors[node.tag](node, core)
      : node));
  };
};

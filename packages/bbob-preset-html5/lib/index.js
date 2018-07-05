// [b]bolded text[/b] => <span style="font-weight: bold;">bolded text</span>
// [i]italicized text[/i] => <span style="font-style: italic;">italicized text</span>
// [u]underlined text[/u] =>  <span style="text-decoration: underline;">underlined text</span>
// [s]strikethrough text[/s] => <span style="text-decoration: line-through;">strikethrough text</span>
// [url]https://en.wikipedia.org[/url] => <a href="https://en.wikipedia.org">https://en.wikipedia.org</a>
// [url=http://step.pgc.edu/]ECAT[/url] => <a href="http://step.pgc.edu/">ECAT</a>
// [img]https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png[/img] => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png" alt="" />
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
 => <table><tr><td>table 1</td><td>table 2</td></tr><tr><td>table 3</td><td>table 4</td></tr></table>
 */

// [b]bolded text[/b] => <span style="font-weight: bold;">bolded text</span>


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
};

module.exports = function html5Preset(opts = {}) {
  return function process(tree) {
    tree.walk((node) => {
      if (node.tag && processors[node.tag]) {
        return processors[node.tag](node, opts);
      }

      return node;
    });
  };
};

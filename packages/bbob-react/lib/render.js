const React = require('react');
const { isTagNode, isStringNode } = require('@bbob/plugin-helper');

function tagToReactElement(node) {
  if (node.content === null) {
    return React.createElement(
      node.tag,
      node.attrs,
      null,
    );
  }

  return React.createElement(
    node.tag,
    node.attrs,
    // eslint-disable-next-line no-use-before-define
    render(node.content),
  );
}

function render(nodes) {
  const els = nodes.reduce((arr, node) => {
    if (isTagNode(node)) {
      arr.push(tagToReactElement(node));
    } else if (isStringNode(node)) {
      arr.push(node);
    }

    return arr;
  }, []);

  return els;
}

module.exports = render;

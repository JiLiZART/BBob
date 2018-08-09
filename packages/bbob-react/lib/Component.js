const React = require('react');
const PropTypes = require('prop-types');
const core = require('@bbob/core');
const render = require('./render');

const toAST = (source, plugins) => core(plugins).process(source).tree;

const content = (children, plugins) => React.Children.map(children, child =>
  (typeof child === 'string' ? render(toAST(child, plugins)) : child));

const Component = props =>
  React.createElement(props.container, {}, content(props.children, props.plugins));

if (process.env.NODE_ENV !== 'production') {
  Component.propTypes = {
    container: PropTypes.node,
    children: PropTypes.node.isRequired,
    plugins: PropTypes.arrayOf(Function),
  };
}

Component.defaultProps = {
  container: 'span',
  plugins: [],
};

module.exports = Component;

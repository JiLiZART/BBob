'use strict';

exports.__esModule = true;
var React = require('react');
var PropTypes = require('prop-types');

var _require = require('./render'),
    render = _require.render;

var content = function content(children, plugins) {
  return React.Children.map(children, function (child) {
    return typeof child === 'string' ? render(child, plugins) : child;
  });
};

var Component = function Component(props) {
  return React.createElement(props.container, {}, content(props.children, props.plugins));
};

if (process.env.NODE_ENV !== 'production') {
  Component.propTypes = {
    container: PropTypes.node,
    children: PropTypes.node.isRequired,
    plugins: PropTypes.arrayOf(Function)
  };
}

Component.defaultProps = {
  container: 'span',
  plugins: []
};

exports.default = Component;
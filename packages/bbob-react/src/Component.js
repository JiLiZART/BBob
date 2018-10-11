import React from 'react';
import PropTypes from 'prop-types';
import { render } from './render';

const content = (children, plugins) => React.Children.map(children, child =>
  (typeof child === 'string' ? render(child, plugins) : child));

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

export default Component;

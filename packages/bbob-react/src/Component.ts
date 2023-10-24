import React from 'react';
import PropTypes from 'prop-types';
import { render } from './render';

const content = (children, plugins, options) => React.Children.map(children, (child) => (typeof child === 'string' ? render(child, plugins, options) : child));

const Component = ({
  container,
  componentProps,
  children,
  plugins,
  options,
}) => React.createElement(
  container,
  componentProps,
  content(children, plugins, options),
);

if (process.env.NODE_ENV !== 'production') {
  Component.propTypes = {
    container: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.elementType,
    ]),
    children: PropTypes.node.isRequired,
    plugins: PropTypes.arrayOf(PropTypes.func),
    componentProps: PropTypes.shape({
      className: PropTypes.string,
    }),
    options: PropTypes.shape({
      parser: PropTypes.func,
      skipParse: PropTypes.bool,
      onlyAllowTags: PropTypes.arrayOf(PropTypes.string),
      openTag: PropTypes.string,
      closeTag: PropTypes.string,
    }),
  };
}

Component.defaultProps = {
  container: 'span',
  plugins: [],
  options: {},
  componentProps: {},
};

export default Component;

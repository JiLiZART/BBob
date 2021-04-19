/*
  Component.propTypes = {
    container: PropTypes.node,
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

  Component.defaultProps = {
    container: 'span',
    plugins: [],
    options: {},
    componentProps: {},
  };

 */

import { render } from './render';

export default {
  props: {
    container: {
      type: String,
      default: 'span',
    },
    plugins: {
      type: Array,
      default: () => ([]),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  render(createElement) {
    if (this.$slots.default) {
      const source = this.$slots.default.reduce((acc, vnode) => acc + vnode.text, '');

      return createElement(
        this.container,
        render(createElement, source, this.plugins, this.options),
      );
    }

    return null;
  },
};

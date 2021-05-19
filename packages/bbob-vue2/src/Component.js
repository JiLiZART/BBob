import Vue from 'vue';

import { render } from './render';

const Component = Vue.extend({
  props: {
    container: {
      type: String,
      default: 'span',
    },
    plugins: {
      type: Array,
    },
    options: {
      type: Object,
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
});

export default Component;

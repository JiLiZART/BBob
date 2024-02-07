import { defineComponent } from 'vue';

import { render } from './render';
import type { BBobCoreOptions, BBobPlugins } from '@bbob/core';

export type BBobVueComponentProps = {
  container: string
  plugins?: BBobPlugins
  options?: BBobCoreOptions
}

const Component = defineComponent<BBobVueComponentProps>({
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

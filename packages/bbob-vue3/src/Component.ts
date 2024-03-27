import { defineComponent, h } from 'vue';

import { render } from './render';

const Component = defineComponent({
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

  render(props) {
    if (this.$slots.default) {
      const source = this.$slots.default().reduce((acc, vnode) => acc + vnode.children, '');

      return h(
        props.container,
        render(h, source, props.plugins, props.options),
      );
    }

    return null;
  },
});

export default Component;

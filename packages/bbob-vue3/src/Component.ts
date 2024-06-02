import { defineComponent, h, VNode } from "vue";
import { render } from "./render";

import type { BBobPlugins, BBobCoreOptions } from "@bbob/types";

type VueComponentProps = {
  container: string;
  componentProps: Record<string, unknown>;
  plugins?: BBobPlugins;
  options?: BBobCoreOptions;
};

const Component = defineComponent({
  props: {
    container: {
      type: String,
      default: "span",
    },
    plugins: {
      type: Array,
    },
    options: {
      type: Object,
    },
  },

  render(props: VueComponentProps) {
    if (this.$slots.default) {
      const source = this.$slots
        .default()
        .reduce((acc: VNode, vnode: VNode) => {
          if (typeof acc === "string") {
            return acc + vnode.children;
          }
        }, "");

      return h(
        props.container,
        render(h, source, props.plugins, props.options)
      );
    }

    return null;
  },
});

export default Component;

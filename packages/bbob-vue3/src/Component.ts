import { defineComponent, h, VNode } from "vue";
import { render } from "./render";

import type { BBobPlugins, BBobCoreOptions } from "@bbob/types";

export type VueComponentProps = {
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
      const content = this.$slots.default()
      const source = content.reduce((acc: string, vnode: VNode) => {
          if (vnode && typeof vnode.children === "string") {
            return acc + vnode.children;
          }

          return acc
        }, "");

      if (source) {
        return h(
            props.container,
            render(h, String(source), props.plugins, props.options)
        );
      }
    }

    return null;
  },
});

export default Component;

import type { Plugin } from "@vue/runtime-core";
import Component from "./Component";

const plugin = {
  install(app) {
    app.component("bbob-bbcode", Component);
    app.component("BBobBBCode", Component);
    app.component("BBCode", Component);
  }
} as Plugin<any[]>;

export { render } from "./render";
export { Component };
export default plugin;

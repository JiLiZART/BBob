import type { Plugin } from "@vue/runtime-core";
import Component from "./Component.js";

const plugin = {
  install(app) {
    app.component("bbob-bbcode", Component);
    app.component("BBobBBCode", Component);
    app.component("BBCode", Component);
  }
} satisfies Plugin;

export { render } from "./render.js";
export { Component };
export default plugin;

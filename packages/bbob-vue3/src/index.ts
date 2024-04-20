import type { App } from "vue";
import Component from "./Component";

export { render } from "./render";
export { Component };

function install(Vue: App) {
  Vue.component("bbob-bbcode", Component);
}

export default install;

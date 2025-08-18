import type { VueConstructor } from 'vue';
import Component from './Component.js';

function install(vue: VueConstructor) {
  vue.component("bbob-bbcode", Component);
  vue.component("BBobBBCode", Component);
  vue.component("BBCode", Component);
}

export { render } from './render.js';
export { Component };
export default install;

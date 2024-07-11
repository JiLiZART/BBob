import type { VueConstructor } from 'vue';
import Component from './Component';

function install(vue: VueConstructor) {
  vue.component("bbob-bbcode", Component);
  vue.component("BBobBBCode", Component);
  vue.component("BBCode", Component);
}

export { render } from './render';
export { Component };
export default install;

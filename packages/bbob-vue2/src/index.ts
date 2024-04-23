import type{ VueConstructor } from 'vue';
import Component from './Component';

export { render } from './render';
export { Component };

function install(vue: VueConstructor) {
  vue.component('bbob-bbcode', Component);
}

export default install;

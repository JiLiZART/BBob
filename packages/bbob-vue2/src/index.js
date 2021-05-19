import Component from './Component';

export { render } from './render';
export { Component };

function install(Vue) {
  Vue.component('bbob-bbcode', Component);
}

export default install;

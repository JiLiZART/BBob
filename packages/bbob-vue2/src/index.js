import Component from './Component';

export { render } from './render';

export function install(Vue) {
  Vue.component('bbob-bbcode', Component);
}

export default Component;

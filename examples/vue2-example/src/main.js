import Vue from 'vue';
import VueBbob from '@bbob/vue2';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueBbob);

new Vue({
  render: (h) => h(App),
}).$mount('#app');

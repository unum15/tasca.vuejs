import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import router from './router';
import axios from './backend/vue-axios';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/main.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';




Vue.use(BootstrapVue);
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
  router,
  axios,
  store,
  render: h => h(App),
  created() {
    if(this.$route.path!='/'){
      this.$store.dispatch('restoreData');
    }
  },
}).$mount('#app');

import Vue from 'vue';
import Vuex from 'vuex';
import idb from '@/store/idb';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    settings: {},
    user: {}
  },
  mutations: {

  },
  actions: {
    async saveSettings(context, settings) {
      context.state.settings = settings;
      await idb.saveSettings(settings);
    },
    async saveUser(context, user) {
      context.state.user = user;
      await idb.saveUser(user);
    },
    async restoreData(context) {
      let settings = await idb.getSettings();
      context.state.settings = settings;
      let user = await idb.getUser();
      context.state.user = user;
      
    }
  }
});

export default store;
import Vue from 'vue';
import Vuex from 'vuex';
import idb from '@/store/idb';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    settings: {},
    user: {},
    filters: {}
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
    async saveFilters(context, {filters, name}) {
      await idb.saveFilters(filters, name);
    },
    async getFilters(context, {name}) {
      return await idb.getFilters(name);
    },
    async restoreData(context) {
      let settings = await idb.getSettings();
      context.state.settings = settings;
      let user = await idb.getUser();
      context.state.user = user;    
    },
    async clearData(context) {
      context.state.settings = {};
      context.state.user = {};
      await idb.deleteSettings();
      await idb.deleteUser();
      await idb.deleteFilters();
    },
  }
});

export default store;
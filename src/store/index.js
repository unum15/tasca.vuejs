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
      context.state.filters[name] = filters;
      await idb.saveFilters(filters, name);
    },
    async restoreData(context) {
      let settings = await idb.getSettings();
      context.state.settings = settings;
      let user = await idb.getUser();
      context.state.user = user;
      let filters = await idb.getFilters();
      context.state.filters = filters;
      
    },
    async clearData(context) {
      context.state.settings = {};
      context.state.user = {};
      context.state.filters.assets = {};
      await idb.deleteSettings();
      await idb.deleteUser();
      await idb.deleteFilters();
    },
  }
});

export default store;
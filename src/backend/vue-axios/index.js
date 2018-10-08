import Vue from 'vue'
import VueAxios from 'vue-axios'

import axios from './axios'

export default axios

Vue.use(VueAxios, axios)

import Vue from 'vue';
import websocket from "vue-websocket";
Vue.use(websocket, "ws://10.0.0.97:9001");
export default websocket;
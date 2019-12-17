import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import VueSocketIO from 'vue-socket.io'
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

Vue.use(new VueSocketIO({
    connection:'http://172.16.11.47:3700/'
}))
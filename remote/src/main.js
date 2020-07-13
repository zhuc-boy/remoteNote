import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import VueSocketIO from 'vue-socket.io'
import VueI18n from 'vue-i18n'
Vue.config.productionTip = false;
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: "zh",
    messages: {
        'zh': require('../common/lang/zh.json'),
        'en': require("../common/lang/en.json")
    }

})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");

// Vue.use(new VueSocketIO({
//     connection:'http://172.16.11.47:3700/'
// }))

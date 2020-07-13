import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        globalColor: {
            "--label-color": "#fff"
        }
    },
    mutations: {
        CColor(state, value) {
            state.globalColor["--label-color"] = value
        }
    },
    actions: {
        changeColor({ commit }, args) {
            commit("CColor", args)
        }
    }
})

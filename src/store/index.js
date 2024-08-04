import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    namespaced: true,
    strict: import.meta.env.DEV,
    state: {
        cbUrl: '',
        phoneNo: '',
        channel: ''
    },
    mutations: {
        updateState(state, obj) {
            let keys = Object.keys(obj)
            keys.forEach((key) => {
                state[key] = obj[key]
            })
            // for (key in obj) {
            //     state[key] = obj[key]
            // }
        }
    },
    modules: {
    }
})

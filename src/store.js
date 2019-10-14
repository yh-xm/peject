import Vue from 'vue'
import Vuex from 'vuex'
import baseModule from './static/base'
import testModule from './static/test'
import userModule from './static/user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    baseModule,
    testModule,
    userModule
  },
  state:{},
  mutations:{},
  actions:{},
  getters:{}
})

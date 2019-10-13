import Vue from 'vue'
import Vuex from 'vuex'
import state from './static/state'
import getters from './static/getters'
import actions from './static/actions'
import mutations from './static/mutations'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId:""
  },
  mutations: {
    changeUserId:(s,i)=>{
      s.userId = i
    },
  },
  actions: {
    changeUserId: (c, i) => {
      c.commit('changeUserId', i)
    },
  }
})

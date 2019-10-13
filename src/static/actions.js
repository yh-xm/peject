const actions = {
  changeUserInfo: (c, i) => { //异步修改用户信息
    c.commit('changeUserInfo', i)
  },
  changeTkon: (c, i) => { //异步修改请求tkon
    c.commit('changeTkon', i)
  },
}
export default actions

const mutations = {
  changeUserInfo:(s,i)=>{ //同步修改用户信息
    s.userInfo = i;
  },
  changeTkon:(s,i)=>{//同步修改请求tkon
    s.tkon = i;
  }
}
export default mutations

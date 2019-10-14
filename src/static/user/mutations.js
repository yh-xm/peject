const mutations = {
  changeUserInfo:(s,i)=>{ //同步修改用户信息
    s.userInfo = i;
  },
  changeTkon:(s,i)=>{//同步修改请求token
    s.token = i;
  }
}
export default mutations

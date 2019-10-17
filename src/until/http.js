import axios from 'axios'
import { setCookie, getCookie, clearCookie } from "@/api/SetCookie.js";
import store from '../store'
import router from '../router'

axios.defaults.baseURL='http://192.168.1.188:12';// 默认访问接口路径
axios.interceptors.request.use(config=>{
    var token = sessionStorage.getItem('token') 
    // || store.state.userModule.token;
    config.headers['Authorization'] =token;  //默认请求携带token
    return config;
  },error=>{
    return Promise.reject(error)
  })
  axios.interceptors.response.use(response=>{
    return response;
  },error=>{
   if(error.response.status === 401 && router.history.current.name!="login"){ //过期登录
    var obj = reUserInfo()
    if (obj.username && obj.password) {
          return reGetTkoen(obj,error)
    }else{
        reLogin();
    }
   }
   return Promise.reject(error);
  })

  /**
   * 
   * 查找cookie 是否有记住密码

 */
 function reUserInfo(){
    var serachArr = ["username", "password"];
    return getCookie(serachArr);
 }


  /**
 *重新获取token
 * @param {Object} userInfo 请求的url地址
 */

 async function reGetTkoen(userInfo,error){
     var res = await get(`/api/OAuth/authenticate?userMobile=${userInfo.username}&userPassword=${userInfo.password}`)
     .catch(()=>{
         console.log(666)
         reLogin();
     })
     if(res.access_token){ 
         var token = res.token_type +" "+res.access_token;
         sessionStorage.token = token
         sessionStorage.NowLoginUser = JSON.stringify(res.profile);
         store.dispatch('userModule/changeUserInfo',res.profile);
         store.dispatch('userModule/changeTkon',token);
         error.config.headers["Authorization"] = token;
         var config = error.config;
         return await axios(config)
     }
     return Promise.reject(error)
 }

function reLogin(){
    clearCookie();
    sessionStorage.clear();
    console.log(666)
    router.push({
        path: '/login',query: {redirect:router.history.current.fullPath} 
  })
}



  /**
 * get方法，对应get请求
 * @param {String} url 请求的url地址
 * @param {Object} params 请求时携带的参数
 */
  export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url,params).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
        })    
    })
}
/** 
 * post方法，对应post请求 
 * @param {String} url 请求的url地址
 * @param {Object} params 请求时携带的参数
 */
export function post(url, data ,params) {
    return new Promise((resolve, reject) => {
         axios.post(url,data,params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vueaxios from 'vue-axios'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router'
import i18n from './i18n/i18n';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
} 

Vue.use(i18n);
Vue.use(ElementUI)
Vue.use(vueaxios, axios)
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if(to.path == '/login' ){
    next();
    }else if(sessionStorage.uid){
      next()
    }else{
        next({ path: '/login',query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
       })
    }
})

axios.defaults.baseURL='http://192.168.1.188:12';// 默认访问接口路径

axios.interceptors.request.use(config=>{
  config.headers['Authorization'] = sessionStorage.getItem('tkon'); //默认请求携带tkon
  return config;
},error=>{
  return Promise.reject(error)
})


axios.interceptors.response.use(response=>{
  return response;
},error=>{
 var url = error.config.url.toLocaleLowerCase();
 if(error.response.status === 401 && ! url.endsWith("oauth/authenticate")){ //过期登录
  // console.log(1111)
   router.replace({
     name:'login',
     query: {
      redirect: router.fullPath
    } 
    })
 }
 return Promise.reject(error);
})


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

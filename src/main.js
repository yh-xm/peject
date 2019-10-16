import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vueaxios from 'vue-axios'
import ElementUI from 'element-ui'
import { setCookie, getCookie, clearCookie } from "@/api/SetCookie.js";
import has from './directive/btnPermissions.js';
import {get,post} from "@/until/http.js"
import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router'
import i18n from './i18n/i18n';

import echarts from 'echarts'
import Print from 'vue-print-nb'//打印插件
　　
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
} 
import VueQuillEditor from 'vue-quill-editor' //富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {message} from './api/MessageTips.js'
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('userModule')

Vue.use(VueQuillEditor);

Vue.use(i18n);
Vue.use(ElementUI)
Vue.use(vueaxios, axios)
Vue.use(Print); //注册
Vue.config.productionTip = false;
Vue.prototype.$msg = message;
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.use(echarts)

/**
 * 过滤器过滤时间 格式为'YYYY-MM-DD
 */
Vue.filter("firstSet",function(val){
        var value=new Date(val);
        var year=value.getFullYear();
      var m = value.getMonth() + 1;
      var d = value.getDate();
      m < 10 && (m = "0" + m);
      d < 10 && (d = "0" + d);
      return year + '-' + m +'-'+ d
})

router.beforeEach((to, from, next) => {
    if(to.path == '/login' ){
    next();
    }else if(sessionStorage.userId){
      next()
    }else{
        next({ path: '/login',query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
       })
    }
})





new Vue({
  router,
  store,
  i18n,
  computed: mapState([
    'userInfo',
    'token'
  ]),
  methods:{
    ...mapActions([
      'changeUserInfo',
      'changeTkon'
    ])
  },
  render: h => h(App)
}).$mount('#app')

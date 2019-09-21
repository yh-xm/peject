import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import base from '@/router/base.js'
import test from '@/router/test.js'
Vue.use(Router)

const Login = () => import('@/views/Login')

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        ...base,
        ...test
      ]
    },
    {
      path: '/login',
      name: 'login',
      component:Login
    }
  ]
})

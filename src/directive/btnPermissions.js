import Vue from 'vue'
/**权限指令**/
const has = Vue.directive('has', {
 bind: function (el, binding, vnode) {
  // 获取按钮权限
  let btnPermissions = vnode.context.$route.meta.btnPermissions;

  let userId = vnode.context.$root.userId;
  console.log(btnPermissions)
  console.log(userId)
  console.log(el)
  if (!Vue.prototype.$_has(btnPermissions,userId)&&el.parentElement) {
      console.log(666)
   // el.parentElement.remove();
  }
 }
});
// 权限检查方法
Vue.prototype.$_has = function (idArr,id) {
 let isExist = false;
 
 if (id == undefined || id == null) {
  return false;
 }
 if (idArr.indexOf(id) > -1) {
    console.log(6666)
  isExist = true;
 }
 return isExist;
};
export {has}

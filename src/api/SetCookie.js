
/**
 * 添加cookie、查找cookie、清空cookie
 * 
 * setCookie 添加
 * @param {object}  obj 需要添加的cookie 
 * @param {Number} timer   需要存储的天数 
 * 
 * 
 * getCookie 查找 获取
 * @param {object}  searchArr 需要获取的cookie数组
 * 
 * clearCookie 清空
 * 
 * 使用实例
 * 导入
 * import { setCookie, getCookie, clearCookie } from "@/api/SetCookie.js";
 *  添加
 *   var obj = {
 *        username:“我”,
 *       password: 123
 *    };
 *  setCookie(obj, 7);
 * 查找
 *    var serachArr = ["username", "password"];
 *    var obj = getCookie(serachArr);
 * 
 * 删除
 * clearCookie()
 *         
 */
import { myEncode, myDecode } from "@/api/Code.js";
export const setCookie = (obj, timer) => {
    // 设置cookie 
    var nowDtate = new Date(); //获取当前时间
    nowDtate.setTime(nowDtate.getTime() + 24 * 60 * 60 * 1000 * timer); //设置保存天数
    for (const key in obj) {
        obj[key] = myEncode(obj[key] + "")
        window.document.cookie = key + "=" + obj[key] + ";path=/;expires=" + nowDtate.toGMTString();
    }


}
//获取Cookie
export const getCookie = (searchArr) => {
    var obj = {};
    if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (let j = 0; j < searchArr.length; j++) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(searchArr[j]) != -1) {
                    obj["" + searchArr[j] + ""] = myDecode(arr[i].substr(searchArr[j].length + 1)); //解码用户名
                }
            }
        }
    }
    return obj;
}
//清除cookie
export const clearCookie = () => {
    setCookie("", "", -1)
}


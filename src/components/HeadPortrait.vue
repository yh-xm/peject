<!--头像上传组件-->

<template>
  <div>
      <!-- 显示图片 -->
    <el-avatar
      size="medium"
      :src="user || circleUrl"
      fit="contain "
      style="margin-left:15px;margin-top:10px;"
       @click.native="dialogVisible = true"
    ></el-avatar>
     <!-- 显示图片结束 -->
    <!-- 弹出框 -->
      <el-dialog
           title="上传头像"
          :visible.sync="dialogVisible"
          width="300px"
         >
         <!-- 弹出框图片 -->
          <input type="file" name="image" accept="image/*" @change='onchangeImgFun'
       class="header-upload-btn user-header-com" title="请选择图片">
      <img  :src="user" class="user-header-img user-header-com">
      <!-- 弹出框图片结束 -->
    </el-dialog>
    <!-- 弹出框结束 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
        dialogVisible: false, //用于弹出框判断是否弹出
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像
      user: JSON.parse(sessionStorage.getItem("NowLoginUser")).userHeader //用户头像
    };
  },
  methods:{
      /**
       * 监听事件
       * @param {Event} e  使用e.target.files[0]可以获取图片信息
       */
        onchangeImgFun (e) {
            
            var _this=this
      var file = e.target.files[0]  //获取选择的图片信息
       const isType = file.type;
        const isLt2M = file.size / 1024 / 1024 < 2;
    if (isType !="image/jpeg" && isType !="image/png") { //判断是否是 jpg , png 格式
          _this.$msg(_this, -1,'上传头像图片只能是 JPG 格式或者是 png 格式!');
            return 
        }
        if (!isLt2M) { //判断 是否大于2MB
           _this.$msg(_this, -1,'上传头像图片大小不能超过 2MB!');
           return 
        }
     var fm = new FormData(); //异步上传二进制文件
         fm.append("userImg",file)
       
    var userUid=JSON.parse(sessionStorage.getItem("NowLoginUser")).userUid //获取用户唯一标示
        _this.axios.post("api/User/UploadHeader?userUid="+userUid,fm).then((data)=>{ //axios post请求更换图片
            var msg=data.data.message //获取返回的提示
                        if(data.data.code==1){
                  _this.user=data.data.data + '?t=' + new Date().getTime() //图片路径拼接最新的时间戳以达到更新
                        }
                  _this.$message({type:"success",message:msg}) //提示框
                  _this.dialogVisible=false //更换后关闭弹出框
        })
    }

  }
};
</script>

<style lang="less" scoped>
// 图片手型
/deep/.el-avatar{
     cursor: pointer;
}
// 弹出框文字向右
/deep/.el-dialog__header{
text-align:left !important;
}
// 图片居中
/deep/.el-dialog__body{
    position:relative;
    text-align:center !important;
.user-header-com{
  width: 144px;
  height: 144px;
  display: inline-block;
}
 /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
.header-upload-btn{
    cursor: pointer;
  position: absolute;
  left: 26%;
  top: 13%;
  opacity: 0;
 
}
}
</style>
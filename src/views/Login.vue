<template>
  <!-- 登录 -->
  <div id="Login" style="height:100%">
    <el-container :class="[From ,  showItem ? samllScreen : '']">
      <!-- 居中父盒子 -->
      <div :class="[fromleft ,  showItem ? samllItem : '']">
        <!-- 左边盒子 -->
        <dl>
          <dt>
            <img src="../../public/favicon.gif" />
          </dt>
          <dd class="from-left-title">智学无忧后台系统</dd>
          <dd class="from-left-content">做最有态度、责任、良心的IT教育</dd>
        </dl>
      </div>
      <!-- 左边盒子结束 -->
      <div id="line" v-show="!showItem"></div>
      <!-- 中间线 -->
      <!-- 右边盒子 -->
      <div :class="[fromright ,  showItem ? samllItem : '']">
        <el-form
          :model="numberValidateForm"
          ref="numberValidateForm"
          label-width="100px"
          class="demo-ruleForm"
          :rules="rules"
        >
          <el-form-item prop="username">
            <i class="el-icon-user-solid from-icon"></i>
            <el-input
              type="age"
              v-model="numberValidateForm.username"
              autocomplete="off"
              placeholder="用户名/手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passworld">
            <i class="el-icon-lock from-icon"></i>
            <el-input placeholder="请输入密码" v-model="numberValidateForm.passworld" show-password></el-input>
          </el-form-item>

          <el-checkbox v-model="lenrnPsw">记住密码</el-checkbox>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('numberValidateForm')"
              size="medium"
              :loading="disbable"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 右边盒子结束 -->
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lenrnPsw: false, //是否记住密码
      NowLoginUser: {}, //当前登录用户信息
      screenWidth: 0, //宽度
      showItem: false, // 响应式标识
      From: "From", //样式
      fromright: "from-right", //样式
      fromleft: "from-left", //样式
      samllScreen: "samllScreen", //样式
      samllItem: "samllItem", //样式
      disbable: false,
      numberValidateForm: {
        //表单信息
        username: "",
        passworld: ""
      },
      rules: {
        //正则表达式判断
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 18,
            message: "长度在 1 到 18个字符",
            trigger: "blur"
          }
        ],
        passworld: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 18,
            message: "长度在 1 到 18个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.disbable = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _this = this;
          if (
            this.numberValidateForm.username.trim() != "" &&
            this.numberValidateForm.passworld.trim() != ""
          ) {
            this.axios
              .get(
                `/api/OAuth/authenticate?userMobile=${this.numberValidateForm.username}&userPassword=${this.numberValidateForm.passworld}`
              )
              .then(function(r) {
<<<<<<< HEAD
                console.log(r)
                if (r.status == "200") {  
                  if(_this.lenrnPsw == true){
                    _this.setCookie(_this.numberValidateForm.username, _this.numberValidateForm.passworld,7)
                  }else{
                      _this.clearCookie();
                  }
                  sessionStorage.tkon = "Bearer"+" "+r.data.access_token; //获取tkon
                  sessionStorage.userId = r.data.profile.userUid;
=======
                if (r.status == "200") {
                  if (_this.lenrnPsw == true) {
                    _this.setCookie(
                      _this.numberValidateForm.username,
                      _this.numberValidateForm.passworld,
                      7
                    );
                  } else {
                    _this.clearCookie();
                  }
                  sessionStorage.tkon = "Bearer" + " " + r.data.access_token; //获取tkon
                  sessionStorage.stuUid = r.data.profile.stuUid;
>>>>>>> cy
                  sessionStorage.NowLoginUser = JSON.stringify(r.data.profile); //获取用户信息

                  if (_this.$route.query.redirect) {
                    //是否返回之前路由
                    //     let redirect = decodeURIComponent(this.$route.query.redirect);
        
                    let redirect = _this.$route.query.redirect;
                                console.log(redirect)
                    _this.$router.push({
                      path: redirect
                    });
                  } else {
                    _this.$router.push({
                      //没有历史路由 去主页
                      name: "home"
                    });
                  }

                  _this.$message({
                    type: "success",
                    message: "登录成功!"
                  });
                }
              })
              .catch(function(error) {
                _this.$message({
                  showClose: true,
                  message: "用户名或密码错误，请重新输入!",
                  type: "warning"
                });
              });
          } else {
            _this.$message({
              showClose: true,
              message: "请填写用户名和密码",
              type: "warning"
            });
          }
        } else {
          return false;
        }
      });
      this.disbable = false;
    },
    // 设置cookie
    setCookie(username, password, timer) {
      username = btoa(username + "");
      password = btoa(password + "");
      var nowDtate = new Date(); //获取当前时间

      nowDtate.setTime(nowDtate.getTime() + 24 * 60 * 60 * 1000 * timer); //设置保存天数
      window.document.cookie =
        "zxusername" +
        "=" +
        username +
        ";path=/;expires=" +
        nowDtate.toGMTString();
      window.document.cookie =
        "zxpassworld" +
        "=" +
        password +
        ";path=/;expires=" +
        nowDtate.toGMTString();
    },
    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        var ulen = "zxusername=".length;
        var plen = "zxpassworld=".length;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].indexOf("zxusername") != -1) {
            this.lenrnPsw = true;
            this.numberValidateForm.username = atob(arr[i].substr(ulen)); //解码用户名
          } else if (arr[i].indexOf("zxpassworld") != -1) {
            this.numberValidateForm.passworld = atob(arr[i].substr(plen)); //解码密码
          }
        }
      }
    },
    //清除cookie
    clearCookie() {
      this.setCookie("", "", -1);
    }
  },
  created() {},
  watch: {
    screenWidth(val) {
      this.screenWidth = val;
      let that = this;
      if (this.screenWidth <= 767) {
        that.showItem = true;
      } else {
        that.showItem = false;
      }
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    this.getCookie();
  }
};
</script>
<style lang="less" scoped>
#Login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../../public/background.jpg");
  background-size: cover;
  .From {
    margin: auto;
    border: 1px solid transparent;
    width: 500px;
    height: 350px;
    min-width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: #4a93d8 1px 1px 8px 10px;
    border-radius: 5px;
    background-color: #d8ecf5;
    padding: 50px 20px;

    #line {
      margin: 0 auto;
      height: 100%;
      width: 2px;
      background: radial-gradient(#1ca092 12%, white 80%);
      position: absolute;
      top: 0;
      left: 50%;
    }
    .from-left {
      width: 50%;
      text-align: center;
      dt {
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 50%;
        overflow: hidden;
        margin: 0px auto;
        margin-bottom: 15%;
        img {
          width: 100%;
          height: auto;
        }
      }
      .from-left-title {
        color: #1ca092;
        font-size: 16px;
        font-weight: bold;
      }
      .from-left-content {
        font-size: 10px;
        color: #a2aca1;
        margin-top: 28px;
      }
    }

    .from-right {
      width: 50%;
      .el-form {
        margin: 0px auto;

        width: 80%;
        position: relative;
        // border: 1px solid red;

        text-align: center;
        /deep/.el-form-item__content {
          margin-left: 0px !important;
          //   border: 1px solid red;
        }
        .el-button {
          background-color: #67c239;
          color: white;
          outline: #67c239;
          width: 100%;
          line-height: 12px;
          margin-top: 5%;
          height: 35px;
          .is-loading {
            background-color: red;
          }
        }
        /deep/ .el-input__inner {
          border-radius: 0px;
          border: #1ca092 1px solid;
          height: 30px;
          width: 100%;
          text-indent: 18px;
          outline: #67c239;
        }
        .from-icon {
          z-index: 555;
          position: absolute;
          font-size: 22px;
          color: #67c239;
          top: 9px;
        }
        .el-checkbox {
          font-size: 12px;
          float: left;
        }
      }
    }
    .samllItem {
      width: 100%;
      height: 43%;
      font-size: 12px;
      margin-top: -15px;
      dt {
        width: 50px;
        height: 50px;
        margin-bottom: 1%;
        font-size: 12px;
      }
      .from-left-content {
        margin-top: 5px;
      }
    }
  }
  .samllScreen {
    //  width: 100%;
    display: block;
  }
}
</style>
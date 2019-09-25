
<template>

    <div class="change">
    <div class="nav">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="javascript:void(0);">基础数据</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb> 

     </div> 
<!-- <span style="float:left;"><i class="el-icon-edit"></i>修改密码</span>
		<br/>
		<br/>
		<br/> -->

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        newPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur", required: true }],
        checkPass: [
          { validator: validatePass2, trigger: "blur", required: true }
        ],
        newPass: [{ validator: checkAge, trigger: "blur", required: true }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this
            .$confirm("你确定修改密码吗, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.$axios
                .get("/api/User/ModifyPassword", {
                  params: {
                    uid: sessionStorage.getItem("uid"),
                    oldPassword: _this.ruleForm.pass, //旧密码
                    newPassword: _this.ruleForm.newPass //新密码
                  }
                })
                .then(res => {
                  console.log(res.data);
                  if (res.data.code == -1) {
                    _this.$message({
                      message: "系统异常",
                      type: "error"
                    });
                  }
                  if (res.data.code == -2) {
                    _this.$message({
                      message: "参数错误",
                      type: "error"
                    });
                  }
                  if (res.data.code == -3) {
                    _this.$message({
                      message: "旧密码错误",
                      type: "error"
                    });
                  }
                  if (res.data.code == 0) {
                    _this.$message({
                      message: "数据没有任何变化 ",
                      type: "info"
                    });
                  }
                  if (res.data.code == 1) {
                    _this.$message({
                      message:
                        "修改密码成功,需重新登录,3秒后自动跳转到登录页面",
                      type: "success"
                    });
                    sessionStorage.clear();
                    setTimeout(function() {
                      _this.$router.replace("/");
                    }, 1000);
                  }
                })
                .catch(error => {
                  this.$message({
                    message: "修改密码失败",
                    type: "error"
                  });
                  console.log(error);
                });
            });
        } else {
          _this.$message({
            message: "请输入正确的密码",
            type: "warning"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang='less'>
.change {
  .nav,
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
  }
  .nav {
    border-bottom: 1px solid #f0f0f0;
  }
  form {
    margin-top: 10px;
  }
}
</style>
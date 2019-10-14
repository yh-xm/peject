/** 
* 密码修改
*/
<template>
    <div class="Modify" >
        <div slot="header" class="clearfix">
            <span><i class="el-icon-edit"></i> 修改密码</span>
        </div>
        <div class="text item">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <el-form-item label="旧密码" prop="oldpass" required>
                  <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" required>
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" required>
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
       /***
         * el-form-item prop属性绑定
        */
 export default {
    data() {
        //旧密码
        var validateOldPass = (rule, value, callback) => {
          if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          this.$refs.ruleForm.validateField('oldpass');
          callback();
        }
        };

      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldpass:'',
          pass: '',
          checkPass: ''
        },
      
        rules: {
          oldpass:[
              {
               validator:validateOldPass, trigger:'blur'
              }
          ],//验证器
          pass: [
            {validator: validatePass1, trigger: 'blur' }
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let _this = this
        var userUid='5a847ecb0f14486fba9f65f63d8395a3'
      this.axios.get("api/User/ModifyPassword?uid="+userUid+"&oldPassword="+_this.ruleForm.oldpass+"&newPassword="+_this.ruleForm.pass,
      ).then((res)=> {
        console.log(res.data)
            if(res.data.code==-3){
						  	_this.$message.error('旧密码错误');
						}
						if(res.data.code==-1){
							_this.$message.error('系统异常');
						}
							if(res.data.code==-2){
							_this.$message.error('参数错误');
						}
						if(res.data.code==1){	
              _this.$message.success('修改成功');
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("uid");
              _this.$router.push("login")
            }
              
					}).catch((err) => {
						console.log(err)
						_this.$message.error('修改失败');
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
 
  }
</script>

<style lang="less">
    // scoped作用域,不要加
    // /api/User/ModifyPassword


</style>
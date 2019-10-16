/** 
* 密码修改
*/
<template>
    <div class="Modify" >
        <div slot="header" class="clearfix">
            <span><i class="el-icon-edit"></i> {{$t('tableName.chgpsw')}}</span>
        </div>
        <div class="text item">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
               <el-form-item :label="$t('tableName.oldpsw')" prop="oldpass" required>
                  <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('tableName.psw')" prop="pass" required>
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('tableName.repsw')" prop="checkPass" required>
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">{{$t('btn.s')}}</el-button>
                    <el-button @click="resetForm('ruleForm')">{{$t('btn.r')}}</el-button>
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
      this.$get("api/User/ModifyPassword?uid="+userUid+"&oldPassword="+_this.ruleForm.oldpass+"&newPassword="+_this.ruleForm.pass,
      ).then((res)=> {
        // console.log(res)
            if(res.code==-3){
						  _this.$msg(_this,-1,'旧密码错误');
						}
						if(res.code==-1){
							_this.$msg(_this,0,'系统异常');
						}
							if(res.code==-2){
							_this.$msg(_this,-1,'参数错误');;
						}
						if(res.code==1){	
              	_this.$msg(_this,1,'修改成功');
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("uid");
              _this.$router.push("login")
            }
              
					}).catch((err) => {
						console.log(err)
							_this.$msg(_this,0,'修改失败');
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
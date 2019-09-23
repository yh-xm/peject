<template>
<div id="PaperInfo">
 <div class="from">
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm" 	>
  <el-form-item label="试卷名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>

  <el-form-item label="课程名称" prop="region">
    <el-select v-model="ruleForm.region" placeholder="请选择课程">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
    
  <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
  </el-form-item>
</el-form>
 </div>
</div>
</template>
<script>
 export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入试卷名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style lang="less" scoped>
#PaperInfo{
  border: 1px solid red;
  display: flex;
  .from{
    width: 50%;
   margin: auto;
   .el-select{
     display: block;
   }
  }
}
</style>
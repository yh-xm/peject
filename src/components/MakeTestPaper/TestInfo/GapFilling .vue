<template>
<div id="GapFilling">
<div class="gapContent">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
  <el-form-item label="题干">
    <el-input v-model="dynamicValidateForm.title"></el-input>
  </el-form-item>
  <el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"

    :key="domain.key"
    :prop="'domains.' + index + '.value'"
  >
  <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

    <el-input v-model="domain.value" :placeholder="index"></el-input><el-input-number v-model="num" @change="handleChange" :min="1" :max="10" ></el-input-number>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button @click="addDomain">新增域名</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>
</div>
</div>
</template>
<script>
  export default {
    data() {
      return {
           num:"2",
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
        
         title:""
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
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>
<style lang="less" scoped>
#GapFilling {
  border: blue solid 1px;
  display: flex;
  margin-top: 20px;
  .gapContent {
    width: 95%;
    margin: auto;
    .el-form-item {
      /deep/ .el-form-item__content {
        display: flex;
        margin-left: 40px !important;
        /deep/ .el-input {
          margin-right: auto;
          margin-right: 12px;
          margin-left: 12px;
        }
        .el-input__inner{
            border: none;
            border-bottom: 1px solid #ccc;
            border-radius: 0;
        }
        .el-input-number{

            border: 1px solid #ccc;
                  border-radius: 8px;
         .el-input__inner{
       border-bottom: none;
                   padding-left: 40px;
                   padding-right: 64px;
         }
        }
      }
      .el-tag{
          border-radius: 50%;
         margin-top: 12px;
      }
    }
  }
}
</style>
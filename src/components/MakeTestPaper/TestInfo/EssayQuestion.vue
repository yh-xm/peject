<template>
  <div id="EssayQuestion">
    <div class="essat-content">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item prop="title" label="题干">
          <el-input type="textarea" v-model="dynamicValidateForm.title" :rows="1"></el-input>
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input v-model="dynamicValidateForm.value"></el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="dynamicValidateForm.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('dynamicValidateForm')">重置</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('dynamicValidateForm')"
          >新增题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dynamicValidateForm: {
        onum: 5, //默认分数
        value: "", //答案
        title: "" //题目
      }
    };
  },
  methods: {
    resetForm(formName) {  //重置表单
      this.$refs[formName].resetFields();
    },
    submitForm(formName) { //提交表单
      var tpqPaperId = sessionStorage.testPaperId;
      var aqAnswer = this.$refs[formName].model.value;
      var tpqScore = this.$refs[formName].model.onum;
      var title = this.$refs[formName].model.title;
      this.axios
        .post(`/api/TestPaper/AddQuestionToTestPaper`, {
          tpqPaperId: tpqPaperId, //试卷主键编号
          tpqScore: tpqScore, //分值
          tpqQuestion: {
            questionTitle: title, //题目的标题
            questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
            answerQuestion: {
              aqAnswer: aqAnswer //问答题的答案
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.message == "添加成功") {
            this.$parent.pageInfo[2].bodys.push(res.data.data.tpqQuestion);
            this.$parent.pageInfo = [...this.$parent.pageInfo];
            this.$parent.pageInfo[2].nowAdd =
              parseInt(this.$parent.pageInfo[2].nowAdd) + 1;
            this.$parent.pageInfo[2].nowScroe =
              parseInt(this.$parent.pageInfo[2].nowScroe) +
              parseInt(this.$refs[formName].model.onum);
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.resetForm("dynamicValidateForm");
            this.dynamicValidateForm.value = "";
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
#EssayQuestion {
  text-align: left;
}
</style>
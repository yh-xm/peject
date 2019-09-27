<template>
  <div id="EssayQuestion">
    <div class="essat-content">
      <!-- 表单 -->
      <el-form
        :model="AddEssayQuestion"
        ref="AddEssayQuestion"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item prop="title" label="题干">
          <!-- 填写题目 -->
          <el-input type="textarea" v-model="AddEssayQuestion.title" :rows="1"></el-input>
        </el-form-item>
        <!-- 参考答案 -->
        <el-form-item label="参考答案">
          <el-input v-model="AddEssayQuestion.value"></el-input>
        </el-form-item>
        <!-- 分值 -->
        <el-form-item label="分值">
          <el-input-number v-model="AddEssayQuestion.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <!-- 重置 -->
          <el-button round @click="resetForm('AddEssayQuestion')">重置</el-button>
          <!-- 新增题目 -->
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('AddEssayQuestion')"
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
      AddEssayQuestion: {
        onum: 5, //默认分数
        value: "", //答案
        title: "" //题目
      }
    };
  },
  methods: {
     /**
     * 重置表单
     * @param {object} formName 当前表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
      /**
     * 新增题目
     *  {Number} userId 识别用户Id
     * @param {object} formName 点击当前表单
     * 
     */
    submitForm(formName) {
      var _this = this;
      var tpqPaperId = sessionStorage.testPaperId;
      var aqAnswer = _this.$refs[formName].model.value;
      var tpqScore = _this.$refs[formName].model.onum;
      var title = _this.$refs[formName].model.title;
      _this.axios
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
          if (res.data.message == "添加成功") {
      _this.$parent.$parent.pageInfo[2].bodys.push(res.data.data) //改变父组件的问答题的试卷信息
       _this.$parent.$parent.pageInfo[2].nowAdd+=1; //改变父组件的问答题的问题个数
        _this.$parent.$parent.pageInfo[2].nowScroe+=parseInt(res.data.data.tpqScore)//改变父组件的问答题的分数
     _this.$parent.$parent.pageInfo = [..._this.$parent.$parent.pageInfo] //解构渲染
            _this.$message({
              type: "success",
              message: "添加成功!"
            });
            _this.resetForm("AddEssayQuestion"); //重置表单
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
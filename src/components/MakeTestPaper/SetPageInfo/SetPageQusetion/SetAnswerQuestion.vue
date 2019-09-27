<template>
  <div>
    <div class="essat-content">
      <div class="option-title">{{nowIndex2+1}}、</div>
      <div class="option-content">
        <el-form :model="nowOption" ref="dynamicValidateFormfore" class="demo-dynamic">
          <el-form-item prop="title">
            <el-input
              type="textarea"
              v-model="nowOption.tpqQuestion.questionTitle"
              :rows="1"
              :disabled="odisabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="参考答案">
            <el-input v-model="nowOption.tpqQuestion.answerQuestion.aqAnswer" :disabled="odisabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click.prevent="compile" size="small">编辑</el-button>
            <el-row v-show="oshow">
              <el-button round @click.prevent="cancel" size="small">取消</el-button>
              <el-button type="primary" plain @click.prevent="saveOption" size="small">保存修改</el-button>
              <el-button type="danger" plain @click.prevent="removePageInfoItem" size="small">删除题目</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nowOption: [], //当前题目信息
      oldOption: [], //克隆题目信息
      odisabled: true, //禁用选项
      oshow: false //显示
    };
  },
  props: {
    AddEssayQuestiontList: Object, //父组件传递的题目信息
    nowIndex2: Number //题目编号
  },
  methods: {
    /**
     * 编辑表单
     */
    compile() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
    },
    /**
     * 取消操作
     * @param {object} formName 当前表单
     */
    cancel() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
      _this.nowOption = JSON.parse(JSON.stringify(_this.oldOption));
    },
    /**
     * 修改题目信息
     *
     */
    saveOption() {
      var _this = this;
      var nowOption = _this.nowOption;
      _this.axios
        .post(`/api/TestPaper/ModifyQuestion`, {
          questionId: nowOption.tpqQuestion.questionId, //题目Id
          questionTitle: nowOption.tpqQuestion.questionTitle, //题目名称
          questionTypeId: nowOption.tpqQuestion.questionTypeId, //题目类型
          answerQuestion: {
            aqAnswer: nowOption.tpqQuestion.answerQuestion.aqAnswer //答案
          }
        })
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新旧信息
            _this.odisabled = !_this.odisabled;
            _this.oshow = !_this.oshow;
            _this.$message({
              type: "success",
              message: "修改成功!"
            });
          } else {
            _this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
    },
    /**
     * 删除题目
     *  {Number} this.AddEssayQuestiontList.tpqId 题目Id
     */
    removePageInfoItem() {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddEssayQuestiontList.tpqId}`
        )
        .then(res => {
          if (res.data.message == "删除成功") {
            _this.$parent.$parent.$parent.pageInfo[2].bodys.splice(
              _this.nowIndex2,
              1
            ); //改变父组件的问答题的试卷信息
            _this.$parent.$parent.$parent.pageInfo[2].nowAdd -= 1; //改变父组件的问答题的问题个数
            _this.$parent.$parent.$parent.pageInfo[2].nowScroe -= parseInt(
              _this.AddEssayQuestiontList.tpqScore
            ); //改变父组件的问答题的分数
            _this.$parent.$parent.$parent.pageInfo = [
              ..._this.$parent.$parent.$parent.pageInfo
            ]; //解构渲染
          }
          this.$message({
            type: "success",
            message: res.data.message
          });
        });
    },
    /**
     * 初始化
     */
    init() {
      var _this = this;
      _this.oldOption = JSON.parse(JSON.stringify(_this.AddEssayQuestiontList));
      _this.nowOption = _this.AddEssayQuestiontList;
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.essat-content {
  text-align: left;
  display: flex;
  .option-title {
    display: inline;
  }
  .option-content {
    width: 80%;
    .el-form-item__content {
      .el-row {
        flex: 1;
        display: inline-block;
        margin-left: 12px;
      }
    }
    /deep/ .el-button {
      border-radius: 50px;
    }
  }
}
</style>
<template>
  <div>
    <div class="essat-content">
      {{nowIndex2+1}}、
      <el-form :model="nowOption" ref="dynamicValidateFormfore" class="demo-dynamic">
        <el-form-item prop="title">
          <el-input
            type="textarea"
            v-model="nowOption.questionTitle"
            :rows="1"
            :disabled="odisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="参考答案">
          <el-input v-model="nowOption.answerQuestion.aqAnswer" :disabled="odisabled"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click.prevent="fnchange" size="small">编辑</el-button>
          <el-row v-show="oshow">
            <el-button round @click.prevent="fnout" size="small">取消</el-button>
            <el-button type="primary" plain @click.prevent="fnsave" size="small">保存修改</el-button>
            <el-button type="danger" plain @click.prevent="fnremoveChoose" size="small">删除题目</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nowOption: [],
      oldOption: [],
      odisabled: true,
      oshow: false,
      dynamicValidateFormfore: {
        value: "",
        title: ""
      }
    };
  },
  props: {
    searchList2: Object,
    nowIndex2: Number
  },
  methods: {
    fnchange() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
    },
    fnout() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
      this.nowOption = JSON.parse(JSON.stringify(this.oldOption));
    },
    fnsave() {
      var nowOption = this.nowOption;
      console.log(nowOption);
      this.axios
        .post(`/api/TestPaper/ModifyQuestion`, {
          questionId: nowOption.questionId,
          questionTitle: nowOption.questionTitle,
          questionTypeId: nowOption.questionTypeId,
          answerQuestion: {
            aqAnswer: nowOption.answerQuestion.aqAnswer
          }
        })
        .then(res => {
          if (res.data.message == "修改成功") {
            this.oldOption = JSON.parse(JSON.stringify(this.nowOption));
            this.odisabled = !this.odisabled;
            this.oshow = !this.oshow;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
    },
    fnremoveChoose() {
      this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${this.nowOption.tpqId}`
        )
        .then(res => {
          if (res.data.message == "删除成功") {
            this.$parent.$parent.pageInfo[2].bodys.splice(this.nowIndex, 1);
            this.$parent.$parent.pageInfo[2].nowAdd =
              parseInt(this.$parent.$parent.pageInfo[2].nowAdd) - 1;
            this.$parent.$parent.pageInfo[2].nowScroe -= parseInt(
              this.nowOption.score
            );
            this.$parent.$parent.pageInfo = [...this.$parent.$parent.pageInfo];
            
          } 
                this.$message({
              type: "success",
              message: res.data.message
            });
        });
    },
    fncheckbox(x) {
      var arr = [];
      for (const key in this.optionsActive) {
        if (
          this.optionsActive[key] == x[0] ||
          this.optionsActive[key] == x[1]
        ) {
          arr.push(key);
        }
      }
      for (let key in this.nowOption.chooseQuestion) {
        this.nowOption.chooseQuestion[key].cqIsRight = false;
      }
      for (let i = 0; i < arr.length; i++) {
        this.nowOption.chooseQuestion[arr[i]].cqIsRight = true;
      }
    }
  },
  created() {
    this.oldOption = JSON.parse(JSON.stringify(this.searchList2));
    this.nowOption = this.searchList2;
    this.nowOption;
  }
};
</script>
<style lang="less" scoped>
.essat-content {
  text-align: left;
  .el-form-item__content {
    display: flex;

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
</style>
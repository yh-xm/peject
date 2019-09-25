<template>
  <div class="MultipleChoice">
    <div class="Mult-Content">
      <el-form
        :model="nowOption"
        ref="dynamicValidateFormfive"
        label-width="100px"
        class="demo-dynamic"
      >
        {{nowIndex+1}}、
        <el-form-item prop="title">
          <el-input
            type="textarea"
            v-model="nowOption.questionTitle"
            :rows="1"
            :disabled="odisabled"
          ></el-input>
        </el-form-item>

        <el-form-item v-for="(domain, index) in nowOption.chooseQuestion" :key="domain.key">
          <el-checkbox-group v-model="checked" :min="0" :max="2" @change="fncheckbox">
            <el-checkbox
              :label="optionsActive[index]"
              :checked="domain.cqIsRight"
              :key="index"
              :disabled="odisabled"
            ></el-checkbox>
          </el-checkbox-group>

          <el-input v-model="domain.cqOption" :disabled="odisabled"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click.prevent="fnremove(index)"
            v-show="oshow"
          ></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click.prevent="fnchange" size="small">编辑</el-button>
          <el-row v-show="oshow">
            <el-button round @click.prevent="fnout" size="small">取消</el-button>
            <el-button round @click.prevent="fnadd" size="small">新增选项</el-button>
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
      odisabled: true,
      oshow: false,
      optionsActive: ["A、", "B、", "C、", "D、", "E、"],
      checked: [],
      oldOption: [],
      nowOption: []
    };
  },
  props: {
    searchList: Object,
    nowIndex: Number
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
    fnadd() {
      if (this.nowOption.chooseQuestion.length < this.optionsActive.length) {
        this.nowOption.chooseQuestion.push({
          cqId:
            this.nowOption.chooseQuestion[
              this.nowOption.chooseQuestion.length - 1
            ].cqId + 1,
          cqIsRight: false,
          cqOption: "",
          cqQuestionId: this.nowOption.chooseQuestion[0].cqQuestionId
        });
      }
    },
    fnsave() {
      var nowOption = this.nowOption;
      console.log(nowOption);
      this.axios
        .post(`/api/TestPaper/ModifyQuestion`, {
          questionId: nowOption.questionId,
          questionTitle: nowOption.questionTitle,
          questionTypeId: nowOption.questionTypeId,
          chooseQuestion: nowOption.chooseQuestion
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
    fnremove(index) {
      this.nowOption.chooseQuestion.splice(index, 1);
    },
    fnremoveChoose() {
      this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${this.nowOption.tpqId}`
        )
        .then(res => {
        console.log(this.nowOption)
         this.$parent.$parent.pageInfo[0].bodys.splice(this.nowIndex,1)
         this.$parent.$parent.pageInfo[0].bodys.nowAdd=parseInt(this.$parent.$parent.pageInfo[0].bodys.nowAdd)-1;
          this.$parent.$parent.pageInfo[0].bodys.nowScroe -= parseInt(this.nowOption.score)
          this.$parent.$parent.pageInfo = [...this.$parent.$parent.pageInfo]
          // if(res.message=="删除成功"){
          //   console.log(.)
          // }
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
    this.oldOption = JSON.parse(JSON.stringify(this.searchList));
    this.nowOption = this.searchList;
  }
};
</script>
<style lang="less" scoped>
.MultipleChoice {
  display: flex;
  margin-top: 20px;
  .Mult-Content {
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
        /deep/ .el-button {
          border-radius: 20px;
        }
        .el-row {
          margin-left: 10px;
        }
        
      }
    }
  }
}
</style>
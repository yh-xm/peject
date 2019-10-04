<template>
  <div class="MultipleChoice">
    <div class="Mult-Content">
      <!-- 题目编号 -->
      <div class="option-title">{{nowIndex+1}}、</div>
      <div class="option-content">
        <el-form
          :model="nowOption"
          ref="dynamicValidateFormfive"
          label-width="100px"
          class="demo-dynamic"
        >
        <!-- 题目 -->
          <el-form-item prop="title">
            <el-input
              type="textarea"
              v-model="nowOption.questionTitle"
              :rows="1"
              :disabled="odisabled"
            ></el-input>
          </el-form-item>
  
          <el-form-item v-for="(domain, index) in nowOption.chooseQuestion" :key="domain.key">
            <el-checkbox-group v-model="checked" :min="0" :max="2" @change="checkboxChange">
              {{domain}}
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
              @click.prevent="removeOption(index)"
              v-show="oshow"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click.prevent="compile">编辑</el-button>
            <el-row v-show="oshow">
              <el-button round @click.prevent="cancel" size="small">取消</el-button>
              <el-button round @click.prevent="addOption" size="small">新增选项</el-button>
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
      odisabled: true, //禁用选项
      oshow: false, //显示
      optionsActive: ["A、", "B、", "C、", "D、", "E、"], //对应字母
      checked: [], //多选信息
      oldOption: [], //克隆题目信息
      nowOption: [] //当前题目信息
    };
  },
  props: {
    AddChooseQuestionList: Object, //父组件传递的题目信息
    nowIndex: Number //题目编号
  },
  methods: {
    /**
     * 编辑表单
     */
    compile() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
    },
    /**
     * 取消操作
     */
    cancel() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
      this.nowOption = JSON.parse(JSON.stringify(this.oldOption));
      console.log(this.oldOption);
    },
    /**
     * 添加选项
     */
    addOption() {
      if (this.nowOption.chooseQuestion.length < this.optionsActive.length) {
        this.nowOption.chooseQuestion.push({
          cqId: 0,
          cqIsRight: false,
          cqOption: ""
        });
      }
    },
    /**
     * 保存修改
     */
    saveOption() {
      var nowOption = this.nowOption;
      var _this = this;
      _this.axios
        .post(`/api/TestPaper/ModifyQuestion`, {
          //—修改选择题
          questionId: nowOption.questionId,
          questionTitle: nowOption.questionTitle,
          questionTypeId: nowOption.questionTypeId,
          chooseQuestion: nowOption.chooseQuestion
        })
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption));
            _this.odisabled = !_this.odisabled; //成功禁用
            _this.oshow = !_this.oshow;
            console.log(_this.nowOption);
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
     * 删除选项
     *
     * @param {object} index 当前选项下标
     */
    removeOption(index) {
      this.nowOption.chooseQuestion.splice(index, 1);
    },
    /**
     * 删除题目
     *
     *
     */
    removePageInfoItem() {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddChooseQuestionList.tpqId}` //删除题目
        )
        .then(res => {
          console.log(res);
          if (res.data.message == "删除成功") {
                var data ={
            index:_this.nowIndex,
            questionTypeId: 1,
            tpqScore:_this.AddChooseQuestionList.tpqScore
          }
            this.$emit("setQuestion",data)
          }
          this.$message({
            type: "success",
            message: res.data.message
          });
        });
    },
    /**
     * 改变多选
     * @param {Array} item 当前选中的多选数组
     *
     */
    checkboxChange(item) {
      var arr = [];
      for (const key in this.optionsActive) {
        if (
          this.optionsActive[key] == item[0] ||
          this.optionsActive[key] == item[1]
        ) {
          arr.push(key);
        }
      }
      for (let key in this.nowOption.chooseQuestion) {
        //全部不选中
        this.nowOption.chooseQuestion[key].cqIsRight = false;
      }
      for (let i = 0; i < arr.length; i++) {
        //选中当前选中的
        this.nowOption.chooseQuestion[arr[i]].cqIsRight = true;
      }
    },
    /**
     * 初始化
     */
    init() {
      this.oldOption = JSON.parse(
        JSON.stringify(this.AddChooseQuestionList.tpqQuestion)
      );
      this.nowOption = this.AddChooseQuestionList.tpqQuestion;
    }
  },
  created() {
    this.init();
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
    display: flex;
    .option-content {
      width: 80%;
      .el-form-item {
        /deep/ .el-form-item__content {
          width: 80%;
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
}
</style>
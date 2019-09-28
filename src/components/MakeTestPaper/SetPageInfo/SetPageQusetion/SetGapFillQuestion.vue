<template>
  <div class="gapFilling">
    <div class="gapContent">
      <el-form
        :model="AddGapFillQuestion"
        ref="AddGapFillQuestion"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="题干">
          <el-button
            round
            icon="el-icon-document-checked"
            @click="addDomain"
            size="small"
            :disabled="odisabled"
          >插入填空</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            v-model="title"
            :rows="1"
            :id="'textarea'+nowIndex3"
            :disabled="odisabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in AddGapFillQuestion.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

          <el-input
            v-model="domain.value"
            :placeholder="'请输入第'+(index+1)+'个空的答案'"
            :disabled="odisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="题目预览" class="view-options">
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='＿'">{{item}}</span>
            <el-input
              v-if="item=='＿'"
              :key="index"
              v-model="AddGapFillQuestion.domains[IndexArr[index]].value"
              class="ShowDaAn"
              disabled
            ></el-input>
            <span v-if="item=='＿'">({{AddGapFillQuestion.domains[IndexArr[index]].onum}}分)</span>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain @click.prevent="compile">编辑</el-button>
          <el-row v-show="oshow">
            <el-button round @click.prevent="out" size="small">取消</el-button>
            <el-button
              type="primary"
              plain
              @click.prevent="submitForm('AddGapFillQuestion')"
              size="small"
            >保存修改</el-button>
            <el-button type="danger" plain @click.prevent="removeChoose" size="small">删除题目</el-button>
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
      title: "",
      nowOption: [],
      odisabled: true,
      oshow: false,
      AddGapFillQuestion: {
        domains: []
      },
      IndexArr: [],
      fillQuestion: []
    };
  },
  props: {
    AddGapFillQuestionList: Object,
    nowIndex3: Number
  },
  methods: {
    compile() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
    },
    out() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
      this.title = this.nowOption.questionTitle;
      this.AddGapFillQuestion.domains = [];
      for (const key in this.nowOption.fillQuestion) {
        this.AddGapFillQuestion.domains.push({
          value: this.nowOption.fillQuestion[key].fqAnswer,
          onum: this.nowOption.fillQuestion[key].fillQuestionScore[0].fqsScore
        });
      }
    },
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var fillQuestion = [];
          var addOptions = this.fillQuestion;
          var nowOption = _this.nowOption;
          var domains = JSON.parse(
            JSON.stringify(_this.$refs[formName].model.domains)
          );
          var newDomains = JSON.parse(
            JSON.stringify(_this.$refs[formName].model.domains)
          );
          var oldarr = _this.nowOption.fillQuestion;
          for (const key in addOptions) {
            if (key == 0) {
              domains.splice(addOptions[key], 1);
            } else {
              addOptions[key] -= 1;
              domains.splice(addOptions[key], 1);
            }
          }

          for (const key in domains) {
            if (domains[key].value != oldarr[key].fqAnswer) {
              fillQuestion.push({
                fqId: oldarr[key].fqId,
                fqAnswer: domains[key].value,
                fqOrder: parseInt(key) + 1 //填空的序号
              });
            }
          }
          for (const key in addOptions) {
            fillQuestion.push({
              fqAnswer: newDomains[addOptions[key]].value,
              FqOrder: addOptions[key] + 1 //填空的序号
            });
          }
          console.log(fillQuestion);
          this.axios
            .post(`/api/TestPaper/ModifyQuestion`, {
              questionId: nowOption.questionId,
              questionTitle: _this.title,
              questionTypeId: nowOption.questionTypeId,
              fillQuestion: fillQuestion
            })
            .then(res => {
              console.log(res);
              this.fillQuestion = [];
              if (res.data.code == 1) {
                if (res.data.message == "数据没有变化") {
                  _this.$message({
                    type: "warning",
                    message: res.data.message
                  });
                } else if (res.data.message == "修改成功") {
                  _this.odisabled = !_this.odisabled;
                  _this.oshow = !_this.oshow;
                  _this.nowOption.questionTitle = _this.title; 
                  _this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                } else {
                  var data = res.data + "}]}}";
                  data = eval("(" + data + ")");
                  // _this.nowOption = JSON.parse(JSON.stringify(nowOption));
                  console.log(data);
                  _this.odisabled = !_this.odisabled;
                  _this.oshow = !_this.oshow;
                  _this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                }
              }else{
                    _this.$message({
                    type: "success",
                    message: res.data.message
                  });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addDomain() {
      var index = this.getCursortPosition(
        document.getElementById("textarea" + this.nowIndex3)
      );
      this.title = this.title.split("");
      this.title.splice(index, 0, "＿");
      this.title = this.title.join("");
    },
    getCursortPosition(element) {
      var CaretPos = 0;
      if (document.selection) {
        //支持IE
        element.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart("character", -element.value.length);
        CaretPos = Sel.text.length;
      } else if (element.selectionStart || element.selectionStart == "0")
        //支持firefox
        CaretPos = element.selectionStart;
      return CaretPos;
    },
    removeChoose() {
      var _this = this;
      console.log(this.nowOption);
      _this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddGapFillQuestionList.tpqId}`
        )
        .then(res => {
          if (res.data.message == "删除成功") {
            var data = {
              index: _this.nowIndex3,
              questionTypeId: 2,
              tpqScore: _this.AddGapFillQuestionList.tpqScore
            };
            _this.$emit("setQuestion", data);
          }
          _this.$message({
            type: "success",
            message: res.data.message
          });
        });
    },
    init() {
      var _this = this;
      // console.log(this.AddGapFillQuestionList)
      _this.nowOption = _this.AddGapFillQuestionList.tpqQuestion;
      _this.title = _this.nowOption.questionTitle;
    }
  },
  watch: {
    title: function(n, o) {
      var oindex = 0;
      var nindex = 0;
      var oindexArr = [];
      var nindexArr = [];
      var oarr = o.split("");
      var narr = n.split("");
      for (const key in oarr) {
        if (oarr[key] == "＿") {
          oarr[key] = oindex++;
          oindexArr.push(key);
        }
      }
      for (const key in narr) {
        if (narr[key] == "＿") {
          narr[key] = nindex++;
          nindexArr.push(key);
        }
      }
      this.IndexArr = narr; // 获取最新的分割题目数组
      var textindex = this.getCursortPosition(
        //获取文本下标
        document.getElementById("textarea" + this.nowIndex3)
      );
      if (nindexArr.length > oindexArr.length) {
        //如果添加填空
        if (this.odisabled == true) {
          for (const key in this.nowOption.fillQuestion) {
            this.AddGapFillQuestion.domains.push({
              value: this.nowOption.fillQuestion[key].fqAnswer,
              onum: this.nowOption.fillQuestion[key].fillQuestionScore[0]
                .fqsScore
            });
          }
        } else {
          if (
            nindexArr.length - oindexArr.length > 1 ||
            narr.length - oarr.length > 1
          ) {
            //一次性复制粘贴填空

            var max = 0;
            for (let i = 0; i < nindexArr.length - oindexArr.length; i++) {
              //添加多少填空
              for (let x in oindexArr) {
                if (
                  textindex - (narr.length - oarr.length) < //添加填空的位置
                  parseInt(oindexArr[x])
                ) {
                  this.AddGapFillQuestion.domains.splice(
                    oarr[parseInt(oindexArr[x])],
                    0,
                    {
                      value: "",
                      onum: 2
                    }
                  );
                  this.fillQuestion.push(oarr[parseInt(oindexArr[x])]);
                  console.log(this.AddGapFillQuestion.domains);
                  break;
                } else {
                  max++;
                }
              }
              if (max == oindexArr.length) {
                //往后添加空格
                this.AddGapFillQuestion.domains.push({
                  value: "",
                  onum: 2
                });
                this.fillQuestion.push(
                  this.AddGapFillQuestion.domains.length - 1
                );
                max = 0;
              }
            }
          } else {
            console.log(222);
            console.log(textindex);
            this.AddGapFillQuestion.domains.splice(narr[textindex], 0, {
              //按按钮操作添填空
              value: "",
              onum: 2
            });
            this.fillQuestion.push(narr[textindex]);
          }
        }
      }
      if (nindexArr.length < oindexArr.length) {
        //填空减少了

        if (
          oindexArr.length - nindexArr.length > 1 ||
          oarr.length - narr.length > 1
        ) {
          //一次性删除多个填空
          var delteArr = oarr.splice(textindex, oarr.length - narr.length);
          for (let i in delteArr) {
            if (!isNaN(delteArr[i])) {
              if (i == 0) {
                this.AddGapFillQuestion.domains.splice(delteArr[i], 1);
              } else {
                console.log(delteArr[i]);
                delteArr[i] -= 1;
                console.log(delteArr[i]);
                this.AddGapFillQuestion.domains.splice(delteArr[i], 1);
              }
            }
          }
        } else {
          this.AddGapFillQuestion.domains.splice(oarr[textindex], 1);
        }
      }
      if (nindexArr.length == 0) {
        //填空为0
        this.AddGapFillQuestion.domains = [];
      }
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.gapFilling {
  display: flex;
  margin-top: 20px;
  .gapContent {
    width: 95%;
    margin: auto;
    .view-options {
      display: flex;
      /deep/ .el-form-item__content {
        flex-wrap: wrap;
      }
    }
    .el-form-item {
      /deep/ .el-form-item__content {
        display: flex;
        margin-left: 40px !important;
        /deep/ .el-input {
          margin-right: auto;
          margin-right: 12px;
          margin-left: 12px;
        }
        .el-input__inner {
          border: none;
          border-bottom: 1px solid #ccc;
          border-radius: 0;
        }
        .el-input-number {
          border: 1px solid #ccc;
          border-radius: 8px;
          .el-input__inner {
            border-bottom: none;
            padding-left: 40px;
            padding-right: 64px;
          }
        }
        .ShowFen {
          /deep/.el-input__inner {
            // width: 25px;
            border-bottom: none;
            padding: 0px !important;
          }
        }
      }
      .el-tag {
        border-radius: 50%;
        margin-top: 12px;
      }
      .ShowDaAn {
        max-width: 80px;
      }
      .ShowFen {
        width: 20px;
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
</style>
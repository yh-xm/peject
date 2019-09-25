<template>
  <div class="GapFilling">
    <div class="gapContent">
      <el-form
        :model="dynamicValidateFormSecond"
        ref="dynamicValidateFormSecond"
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
          v-for="(domain, index) in dynamicValidateFormSecond.domains"
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
        <el-form-item label="题目预览" style="display:flex;flex-wrap:wrap;">
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='＿'">{{item}}</span>

            <el-input
              v-if="item=='＿'"
              :key="index"
              v-model="dynamicValidateFormSecond.domains[IndexArr[index]].value"
              class="ShowDaAn"
              disabled
            ></el-input>
            <span v-if="item=='＿'">(</span>
            <el-input
              v-if="item=='＿'"
              :key="item"
              v-model="dynamicValidateFormSecond.domains[IndexArr[index]].onum"
              class="ShowFen"
              disabled
            ></el-input>
            <span v-if="item=='＿'">分)</span>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain @click.prevent="fnchange">编辑</el-button>
          <el-row v-show="oshow">
            <el-button round @click.prevent="fnout" size="small">取消</el-button>
            <el-button
              type="primary"
              plain
              @click.prevent="submitForm('dynamicValidateFormSecond')"
              size="small"
            >保存修改</el-button>
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
      title: "",
      nowOption: [],
      oldOption: [],
      odisabled: true,
      oshow: false,
      dynamicValidateFormSecond: {
        domains: []
      },
      IndexArr: []
    };
  },
  props: {
    searchList3: Object,
    nowIndex3: Number
  },
  methods: {
    fnchange() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
    },
    fnout() {
      this.odisabled = !this.odisabled;
      this.oshow = !this.oshow;
      this.title = this.nowOption.questionTitle;
      this.dynamicValidateFormSecond.domains = [];
      console.log(this.nowOption);
      for (const key in this.nowOption.fillQuestion) {
        this.dynamicValidateFormSecond.domains.push({
          value: this.nowOption.fillQuestion[key].fqAnswer,
          onum: this.nowOption.fillQuestion[key].fillQuestionScore[0].fqsScore
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var fillQuestion = [];
          var nowOption = this.nowOption;
          var domains = this.$refs[formName].model.domains;
          var oldarr = this.oldOption.fillQuestion;
          console.log(domains.length);
          console.log(oldarr.length);
          var len = domains.length - oldarr.length;
          if (domains.length > oldarr.length) {
            for (let i = 0; i < len; i++) {
              fillQuestion.push({
                fqAnswer: domains[oldarr.length + i].value,
                FqOrder: oldarr.length + i + 1
              });
            }
          }
          for (const key in oldarr) {
            if (oldarr[key].fqAnswer != domains[key].value) {
              fillQuestion.push({
                fqId: oldarr[key].fqId,
                fqAnswer: domains[key].value,
                fqOrder: parseInt(key) + 1
              });
            }
          }
          console.log(fillQuestion);
          if (fillQuestion.length == 0) {
            this.$message({
              type: "warning",
              message: "数据没有变动"
            });
            this.odisabled = !this.odisabled;
            this.oshow = !this.oshow;
            return;
          }
          this.axios
            .post(`/api/TestPaper/ModifyQuestion`, {
              questionId: nowOption.questionId,
              questionTitle: this.title,
              questionTypeId: nowOption.questionTypeId,
              fillQuestion: fillQuestion
            })
            .then(res => {
              if (res.data.message == "数据没有变化") {
                this.dynamicValidateFormSecond.domains = [];
                for (const key in this.nowOption.fillQuestion) {
                  this.dynamicValidateFormSecond.domains.push({
                    value: this.nowOption.fillQuestion[key].fqAnswer,
                    onum: this.nowOption.fillQuestion[key].fillQuestionScore[0]
                      .fqsScore
                  });
                }
                this.odisabled = !this.odisabled;
                this.oshow = !this.oshow;
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              } else {
                var data = res.data + "}]}}";
                data = eval("(" + data + ")");
                console.log(data);
                this.nowOption = JSON.parse(JSON.stringify(data.data));
                this.odisabled = !this.odisabled;
                this.oshow = !this.oshow;
                this.$message({
                  type: "success",
                  message: "修改成功!"
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
      if (this.odisabled) {
        if (nindexArr.length > oindexArr.length) {
          for (const key in this.nowOption.fillQuestion) {
            this.dynamicValidateFormSecond.domains.push({
              value: this.nowOption.fillQuestion[key].fqAnswer,
              onum: this.nowOption.fillQuestion[key].fillQuestionScore[0]
                .fqsScore
            });
          }
        }
      } else {
        var textindex = this.getCursortPosition(
          document.getElementById("textarea" + this.nowIndex3)
        );
        if (nindexArr.length > oindexArr.length) {
          this.dynamicValidateFormSecond.domains.splice(textindex, 0, {
            value: "",
            onum: 2
          });
        }
      }
      if (nindexArr.length < oindexArr.length) {
        var textindex = this.getCursortPosition(
          document.getElementById("textarea" + this.nowIndex3)
        );
        this.dynamicValidateFormSecond.domains.splice(oarr[textindex], 1);
      }
      if (nindexArr.length == 0) {
        this.dynamicValidateFormSecond.domains = [];
      }
      this.IndexArr = narr;
    }
  },
  created() {
    this.oldOption = JSON.parse(JSON.stringify(this.searchList3));
    this.nowOption = this.searchList3;
    this.title = this.nowOption.questionTitle;
  }
};
</script>
<style lang="less" scoped>
.GapFilling {
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
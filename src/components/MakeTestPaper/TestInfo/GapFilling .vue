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
          <el-button round icon="el-icon-document-checked" @click="addDomain" size="small">插入填空</el-button>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="title" :rows="1" id="textarea"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateFormSecond.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

          <el-input v-model="domain.value" :placeholder="'请输入第'+(index+1)+'个空的答案'"></el-input>
          <el-input-number v-model="domain.onum" :min="1" :max="10" :key="index"></el-input-number>
        </el-form-item>
        <el-form-item label="题目预览">
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='＿'">{{item}}</span>

            <el-input
              v-if="item=='＿'"
              :key="index"
              v-model="dynamicValidateFormSecond.domains[IndexArr[index]].value"
              class="ShowDaAn"
            ></el-input>
            <span v-if="item=='＿'">(</span>
            <el-input
              v-if="item=='＿'"
              :key="item"
              v-model="dynamicValidateFormSecond.domains[IndexArr[index]].onum"
              class="ShowFen"
            ></el-input>
            <span v-if="item=='＿'">分)</span>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('dynamicValidateFormSecond')" size="small">重置</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('dynamicValidateFormSecond')"
            size="small"
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
      title: "", //题目
      dynamicValidateFormSecond: {
        domains: [] //填空
      },
      IndexArr: [] //填空下标位置
    };
  },
  methods: {
    submitForm(formName) {
      //提交表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          var tpqPaperId = sessionStorage.testPaperId;
          var tpqScore = 0;
          var fillQuestion = [];
          var domains = this.$refs[formName].model.domains;
          for (const key in domains) {
            tpqScore += parseInt(domains[key].onum);
            fillQuestion.push({
              fqOrder: key,
              fqAnswer: domains[key].value,
              fillQuestionScore: [
                {
                  fqsScore: domains[key].onum
                }
              ]
            });
          }
          this.axios
            .post(`/api/TestPaper/AddQuestionToTestPaper`, {
              tpqPaperId: tpqPaperId, //试卷的编号
              tpqScore: tpqScore, //题目的分值
              tpqQuestion: {
                questionTitle: this.title, //填空题的标题
                questionTypeId: 3,
                fillQuestion: fillQuestion
              }
            })
            .then(res => {
              if (res.data.message == "添加成功") {
                res.data.data.tpqQuestion.questionTypeId = 2;
                res.data.data.tpqQuestion.tpqId = res.data.data.tpqId; //传递题目Id
                res.data.data.tpqQuestion.score = parseInt(tpqScore); //传递题目分数
                this.$parent.pageInfo[1].bodys.push(res.data.data.tpqQuestion); //题目信息
                this.$parent.pageInfo = [...this.$parent.pageInfo];
                this.$parent.pageInfo[1].nowAdd =
                  parseInt(this.$parent.pageInfo[2].nowAdd) + 1;
                this.$parent.pageInfo[1].nowScroe =
                  parseInt(this.$parent.pageInfo[1].nowScroe) +
                  parseInt(tpqScore);
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.resetForm("dynamicValidateFormSecond");
                this.title = "";
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
    },
    addDomain() {
      //插入填空
      var index = this.getCursortPosition(document.getElementById("textarea"));
      this.title = this.title.split("");
      this.title.splice(index, 0, "＿");
      this.title = this.title.join("");
    },
    getCursortPosition(element) {
      //获取文本域的光标
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
    //监听题目变化
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
      var textindex = this.getCursortPosition(
        document.getElementById("textarea")
      );
      if (nindexArr.length > oindexArr.length) {
        this.dynamicValidateFormSecond.domains.splice(textindex, 0, {
          value: "",
          onum: 2
        });
      }
      if (nindexArr.length < oindexArr.length) {
        this.dynamicValidateFormSecond.domains.splice(oarr[textindex], 1);
      }
      if (nindexArr.length == 0) {
        this.dynamicValidateFormSecond.domains = [];
      }
      this.IndexArr = narr;
    }
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
    }
  }
}
</style>
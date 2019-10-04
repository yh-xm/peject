<template>
  <div class="GapFilling">
    <div class="gapContent">
      <el-form
        :model="AddGapFillQuestion"
        ref="AddGapFillQuestion"
        label-width="100px"
        class="demo-dynamic"
      >
      <!-- 题目 -->
        <el-form-item label="题干">
          <el-button round icon="el-icon-document-checked" @click="addDomain" size="small">插入填空</el-button>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="title" :rows="1" id="textarea"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in AddGapFillQuestion.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

          <el-input v-model="domain.value" :placeholder="'请输入第'+(index+1)+'个空的答案'"></el-input>
          <el-input-number v-model="domain.onum" :min="1" :max="10" :key="index"></el-input-number>
        </el-form-item>
        <el-form-item label="题目预览" class="view-options">
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='＿'">{{item}}</span>

            <el-input
              v-if="item=='＿'"
              :key="index"
              v-model="AddGapFillQuestion.domains[IndexArr[index]].value"
              class="ShowDaAn"
            ></el-input>
            <span v-if="item=='＿'">({{AddGapFillQuestion.domains[IndexArr[index]].onum}}分)</span>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('AddGapFillQuestion')" size="small">重置</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('AddGapFillQuestion')"
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
      AddGapFillQuestion: {
        domains: [] //填空
      },
      IndexArr: [] //填空下标位置
    };
  },
  methods: {
    /**
     * 新增题目
     *  {Number} testPaperId 试卷Id
     * @param {object} formName 点击当前表单
     *
     */
    submitForm(formName) {
      var _this = this;
      var datas = {
        tpqId: 7042,
        tpqPaperId: 4476,
        tpqQuestionId: 7139,
        tpqScore: 4,
        tpqQuestion: {
          questionId: 7139,
          questionTitle: "w＿w＿",
          questionTypeId: 3,
          answerQuestion: null,
          chooseQuestion: [],
          fillQuestion: [
            {
              fqId: 7251,
              fqQuestionId: 7139,
              fqAnswer: "w",
              fillQuestionScore: [
                {
                  fqsFilleQuestionId: 7251,
                  fqsPaperQuestionId: 7042,
                  fqsScore: 2
                }
              ]
            },
            {
              fqId: 7252,
              fqQuestionId: 7139,
              fqAnswer: "w",
              fillQuestionScore: [
                {
                  fqsFilleQuestionId: 7252,
                  fqsPaperQuestionId: 7042,
                  fqsScore: 2
                }
              ]
            }
          ]
        }
      };
     datas.tpqQuestion.questionTypeId = 2;
      var data = {
        bodys: datas,
        questionTypeId: 2
      };
      this.$emit("addGapFilling", data);

      //提交表单
      // _this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     var tpqPaperId = sessionStorage.testPaperId;
      //     var tpqScore = 0;
      //     var fillQuestion = [];
      //     var domains = _this.$refs[formName].model.domains;
      //     for (const key in domains) {
      //       tpqScore += parseInt(domains[key].onum);
      //       fillQuestion.push({
      //         fqOrder: key,
      //         fqAnswer: domains[key].value,
      //         fillQuestionScore: [
      //           {
      //             fqsScore: domains[key].onum
      //           }
      //         ]
      //       });
      //     }
      //     _this.axios
      //       .post(`/api/TestPaper/AddQuestionToTestPaper`, {
      //         tpqPaperId: tpqPaperId, //试卷的编号
      //         tpqScore: tpqScore, //题目的分值
      //         tpqQuestion: {
      //           questionTitle: _this.title, //填空题的标题
      //           questionTypeId: 3,
      //           fillQuestion: fillQuestion
      //         }
      //       })
      //       .then(res => {
      //         console.log(res);
      //         if (res.data.message == "添加成功") {
      //           sessionStorage.data = JSON.stringify(res.data.data);
      //           console.log(res.data.data)
      //           res.data.data.tpqQuestion.questionTypeId = 2;
      //           var data = {
      //             bodys: res.data.data,
      //             questionTypeId: 2
      //           };
      //           this.$emit("addGapFilling", data);
      //           this.resetForm("AddGapFillQuestion");
      //           this.title = "";
      //           this.resetForm("AddGapFillQuestion");
      //           this.title = "";
      //         }
      //       });
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    /**
     * 重置表单
     * @param {object} formName 当前表单
     */
    resetForm(formName) {
      // 重置表单
      var _this = this;
      _this.$refs[formName].resetFields();
    },
    /**
     * 插入填空
     *  {function} getCursortPosition 获取文本光标
     */
    addDomain() {
      //插入填空
      var _this = this;
      var index = _this.getCursortPosition(document.getElementById("textarea"));
      _this.title = _this.title.split("");
      _this.title.splice(index, 0, "＿");
      _this.title = _this.title.join("");
    },
    /**
     * 获取文本光标
     *  {function} getCursortPosition 获取文本光标
     * document.selection.createRange()
     * 根据当前文字选择返回 TextRange 对象
     * moveStart 更改范围开始位置
     * selectionStart --兼容所有浏览器
     */
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
  /**
   * 监听题目的变化
   * o 旧值
   * n 新值
   * oindexArr 旧空格下标数组
   * nindexArr 新空格下标数组
   * oarr 旧题目分割数组
   * narr 新题目分割数组
   * AddGapFillQuestion.domains 添加的空格数组
   */
  watch: {
    //监听题目变化
    title: function(n, o) {
      var _this = this;
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
        }else {
          oarr[key] = "*";
        }
      }
      for (const key in narr) {
        if (narr[key] == "＿") {
          narr[key] = nindex++;
          nindexArr.push(key);
        } else {
          narr[key] = "*";
        }
      }
      var textindex = _this.getCursortPosition(
        //获取文本下标
        document.getElementById("textarea")
      );
      if (nindexArr.length > oindexArr.length) {
        //如果添加填空
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
                // console.log(_this.AddGapFillQuestion.domains);
                break;
              } else {
                max++;
              }
            }
            if (max == oindexArr.length) {
              //往后添加空格
              _this.AddGapFillQuestion.domains.push({
                value: "",
                onum: 2
              });
              max = 0;
            }
          }
        } else {
          _this.AddGapFillQuestion.domains.splice(narr[textindex], 0, {
            //按按钮操作添填空
            value: "",
            onum: 2
          });
        }
      }
      if (nindexArr.length < oindexArr.length) {
        //填空减少了
            for (let i in oindexArr) {
            if (parseInt(oindexArr[i])>=textindex&&parseInt(oindexArr[i])<=textindex+oarr.length - narr.length) {
            _this.AddGapFillQuestion.domains.splice(i, oindexArr.length - nindexArr.length);
            break;
            }
          }
      }
      if (nindexArr.length == 0) {
        //填空为0
        _this.AddGapFillQuestion.domains = [];
      }
      _this.IndexArr = narr; // 获取最新的分割题目数组
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
        max-width: 50px;
      }
      .ShowFen {
        width: 20px;
      }
    }
  }
}
</style>
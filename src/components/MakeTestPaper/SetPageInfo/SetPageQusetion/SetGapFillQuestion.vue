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
      oldOption: [],
      odisabled: true,
      oshow: false,
      AddGapFillQuestion: {
        domains: []
      },
      IndexArr: []
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          var fillQuestion = [];
          var nowOption = this.nowOption;
          var domains = this.$refs[formName].model.domains;
          var oldarr = this.oldOption.fillQuestion;
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
                this.AddGapFillQuestion.domains = [];
                for (const key in this.nowOption.fillQuestion) {
                  this.AddGapFillQuestion.domains.push({
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
                this.oldOption = JSON.parse(JSON.stringify(data.data));
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
    },
    removeChoose() {
      console.log(this.nowOption);
      this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${this.nowOption.tpqId}`
        )
        .then(res => {
          if (res.data.message == "删除成功") {

          }
          this.$message({
            type: "success",
            message: res.data.message
          });
        });
    },
    init(){
          // console.log(this.AddGapFillQuestionList)
    this.oldOption = JSON.parse(
      JSON.stringify(this.AddGapFillQuestionList.tpqQuestion)
    );
    this.nowOption = this.AddGapFillQuestionList.tpqQuestion;
    this.title = this.nowOption.questionTitle;
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
        document.getElementById("textarea"+this.nowIndex3)
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
                max = 0;
              }
            }
          } else {
            console.log(222);
            console.log(textindex)
            this.AddGapFillQuestion.domains.splice(narr[textindex], 0, {
              //按按钮操作添填空
              value: "",
              onum: 2
            });
          }
        }
      }
      if (nindexArr.length < oindexArr.length) {
        //填空减少了
              
      if (
         oindexArr.length - nindexArr.length > 1 ||
          oarr.length - narr.length > 1
        ) {    //一次性删除多个填空
          var delteArr =  oarr.splice(textindex,oarr.length-narr.length)
            for(let i in  delteArr){
              if(!isNaN(delteArr[i])){
                if(i==0){
                      this.AddGapFillQuestion.domains.splice(delteArr[i],1)
                }else{
                  console.log(delteArr[i])
                  delteArr[i]-=1;
                  console.log(delteArr[i])
                   this.AddGapFillQuestion.domains.splice(delteArr[i],1)
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
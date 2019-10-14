<!--
添加填空题组件

  引用 import AddGapFilling 
  from "@/components/MakeTestPaper/SetPageInfo/AddGapFilling"; //添加选择题组件

   注册    components:{AddGapFilling},
     当标签使用    
          <add-gap-filling
          @addGapFilling="addQuestion" 添加题目时触发的事件
           />

-->


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
            <span v-if="item!='▁'">{{item}}</span>

            <el-input
              v-if="item=='▁'"
              :key="index"
              v-model="AddGapFillQuestion.domains[optionsIndexArr[index]].value"
              class="ShowDaAn"
              :style="{width:`${AddGapFillQuestion.domains[optionsIndexArr[index]].olength}`}"
            ></el-input>
            <span v-if="item=='▁'">({{AddGapFillQuestion.domains[optionsIndexArr[index]].onum}}分)</span>
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
      optionsIndexArr: [] //填空下标位置
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
      //提交表单
      _this.$refs[formName].validate(valid => {
        if (valid) {
          var tpqPaperId = sessionStorage.testPaperId; //试卷Id
          var tpqScore = 0; //分数
          var fillQuestion = []; //接口传递的参数数组
          var domains = _this.$refs[formName].model.domains;
          for (const key in domains) {
            tpqScore += parseInt(domains[key].onum);
            fillQuestion.push({
              fqOrder: key, //序号
              fqAnswer: domains[key].value, //答案
              fillQuestionScore: [
                //分数
                {
                  fqsScore: domains[key].onum
                }
              ]
            });
          }
          _this.axios
            .post(`/api/TestPaper/AddQuestionToTestPaper`, {
              tpqPaperId: tpqPaperId, //试卷的编号
              tpqScore: tpqScore, //题目的分值
              tpqQuestion: {
                questionTitle: _this.title, //填空题的标题
                questionTypeId: 3, //题目类型编号
                fillQuestion: fillQuestion //题目信息
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.message == "添加成功") {
                res.data.data.tpqQuestion.questionTypeId = 2;
                var data = {
                  bodys: res.data.data, //传递题目信息
                  questionTypeId: 2 //题目类型Id
                };
                _this.$emit("addGapFilling", data); //改变父组件的值
                _this.$msg(_this, 1, "添加成功!");
                _this.resetForm("AddGapFillQuestion"); //重置表单
                _this.title = ""; //重置题目
              } else {
                _this.$msg(_this, -1, res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
      _this.title.splice(index, 0, "▁");
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
    /**
     * 改变填空的答案长度
     */
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
      var oindex = 0; //旧字符串数组下标
      var nindex = 0; //新字符串数组下标
      var oindexArr = []; //旧填空数组
      var nindexArr = []; //新填空数组
      var oarr = o.split(""); //旧题目字符串变成数组
      var narr = n.split(""); //新题目字符串变成数组
      var nowAddOption = { value: "", onum: 2 }; //需要添加的填空信息
      for (const key in oarr) {
        if (oarr[key] == "▁") {
          oarr[key] = oindex++; //填空的下标 第几个填空
          oindexArr.push(key); //存入旧填空数组
        } else {
          oarr[key] = "*"; //存入旧填空数组
        }
      }
      for (const key in narr) {
        if (narr[key] == "▁") {
          narr[key] = nindex++; //填空的下标 第几个填空
          nindexArr.push(key); //存入旧填空数组
        } else {
          narr[key] = "*"; //不是填空变为*
        }
      }
      var textindex = _this.getCursortPosition(
        //获取文本下标
        document.getElementById("textarea")
      );
      if (nindexArr.length > oindexArr.length) {
        //新的字符串长度大于旧字符串的长度
        //如果添加填空
        if (nindexArr.length - oindexArr.length > 1) {
          //更改的长度大于1 复制粘贴操作
          //一次性复制粘贴填空
          var max = 0;
          for (let i = 0; i < nindexArr.length - oindexArr.length; i++) {
            //添加多少填空
            for (let x in oindexArr) {
              //添加填空的位置
              if (
                textindex - (narr.length - oarr.length) <
                parseInt(oindexArr[x])
              ) {
                //在哪个位置插入
                this.AddGapFillQuestion.domains.splice(
                  oarr[parseInt(oindexArr[x])],
                  0,
                  JSON.parse(JSON.stringify(nowAddOption))
                );
                break;
              } else {
                max++;
              }
            }
            if (max == oindexArr.length) {
              //大于所有旧填空下标，则是往后插入。
              //往后添加空格
              _this.AddGapFillQuestion.domains.push(JSON.parse(JSON.stringify(nowAddOption)));
              max = 0; //清空
            }
          }
        } else {
          console.log(textindex)
          console.log(oindexArr)
          if (narr.length - oarr.length > 1) {
            for (let i in oindexArr) {
              if (textindex < oindexArr[i]) {
                _this.AddGapFillQuestion.domains.splice(i, 0, JSON.parse(JSON.stringify(nowAddOption))); // 粘贴多个文字一个填空
                break;
              }
            }
          } else {
            _this.AddGapFillQuestion.domains.splice(
              narr[textindex],
              0,
              JSON.parse(JSON.stringify(nowAddOption))
            );
          }
          //按按钮操作添填空
        }
      }
      if (nindexArr.length < oindexArr.length) {
        //填空减少了
        for (let i in oindexArr) {
          //从哪里开始减少  减少了多少个填空
          if (
            parseInt(oindexArr[i]) >= textindex &&
            parseInt(oindexArr[i]) <= textindex + oarr.length - narr.length
          ) {
            _this.AddGapFillQuestion.domains.splice(
              i,
              oindexArr.length - nindexArr.length
            );
            break;
          }
        }
      }
      if (nindexArr.length == 0) {
        //填空为0
        _this.AddGapFillQuestion.domains = [];
      }
      _this.optionsIndexArr = narr; // 获取最新的分割题目数组
    },
    AddGapFillQuestion: {
      handler(n, o) {
        var that = this;
        for (let i = 0; i < that.AddGapFillQuestion.domains.length; i++) {
          that.AddGapFillQuestion.domains[i].olength =
            parseInt(that.AddGapFillQuestion.domains[i].value.length) * 12 +
            35 +
            "px";
        }
        console.log(n);
      },
      immediate: true,
      deep: true
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
            border-bottom: none;
            padding: 0px !important;
          }
        }
      }
      .el-tag {
        border-radius: 50%;
        margin-top: 12px;
      }

      .ShowFen {
        width: 20px;
      }
    }
  }
}
</style>
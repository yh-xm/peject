<!--
维护填空题组件

  引用  import SetGapFillQuestion from 
  "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetGapFillQuestion"; 
   注册    components:{SetGapFillQuestion},
     当标签使用    
 :AddChooseQuestionList="items" 传入题目信息
:nowIndex="indexs" 传入题号
@setQuestion="setQuestion" 进行维护时触发的方法
 @changeScore="changeScore" 修改分数时触发的方法
-->


<template>
  <div class="gapFilling">
    <div class="gapContent">
      <el-form :model="nowOption" ref="nowOption" label-width="100px" class="demo-dynamic">
        {{nowIndex3+1}}、
        <el-form-item class="view-options" v-show="!oshow">
          <!-- 题目预览 没有编辑状态-->
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='▁'">{{item}}</span>
            <el-input
              v-if="item=='▁'"
              :key="index"
              v-model="nowOption.fillQuestion[optionsIndexArr[index]].fqAnswer"
              class="ShowDaAn"
            ></el-input>
            <el-input-number
              @change="changeScore"
              v-if="item=='▁'"
              size="small"
              :min="1"
              :max="5"
              v-model="nowOption.fillQuestion[optionsIndexArr[index]].fillQuestionScore[0].fqsScore"
            ></el-input-number>
          </el-row>
          <!-- 题目预览/编辑  编辑状态-->
        </el-form-item>
        <el-form-item :label="$t('test.makep13')" v-show="oshow">
          <el-button round icon="el-icon-document-checked" @click="addDomain" size="small">插入填空</el-button>
        </el-form-item>
        <el-form-item v-show="oshow">
          <el-input type="textarea" v-model="title" :rows="1" :id="'textarea'+nowIndex3"></el-input>
        </el-form-item>
        <el-form-item
          v-show="oshow"
          v-for="(domain, index) in nowOption.fillQuestion"
          :key="domain.key"
          :rules="fillQuestion.fqAnswer"
          :prop="'fillQuestion.' + index + '.fqAnswer'"
        >
          <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

          <el-input v-model="domain.fqAnswer" :placeholder="'请输入第'+(index+1)+'个空的答案'"></el-input>
        </el-form-item>
        <el-form-item label="题目预览" class="view-options" v-show="oshow">
          <el-row v-for="(item,index) in title" :key="index">
            <span v-if="item!='▁'">{{item}}</span>
            <el-input
              v-if="item=='▁'"
              :key="index"
              v-model="nowOption.fillQuestion[optionsIndexArr[index]].fqAnswer"
              class="ShowDaAn"
              disabled
            ></el-input>
            <span
              v-if="item=='▁'"
            >({{nowOption.fillQuestion[optionsIndexArr[index]].fillQuestionScore[0].fqsScore}}分)</span>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain @click.prevent="compile" >{{$t('btn.c')}}</el-button>
          <transition name="slide-fade">
          <el-row v-show="oshow">
            <el-button round @click.prevent="cancel" size="small">{{$t('btn.res')}}</el-button>
            <el-button
              type="primary"
              plain
              @click.prevent="submitForm('nowOption')"
              size="small"
            >{{$t('btn.s')}}</el-button>
            <el-button type="danger" plain @click.prevent="removeChoose" size="small">{{$t('btn.d')}}</el-button>
          </el-row>
          </transition>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "setGapfillQuestion", //维护填空题
  data() {
    return {
      title: "", //题目
      nowOption: {}, //当前数据
      oldOption: [], //历史数据
      oshow: false, //编辑状态
      optionsIndexArr: [], //填空下标数组
      fillQuestion: [] //存储插入的填空下标数组
    };
  },
  props: {
    AddGapFillQuestionList: Object, //传入的题目信息
    nowIndex3: Number //传入的题号
  },
  methods: {
    /**
     * 点击编辑
     *
     */
    compile() {
      this.oshow = !this.oshow; //点击编辑
    },
    /**
     * 点击取消
     *
     */
    cancel() {
      var _this = this;
      _this.oshow = !_this.oshow;
      _this.title = _this.oldOption.questionTitle;
      _this.nowOption = JSON.parse(JSON.stringify(_this.oldOption)); //点击取消
    },
    /**
     * 点击保存修改
     * @param {object} formName 点击当前表单
     */
    submitForm(formName) {
      //保存修改
      var _this = this;
      var changeQuestion = [];
      this.$refs[formName].validate(valid => {
        if (valid) {
          var testNowOption = JSON.parse(
            JSON.stringify(_this.nowOption.fillQuestion)
          );
          var testOldOption = [];
          for (const key in testNowOption) {
            if (testNowOption[key].fqId == undefined) {
              changeQuestion.push({
                fqOrder: parseInt(key) + 1, //填空的序号
                fqAnswer: testNowOption[key].fqAnswer ///表示新增
              });
            } else {
              changeQuestion.push({
                fqOrder: parseInt(key) + 1, //填空的序号
                fqAnswer: testNowOption[key].fqAnswer, ///表示修改
                fqId: testNowOption[key].fqId
              });
            }
          }

          //是否添加填空
          var value = _this.AddGapFillQuestionList.tpqId; //获取题目Id
          _this.$post(`/api/TestPaper/ModifyQuestion?paperQuestionId=` + value, {
              questionId: _this.nowOption.questionId, //题目Id
              questionTitle: _this.title, //题目
              questionTypeId: _this.nowOption.questionTypeId, //题目类型
              fillQuestion: changeQuestion //题目信息
            })
            .then(res => {
              if (res.code == undefined) {
                console.log(res);
                var data = res + "}]}}";
                data = eval("(" + data + ")");
                console.log(data);
                _this.nowOption.questionTitle = _this.title; //更新题目
                _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新旧信息
                _this.oshow = !_this.oshow;
                _this.$msg(_this, 1, data.message);
                _this.changeScore();
              } else {
                console.log(666);
                _this.$msg(_this, res.code, res.message);
                _this.nowOption.questionTitle = _this.title; //更新题目
                _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新旧信息
                _this.oshow = !_this.oshow;
              }
            });
          _this.fillQuestion = [];
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 重置表单
     *@param {object} formName 点击当前表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 插入填空
     *
     */
    addDomain() {
      var that = this;
      var index = that.getCursortPosition(
        document.getElementById("textarea" + that.nowIndex3) //获取文本域
      );
      that.title = that.title.split("");
      that.title.splice(index, 0, "▁"); //插入填空
      that.title = that.title.join("");
    },
    /**
     * 获取文本光标
     *  getCursortPosition 获取文本光标
     * document.selection.createRange()
     * 根据当前文字选择返回 TextRange 对象
     * moveStart 更改范围开始位置
     * selectionStart --兼容所有浏览器
     */
    getCursortPosition(element) {
      var CaretPos = 0;
      if (document.selection) {
        //支持IE
        element.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart("character", -element.value.length); //获取光标位置
        CaretPos = Sel.text.length;
      } else if (element.selectionStart || element.selectionStart == "0")
        //支持firefox
        CaretPos = element.selectionStart;
      return CaretPos;
    },
    /**
     *删除题目
     *
     */
    removeChoose() {
      var _this = this;
      _this.$post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddGapFillQuestionList.tpqId}` //获取题目Id
        )
        .then(res => {
          if (res.message == "删除成功") {
            var data = {
              index: _this.nowIndex3,//题号
              questionTypeId: 2,//题目类型
              tpqScore: _this.AddGapFillQuestionList.tpqScore//题目分数
            };
            _this.$msg(_this, 1, res.message);
            _this.$emit("setQuestion", data);
          } else {
            _this.$msg(_this, -1, res.message);
          }
        });
    },
    /**
     *修改分数
     *@param {Number} v 当前数字
     */
    changeScore(v) {
      var _this = this;
      var fillQuestion = _this.nowOption.fillQuestion;
      _this.AddGapFillQuestionList.fqsScore = 0; //清空分数
      var fillQuestionScore = [];
      for (const key in fillQuestion) {
        //算出所有填空的总分
        _this.AddGapFillQuestionList.fqsScore += //累加填空的分数
          fillQuestion[key].fillQuestionScore[0].fqsScore;
        fillQuestionScore.push(fillQuestion[key].fillQuestionScore[0]);
      }
      _this.$post(
          `/api/TestPaper/ModifyScore`,
          {
            tpqId: _this.AddGapFillQuestionList.tpqId, //主键编号
            tpqScore: _this.AddGapFillQuestionList.fqsScore, //填空题分值
            fillQuestionScore: fillQuestionScore
          } //修改题目分值
        )
        .then(res => {
          if (res.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新题目信息
            var data = {
              index: 1, //问题所在下标
              fqsScore: _this.AddGapFillQuestionList.fqsScore, //问题分数
              fqIndex: _this.nowIndex3 //问题题号
            };
            _this.$msg(_this, 1, "修改成功!");
            _this.$emit("changeScore", data); //修改父组件的分数信息
          } else {
            _this.$msg(_this, -1, "分数没有变化");
          }
        });
    },
    /**
     *初始化
     */
    init() {
      var _this = this;
      _this.nowOption = _this.AddGapFillQuestionList.tpqQuestion; //获取题目信息
      _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //克隆题目信息
      _this.title = _this.nowOption.questionTitle; //获取题目
    }
  },
  //监听题目的变化
  watch: {
    title: function(n, o) {
      var _this = this;
      var oindex = 0; //旧字符串数组下标
      var nindex = 0; //新字符串数组下标
      var oindexArr = []; //旧填空数组
      var nindexArr = []; //新填空数组
      var oarr = o.split(""); //旧题目字符串变成数组
      var narr = n.split(""); //新题目字符串变成数组
      var nowAddOption = {
        fqAnswer: "", //插入填空答案
        fillQuestionScore: [
          {
            fqsScore: 1 //默认分数
          }
        ]
      };
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
      _this.optionsIndexArr = narr; // 获取最新的分割题目数组
      var textindex = _this.getCursortPosition(
        //获取文本下标
        document.getElementById("textarea" + _this.nowIndex3)
      );
      if (nindexArr.length > oindexArr.length) {
        //如果添加填空
        if (_this.oshow == false) {
          return;
        } else {
          if (nindexArr.length - oindexArr.length > 1) {
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
                  //在最后之前位置插入填空
                  _this.nowOption.fillQuestion.splice(
                    oarr[parseInt(oindexArr[x])],
                    0,
                    JSON.parse(JSON.stringify(nowAddOption))
                  );
                  _this.fillQuestion.push(oarr[parseInt(oindexArr[x])]); //获取插入填空的位置
                  break;
                } else {
                  max++;
                }
              }
              if (max == oindexArr.length) {
                //在末尾插入填空
                //往后添加空格
                _this.nowOption.fillQuestion.push(JSON.parse(JSON.stringify(nowAddOption)));
                _this.fillQuestion.push(
                  _this.nowOption.fillQuestion.length - 1
                ); //获取插入填空的位置
                max = 0;
              }
            }
          } else {
            if (narr.length - oarr.length > 1) {
              for (let i in oindexArr) {
                if (textindex < oindexArr[i]) {
                  _this.nowOption.fillQuestion.splice(i, 0, JSON.parse(JSON.stringify(nowAddOption))); // 粘贴多个文字一个填空
                  break;
                }
              }
            } else {
              // 按插入按钮进行插入
              _this.nowOption.fillQuestion.splice( 
                narr[textindex],
                0,
                nowAddOption
              );
            }

            _this.fillQuestion.push(narr[textindex]); //获取插入填空的位置
          }
        }
      }
      if (nindexArr.length < oindexArr.length) {
        //填空减少了
        var textindex = _this.getCursortPosition(
          //获取文本下标
          document.getElementById("textarea" + _this.nowIndex3)
        );

        for (let i in oindexArr) {
          if (
            parseInt(oindexArr[i]) >= textindex &&
            parseInt(oindexArr[i]) <= textindex + oarr.length - narr.length
          ) {
            _this.nowOption.fillQuestion.splice(
              i,
              oindexArr.length - nindexArr.length
            ); //一次性删除多个填空
            break;
          }
        }
      }
      if (nindexArr.length == 0) {
        //填空为0
        _this.nowOption.fillQuestion = [];
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
        max-width: 180px;
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
    .slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(20px);
  opacity: 0;
}
}
</style>
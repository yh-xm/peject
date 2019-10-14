<!--
维护问答题组件

  引用  import SetAnswerQuestion from 
  "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetAnswerQuestion"; 
   注册    components:{SetAnswerQuestion},
     当标签使用    
 :AddChooseQuestionList="items" 传入题目信息
:nowIndex="indexs" 传入题号
@setQuestion="setQuestion" 进行维护时触发的方法
 @changeScore="changeScore" 修改分数时触发的方法
-->
<template>
  <div>
    <div class="essat-content">
      <!-- 小题编号 -->
      <div class="option-title">{{nowIndex2+1}}、</div>
      <div class="option-content">
        <!-- 题目 -->
        <el-form :model="nowOption" ref="nowOption" class="demo-dynamic">
          <el-form-item prop="title">
            <span v-if="odisabled">
              {{nowOption.tpqQuestion.questionTitle}}
              <el-input-number
                size="small"
                v-model="nowOption.tpqScore"
                :min="1"
                :max="50"
                @change="changeScore"
              ></el-input-number>
            </span>
            <el-input
              type="textarea"
              v-model="nowOption.tpqQuestion.questionTitle"
              :rows="1"
              v-if="!odisabled"
            ></el-input>
           
          </el-form-item>
          <!-- 答案 -->
          <el-form-item>
            <el-tag type="info">参考答案</el-tag>
        
          </el-form-item>
          <el-form-item>
             <Editor  v-if="!odisabled" v-model="nowOption.tpqQuestion.answerQuestion.aqAnswer"/>
              <p v-if="odisabled" v-html="nowOption.tpqQuestion.answerQuestion.aqAnswer"></p>
               </el-form-item>
          <el-form-item>
            <!-- 编辑 -->
            <el-button type="primary" plain @click.prevent="compile" size="small">编辑</el-button>
            <el-row v-show="oshow">
              <el-button round @click.prevent="cancel" size="small">取消</el-button>
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
 import Editor from '../TextEditor'
export default {
      components: {
      Editor
    },
  data() {
    return {
      nowOption: [], //当前题目信息
      oldOption: [], //克隆题目信息
      odisabled: true, //编辑状态
      oshow: false //显示
    };
  },
  props: {
    AddEssayQuestiontList: Object, //父组件传递的题目信息
    nowIndex2: Number //题目编号
  },
  methods: {
    /**
     * 编辑表单
     */
    compile() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
    },
    /**
     * 取消操作
     * @param {object} formName 当前表单
     */
    cancel() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
      _this.nowOption = JSON.parse(JSON.stringify(_this.oldOption));
    },
    /**
     * 修改题目信息
     *
     */
    saveOption() {
      var _this = this;
      var nowOption = _this.nowOption;
      var value = _this.AddEssayQuestiontList.tpqId; //获取题目Id
      _this.axios
        .post(`/api/TestPaper/ModifyQuestion?paperQuestionId=` + value, {
          questionId: nowOption.tpqQuestion.questionId, //题目Id
          questionTitle: nowOption.tpqQuestion.questionTitle, //题目名称
          questionTypeId: nowOption.tpqQuestion.questionTypeId, //题目类型
          answerQuestion: {
            aqAnswer: nowOption.tpqQuestion.answerQuestion.aqAnswer //答案
          }
        })
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新旧信息
            _this.odisabled = !_this.odisabled;
            _this.oshow = !_this.oshow;
            _this.$msg(_this, 1, res.data.message);
          } else {
            _this.$msg(_this, -1, res.data.message);
          }
        });
    },
    /**
     * 删除题目
     *  {Number} this.AddEssayQuestiontList.tpqId 题目Id
     */
    removePageInfoItem() {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddEssayQuestiontList.tpqId}`
        )
        .then(res => {
          if (res.data.message == "删除成功") {
            var data = {
<<<<<<< HEAD
              index: _this.nowIndex2,//题号
              questionTypeId: 3,//题目类型
              tpqScore: _this.AddEssayQuestiontList.tpqScore//题目分数
            };
            this.$emit("setQuestion", data);//改变父组件的分数
=======
              index: _this.nowIndex2, //题号
              questionTypeId: 3, //题目类型
              tpqScore: _this.AddEssayQuestiontList.tpqScore //题目分数
            };
            _this.$emit("setQuestion", data);
            _this.$msg(_this, 1, res.data.message);
          } else {
            _this.$msg(_this, -1, res.data.message);
>>>>>>> ed7669cc707a9d36ef26660a2f502e57043e568b
          }
        });
    },
    /**
     * 修改题目分数
     * 
     */
    changeScore(v) {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/ModifyScore`,
          {
            tpqId: _this.nowOption.tpqId, //主键编号
            tpqScore: v //要修改的分值
          } //修改题目分值
        )
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption));
            var data = {
              index: 2, //题目下标
              fqsScore: v, //题目分数
              fqIndex: _this.nowIndex2 //题号
            };
            _this.$msg(_this, 1, "修改成功!");
            _this.$emit("changeScore", data);
          } else {
            _this.$msg(_this, -1, res.data.message);
          }
        });
    },
    /**
     * 初始化
     */
    init() {
      var _this = this;
      _this.oldOption = JSON.parse(JSON.stringify(_this.AddEssayQuestiontList)); //获取题目信息
      _this.nowOption = _this.AddEssayQuestiontList; //获取题目信息
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.essat-content {
  text-align: left;
  display: flex;
  .option-title {
    display: inline;
  }
  .option-content {
    width: 80%;
    .el-form-item__content {
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
}
</style>
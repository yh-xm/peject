<!--
维护问答题组件

  引用  import SetAnswerQuestion from 
  "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetAnswerQuestion"; 
   注册    components:{SetAnswerQuestion},
     当标签使用    
 :addChooseQuestionList="items" 传入题目信息
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
            <el-tag type="info">{{$t('test.makep14')}}</el-tag>
          </el-form-item>
          <el-form-item>
            <Editor v-if="!odisabled" v-model="nowOption.tpqQuestion.answerQuestion.aqAnswer" />
            <p v-if="odisabled" v-html="nowOption.tpqQuestion.answerQuestion.aqAnswer"></p>
          </el-form-item>
          <el-form-item>
            <!-- 编辑 -->
            <el-button type="primary" plain @click.prevent="compile">{{$t('btn.c')}}</el-button>
            <transition name="slide-fade">
              <el-row v-show="oshow">
                <el-button round @click.prevent="cancel" size="small">{{$t('btn.res')}}</el-button>
                <el-button
                  type="primary"
                  plain
                  @click.prevent="saveOption"
                  size="small"
                >{{$t('btn.s')}}</el-button>
                <el-button
                  type="danger"
                  plain
                  @click.prevent="removePageInfoItem"
                  size="small"
                >{{$t('btn.d')}}</el-button>
              </el-row>
            </transition>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "../TextEditor";
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
    addEssayQuestiontList: Object, //父组件传递的题目信息
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
      var value = _this.addEssayQuestiontList.tpqId; //获取题目Id
      _this
        .$post(`/api/TestPaper/ModifyQuestion?paperQuestionId=` + value, 
         nowOption.tpqQuestion
        )
        .then(res => {
          if (res.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption)); //更新旧信息
            _this.odisabled = !_this.odisabled;
            _this.oshow = !_this.oshow;
            _this.$msg(_this, 1, _this.$t("mesTips.modifySuccess"));
          } else {
            if (res.message == "数据没有变化") {
              _this.$msg(_this, -1, _this.$t("mesTips.dataChange"));
            } else {
              _this.$msg(_this, -1, _this.$t("mesTips.systemError"));
            }
          }
        });
    },
    /**
     * 删除题目
     *  {Number} this.addEssayQuestiontList.tpqId 题目Id
     */
    removePageInfoItem() {
      var _this = this;
      _this
        .$post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.addEssayQuestiontList.tpqId}`
        )
        .then(res => {
          console.log(res);
          if (res.message == "删除成功") {
            var data = {
              index: _this.nowIndex2, //题号
              questionTypeId: 3, //题目类型
              tpqScore: _this.addEssayQuestiontList.tpqScore //题目分数
            };
            _this.$emit("setQuestion", data);
            _this.$msg(_this, 1, _this.$t("mesTips.deleteSuccess"));
          } else {
            _this.$msg(_this, -1, _this.$t("mesTips.systemError"));
          }
        });
    },
    /**
     * 修改题目分数
     *
     */
    changeScore(v) {
      var _this = this;
      _this
        .$post(
          `/api/TestPaper/ModifyScore`,
          {
            tpqId: _this.nowOption.tpqId, //主键编号
            tpqScore: v //要修改的分值
          } //修改题目分值
        )
        .then(res => {
          console.log(res);
          if (res.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption));
            var data = {
              index: 2, //题目下标
              fqsScore: v, //题目分数
              fqIndex: _this.nowIndex2 //题号
            };
            _this.$msg(_this, 1, _this.$t("mesTips.modifySuccess"));
            _this.$emit("changeScore", data);
          } else {
            _this.$msg(_this, -1, _this.$t("mesTips.systemError"));
          }
        });
    },
    /**
     * 初始化
     */
    init() {
      var _this = this;
      _this.oldOption = JSON.parse(JSON.stringify(_this.addEssayQuestiontList)); //获取题目信息
      _this.nowOption = _this.addEssayQuestiontList; //获取题目信息
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
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(20px);
    opacity: 0;
  }
}
</style>
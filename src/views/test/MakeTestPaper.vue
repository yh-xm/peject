<template>
  <div id="MakeTestPaper">
    <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('base.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.r1')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- 步骤条 -->
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="试卷信息"></el-step>
        <el-step title="添加题目"></el-step>
        <el-step title="完成制作"></el-step>
      </el-steps>

      <begin-make v-if="active==0"></begin-make>
      <div id="TestInfo" v-if="active==1">
        <div class="tabs">
          <div class="left-list">
              <question-sectect 
              :select="false" 
              :defaultSelect="0"
              v-model="nowAddOption"
              @questionInit="questionInit" 
              />
            </div>
        

          <div class="right-button">
            <el-button type="primary" @click="fnover">完成制卷</el-button>
          </div>
        </div>
        <div class="content-view">
          <add-multiple-choice v-if="nowAddOption==0" @addMultipleChoice="addQuestion" />
          <add-gap-filling v-if="nowAddOption==1" @addGapFilling="addQuestion" />
          <add-essay-question v-if="nowAddOption==2" @addEssayQuestion="addQuestion" />
        </div>
        <div class="bottom-view" :data-t="pageInfo">
          <el-card class="box-card" v-for="(item,index) in pageInfo" :key="index">
            <div slot="header" class="clearfix">
              <span>
                {{index+1 | questionsIndex}}{{item.typeName}}（本题共{{item.nowAdd}}道小题，共
                <el-tag type="danger" effect="dark" size="small">{{item.nowScroe}}/{{sumSoce}}</el-tag>分）
              </span>
            </div>
            <div v-for="(items,indexs) in item.bodys" :key="indexs" class="text item">
              <SetChooseQuestion
                v-if="items.tpqQuestion.questionTypeId=='1'?true:false"
                :AddChooseQuestionList="items"
                :nowIndex="indexs"
                @setQuestion="setQuestion"
                @changeScore="changeScore"
              ></SetChooseQuestion>
              <SetGapFillQuestion
                v-if="items.tpqQuestion.questionTypeId=='2'?true:false"
                :AddGapFillQuestionList="items"
                :nowIndex3="indexs"
                @setQuestion="setQuestion"
                @changeScore="changeScore"
              ></SetGapFillQuestion>
              <SetAnswerQuestion
                v-if="items.tpqQuestion.questionTypeId=='3'?true:false"
                :AddEssayQuestiontList="items"
                :nowIndex2="indexs"
                @setQuestion="setQuestion"
                @changeScore="changeScore"
              ></SetAnswerQuestion>
            </div>
          </el-card>
        </div>
      </div>
      <MakeOver v-if="active==2"></MakeOver>
    </el-card>
  </div>
</template>
<script>
//步奏
import BeginMake from "@/components/MakeTestPaper/BeginMake"; //第一步组件
import MakeOver from "@/components/MakeTestPaper/MakeOver"; //第三步组件
import AddMultipleChoice from "@/components/MakeTestPaper/SetPageInfo/AddMultipleChoice"; //添加选择题组件
import AddGapFilling from "@/components/MakeTestPaper/SetPageInfo/AddGapFilling"; //添加填空题组件
import AddEssayQuestion from "@/components/MakeTestPaper/SetPageInfo/AddEssayQuestion"; //添加问答题组件
import SetChooseQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetChooseQuestion"; //维护选择题组件
import SetGapFillQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetGapFillQuestion"; // 维护填空题组件
import SetAnswerQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetAnswerQuestion"; // 维护问答题组件
import QuestionSectect from "@/components/QuestionSectect"; // 维护问答题组件
export default {
    components: {
    BeginMake, //第一步，选择科目
    MakeOver, //第三步，完成试卷
    AddMultipleChoice, //添加选择题
    AddGapFilling, //添加填空题
    AddEssayQuestion, //添加问答题
    SetChooseQuestion, //维护选择题
    SetGapFillQuestion, // 维护填空题
    SetAnswerQuestion, //维护问答题
    QuestionSectect //试卷问题类型下拉框
  },
  data() {
    return {
      testPaperId: "",
      active: 0, //当前步奏
      pageInfo: [], //试卷信息
      radio: 3, //选项
      nowAddOption: 0 //当前所在题型
    };
  },
  computed: {
    /**
     * 计算总分
     * {Array} pageInfo 试卷信息
     * {Number} nowScroe 每种题目类型总分
     * @return {Number}  sum 所有题目类型总分
     */
    sumSoce() {
      var _this = this;
      var sum = 0;
      for (let i in _this.pageInfo) {
        if (_this.pageInfo[i].bodys.length != 0) {
          sum += _this.pageInfo[i].nowScroe;
        }
      }
      return sum;
    }
  },
  methods: {
    /**
     * 点击完成制作
     */
    fnover() {
      this.active = 2;
    },
    /**
     * 初始化试卷
     *  {Array} pageInfo 试卷信息
     * {Array} bodys 每种题目类型信息
     *  {Number} nowScroe 每种题目类型总分
     * {Number} nowAdd 每种题目类型总个数
     */
    questionInit(data) {
      var _this = this;
      
      if(_this.pageInfo.length==0){
          _this.pageInfo = data
      }
    },
       /**
     * 添加题目
     * 
     * @param {object} data 添加的题目信息
     * 
     */
    addQuestion(data) {
      var _this = this;
      var index = data.questionTypeId - 1;
      _this.pageInfo[index].bodys.push(data.bodys); //改变父组件的问答题的试卷信息
      _this.pageInfo[index].nowAdd += 1; //改变父组件的问答题的问题个数
          _this.sumScore(index)
    },
       /**
     * 维护题目
     * @param {object} data 维护的题目信息
     */
    setQuestion(data) {
      var _this = this;
      var index = data.questionTypeId - 1;
      _this.pageInfo[index].bodys.splice(data.index, 1); //改变父组件的问答题的试卷信息
      _this.pageInfo[index].nowAdd -= 1; //改变父组件的问答题的问题个数
      _this.pageInfo[index].nowScroe -= parseInt(data.tpqScore); //改变父组件的问答题的分数
      _this.pageInfo = [..._this.pageInfo]; //解构渲染
    },
    /**
     * 修改分数
     * @param {object} data 维护的题目信息
     */
    changeScore(data){
      var _this = this;
       var index = data.index; //获取传递的题目下标
         var fqIndex = data.fqIndex; //获取传递的题目题号
         var fqsScore = data.fqsScore;//获取传递的题目分数
        _this.sumScore(index,fqIndex,fqsScore) //调用算分数方法
    },
    /**
     * 计算分数
     * @param {Number} index 维护的题目的类型下标
     * @param {Number} fqIndex 维护的题目题号
     * @param {Number} fqsScore 维护的题目分数
     */
    sumScore(index,fqIndex,fqsScore){
      var _this = this;
       _this.pageInfo[index].nowScroe = 0; //清空分数
       if(fqIndex!=undefined){
         _this.pageInfo[index].bodys[fqIndex].tpqScore = fqsScore; //修改题目的分数
       }
       
      for (const key in _this.pageInfo[index].bodys) { //累加分数 
         _this.pageInfo[index].nowScroe += _this.pageInfo[index].bodys[key].tpqScore //改变父组件的问答题的分数
      }
      _this.pageInfo = [...this.pageInfo] //重新解构赋值
    }
  },
      /**
     * 过滤大题的数据格式
     */
  filters: {
    questionsIndex(data) { //过滤题号
      switch (data) {
        case 1:
          return "一、";
        case 2:
          return "二、";
        case 3:
          return "三、";
      }
    }
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
#MakeTestPaper {
  .box-card {
    margin-top: 25px;
  }
  #TestInfo {
    padding-top: 50px;
    .tabs {
      display: flex;
      .left-list {
        margin-right: auto;
     
      }
      .right-button {
        width: 150px;
      }
    }
    .bottom-view {
      text-align: left;
      .text {
        font-size: 14px;
      }
      .item {
        margin-bottom: 18px;
      }
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: "";
      }
      .clearfix:after {
        clear: both;
      }
      .box-card {
        min-height: 20px;
      }
      .el-tag {
        border-radius: 12px;
      }
    }
  }
  .el-steps {
    margin-top: 40px;
  }
}
</style>
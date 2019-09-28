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

      <BeginMake v-if="active==0"></BeginMake>
      <div id="TestInfo" v-if="active==1">
        <div class="tabs">
          <div class="left-list">
            <span class="list-title">题目类型</span>
            <el-radio-group v-model="radio" @change="changeQuestionType">
              <el-radio
                v-for="(item,index) in pageInfo"
                :key="index"
                :label="index"
              >{{item.typeName}}</el-radio>
            </el-radio-group>
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
                {{index+1}}、{{item.typeName}}（本题共{{item.nowAdd}}道小题，共
                <el-tag type="danger" effect="dark" size="small">{{item.nowScroe}}/{{sumSoce}}</el-tag>分）
              </span>
            </div>
            <div v-for="(items,indexs) in item.bodys" :key="indexs" class="text item">
              <SetChooseQuestion
                v-if="items.tpqQuestion.questionTypeId=='1'?true:false"
                :AddChooseQuestionList="items"
                :nowIndex="indexs"
                @setQuestion="setQuestion"
              ></SetChooseQuestion>
              <SetGapFillQuestion
                v-if="items.tpqQuestion.questionTypeId=='2'?true:false"
                :AddGapFillQuestionList="items"
                :nowIndex3="indexs"
                @setQuestion="setQuestion"
              ></SetGapFillQuestion>
              <SetAnswerQuestion
                v-if="items.tpqQuestion.questionTypeId=='3'?true:false"
                :AddEssayQuestiontList="items"
                :nowIndex2="indexs"
                @setQuestion="setQuestion"
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
export default {
  data() {
    return {
      testPaperId: "",
      active: 0, //当前步奏
      pageInfo: [], //试卷信息
      radio: 3, //选项
      nowAddOption: "" //当前所在题型
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
     * 切换题型
     * @param {Number} v 题目所在下标
     */
    changeQuestionType(v) {
      this.nowAddOption = v;
    },
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
    init() {
      var _this = this;
      _this.axios.get(`/api/TestPaper/GetQuestionType`).then(res => {
        //接口初始化获取问题类型
        _this.pageInfo = res.data;
        for (let i in _this.pageInfo) {
          _this.pageInfo[i].bodys = [];
          _this.pageInfo[i].nowAdd = 0;
          _this.pageInfo[i].nowScroe = 0;
        }
      });
    },
    /**
     * 添加题目
     */
    addQuestion(data) {
      var _this = this;
      var index = data.questionTypeId - 1;
      _this.pageInfo[index].bodys.push(data.bodys); //改变父组件的问答题的试卷信息
      _this.pageInfo[index].nowAdd += 1; //改变父组件的问答题的问题个数
      _this.pageInfo[index].nowScroe += parseInt(data.bodys.tpqScore); //改变父组件的问答题的分数
      _this.pageInfo = [..._this.pageInfo]; //解构渲染
    },
    //维护题目
    setQuestion(data) {
      var _this = this;
      var index = data.questionTypeId - 1;
        _this.pageInfo[index].bodys.splice(data.index, 1); //改变父组件的问答题的试卷信息
        _this.pageInfo[index].nowAdd -= 1; //改变父组件的问答题的问题个数
        _this.pageInfo[index].nowScroe -= parseInt(data.tpqScore); //改变父组件的问答题的分数
        _this.pageInfo = [..._this.pageInfo]; //解构渲染
    }
  },
  components: {
    BeginMake, //第一步，选择科目
    MakeOver, //第三步，完成试卷
    AddMultipleChoice, //添加选择题
    AddGapFilling, //添加填空题
    AddEssayQuestion, //添加问答题
    SetChooseQuestion, //维护选择题
    SetGapFillQuestion, // 维护填空题
    SetAnswerQuestion //维护问答题
  },
  created() {
    this.init(); //初始化题型
  }
};
</script>
<style lang="less" scoped>
#MakeTestPaper {
  #TestInfo {
    padding-top: 50px;
    .tabs {
      display: flex;
      .left-list {
        margin-right: auto;
        .list-title {
          margin: 0px 15px;
        }
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
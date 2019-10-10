/** 
试卷详情组件
通过路由传参 
需要传入 试卷Id 
*/

<template>
  <div class="TestInfo">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">
        <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
        <a v-else>{{item.name}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table-content">
      {{tpTitle}}
      <table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <th>科目</th>
          <th>总分</th>
          <th>选择题</th>
          <th>填空题</th>
          <th>问答题</th>
        </tr>
        <tr>
          <td>{{courseName}}</td>
          <td>
            <el-tag type="danger" effect="dark" size="small">{{score.sum}}`</el-tag>
          </td>
          <td>
            <el-tag type="danger" effect="dark" size="small">{{score.chooseScore}}`</el-tag>
          </td>
          <td>
            <el-tag type="danger" effect="dark" size="small">{{score.gapfillScore}}`</el-tag>
          </td>
          <td>
            <el-tag type="danger" effect="dark" size="small">{{score.answerScore}}`</el-tag>
          </td>
        </tr>
      </table>
    </div>

    <div class="pageInfo">
      <div class="tabs">
        <div class="left-list">
          <question-sectect
            :select="false"
            :defaultSelect="0"
             v-model="nowAddOption"
            @questionInit="questionInit"
          />
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
  </div>
</template>
<script>
import AddMultipleChoice from "@/components/MakeTestPaper/SetPageInfo/AddMultipleChoice"; //添加选择题组件
import AddGapFilling from "@/components/MakeTestPaper/SetPageInfo/AddGapFilling"; //添加填空题组件
import AddEssayQuestion from "@/components/MakeTestPaper/SetPageInfo/AddEssayQuestion"; //添加问答题组件
import SetChooseQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetChooseQuestion"; //维护选择题组件
import SetGapFillQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetGapFillQuestion"; // 维护填空题组件
import SetAnswerQuestion from "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetAnswerQuestion"; // 维护问答题组件
import QuestionSectect from "@/components/QuestionSectect"; // 维护问答题组件
export default {
  components: {
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
      id: this.$route.params.id,
      pageInfo: [], //试卷信息
      nowAddOption: 0, //当前所在题型
      courseName: "",
      tpTitle: "",
      score: {
        chooseScore: 0,
        answerScore: 0,
        gapfillScore: 0,
        sum: 0
      }
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
    init() {
      var _this = this;
      sessionStorage.testPaperId = _this.id;
      _this.axios
        .get("/api/TestPaper/GetTestPaper?id=" + _this.id)
        .then(res => {
          var data = res.data;
          for (const key in data.questions) {
            if (data.questions[key].tpqQuestion.questionTypeId == "1") {
              //选择题
              _this.score.chooseScore += data.questions[key].tpqScore;
              _this.pageInfo[0].nowAdd += 1;
              _this.pageInfo[0].bodys.push(data.questions[key]);
            }
            if (data.questions[key].tpqQuestion.fillQuestion.length != 0) {
              //填空题
              _this.score.gapfillScore += data.questions[key].tpqScore;
              _this.pageInfo[1].nowAdd += 1;
              data.questions[key].tpqQuestion.questionTypeId = 2;
              _this.pageInfo[1].bodys.push(data.questions[key]);
              console.log(data.questions[key]);
            }
            if (data.questions[key].tpqQuestion.answerQuestion != null) {
              //问答题
              _this.score.answerScore += data.questions[key].tpqScore;
              _this.pageInfo[2].nowAdd += 1;
              _this.pageInfo[2].bodys.push(data.questions[key]);
            }
          }
          _this.score.sum =
            parseInt(_this.score.chooseScore) +
            parseInt(_this.score.gapfillScore) +
            parseInt(_this.score.answerScore);
          _this.pageInfo[0].nowScroe = parseInt(_this.score.chooseScore);
          _this.pageInfo[1].nowScroe = parseInt(_this.score.gapfillScore);
          _this.pageInfo[2].nowScroe = parseInt(_this.score.answerScore);
          _this.courseName = data.courseName;
          _this.tpTitle = data.tpTitle;
          _this.pageInfo = [..._this.pageInfo];
        });
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
    questionInit(data) {
      var _this = this;
      if (_this.pageInfo.length == 0) {
        _this.pageInfo = data;
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
      _this.sumScore(index);
    },
    /**
     * 维护题目
     *
     * @param {object} data 维护的题目信息
     *
     *
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
     *
     */
    changeScore(data) {
      var _this = this;
      var index = data.index;
      var fqIndex = data.fqIndex;
      var fqsScore = data.fqsScore;
      _this.sumScore(index, fqIndex, fqsScore);
    },
    /**
     * 计算分数
     *
     */
    sumScore(index, fqIndex, fqsScore) {
      var _this = this;
      if(index==undefined){
          return;
      }
      _this.pageInfo[index].nowScroe = 0;
      if (fqIndex != undefined) {
        _this.pageInfo[index].bodys[fqIndex].tpqScore = fqsScore;
      }
      for (const key in _this.pageInfo[index].bodys) {
        _this.pageInfo[index].nowScroe +=
          _this.pageInfo[index].bodys[key].tpqScore; //改变父组件的问答题的分数
      }
      _this.pageInfo = [...this.pageInfo];
    }
  },
  filters: {
    questionsIndex(data) {
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
    this.init();
  }
};
</script>
<style lang="less" scoped>
.TestInfo {
  .table-content {
    width: 80%;
    margin: 30px auto;
    text-align: center;
    table {
      width: 80%;
      height: 110px;
      margin: 5px auto;
      border: 1px solid #ccc;
    }
  }
  .pageInfo {
    width: 90%;
    margin: 5px auto;
  }
}
</style>
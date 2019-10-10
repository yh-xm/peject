<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/ViewTestPaper'}">测试任务</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/piYueTestPaper'}">批阅试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 是否已批阅开始 -->
      <div>
        <table border="1" cellspacing="0" width="100%">
          <tr v-for="(item,index) in tableDatas" :key="index">
            <th width="100px" style="padding:10px 0px">
              <el-tag :type="item.thStyle">{{item.title}}</el-tag>
            </th>
            <td style="padding-left:15px;">
              <el-button
                round
                :type="item.tdStyle"
                v-for="(name,i) in item.stuName"
                :key="i"
                size="mini"
                @click="getStuTestInfo(name.testUid)"
              >{{name.stuName}}</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 获取学员试卷是否已批阅结束 -->

      <!-- 个人考试信息开始-->
      <div v-if="isShow2">
        <h3 class="title">{{tpTitle}}</h3>
        <el-table :data="tableData1" border style="width: 100%">
          <el-table-column prop="stuName" label="姓名" ></el-table-column>
          <el-table-column prop="className" label="班级" ></el-table-column>
          <el-table-column prop="testSubmitTime" label="交卷"></el-table-column>
          <el-table-column prop="choseQuestions" label="选择题得分"></el-table-column>
          <el-table-column prop="fillQuestion" label="填空题得分"></el-table-column>
          <el-table-column prop="answer" label="问答题得分"></el-table-column>
          <el-table-column prop="testScore" label="成绩"></el-table-column>
        </el-table>
        <!-- 个人考试信息结束 -->

        <!-- 获取考试题目开始 -->
        <!-- 选择题开始 -->
        <el-card class="box-card examInfo">
          <div
          >选择题（本大题共{{choseQuestions.length}}道，共{{choseQuestions.totalpoints}}分，得分{{choseQuestions.score}}）</div>
          <div v-for="(row,index) in choseQuestions" :key="row.id" class="text item">
            <h4>{{index+1}}.{{row.questionTitle}} ({{row.testPaperScore}}分)</h4>
            <ul>
              <li v-for="(item,index) in row.choseQuestions.questions " :key="item.id">
                {{result[index]}}. {{item.cqOption}}
                <span
                  class="el-icon-success"
                  v-if="item.cqIsRight"
                ></span>
              </li>
            </ul>
            <div class="answer">
              <el-tag type="info">我的答案 {{row.choseQuestions | formatId}}</el-tag>
              <el-tag type="danger">得分</el-tag>
              <el-button type="danger"  circle size="mini">{{row.score}}</el-button>
            </div>
          </div>
        </el-card>
        <!-- 选择题结束 -->
        
        <!-- 填空题开始 -->
        <el-card class="box-card examInfo">
          <div
          >填空题（本大题共{{computFillQuestion[0]}}道，共{{computFillQuestion[1]}}分，得分{{computFillQuestion[2]}}）</div>
          <div
            v-for="(item,i) in computFillQuestion[3]"
            :key="item.id"
            class="text item fillQuestion-result"
          >
            <h4>
              {{i+1}}.
              <span v-html="item"></span>
            </h4>
            <el-tag type="warning">学生答案</el-tag>
            <ul>
              <li v-for="(row,index) in fillQuestion[i].fillQuestion.myFill" :key="row.id">
                空{{index+1}}
                <span
                  style="display: inline-block;padding: 0px 50px; border-bottom:1px solid #666;text-align: center;"
                >{{row.fillAnswer}}</span>
                <el-tag type="danger">得分</el-tag>
                <el-input-number
                  v-model="row.fillScore"
                  controls-position="right"
                  @change="handleChange"
                  :min="0"
                  :max="fillQuestion[i].fillQuestion.questions[index].socre"
                ></el-input-number>
              </li>
            </ul>
          </div>
        </el-card>
        <!-- 填空题结束 -->
        <!-- 问答题开始 -->
        <el-card class="box-card examInfo">
          <div
          >问答题（本大题共{{answerdata[0]}}道，共{{answerdata[1]}}分，得分{{answerdata[2]}}）</div>
          <div v-for="(item,i) in answer" :key="item.id" class="text item fillQuestion-result">
            <h4>{{i+1}}.{{item.questionTitle}}({{item.testPaperScore}}分)</h4>
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <h4>学生答案</h4>
                  <span>{{item.myAnswer}}</span>
                </div>
              </el-col>
            </el-row>
            <el-tag type="danger">得分</el-tag>
            <el-input-number
              v-model="item.score"
              controls-position="right"
              @change="handleChange"
              :step="item.testPaperScore"
              :min="0"
              :max="item.testPaperScore"
            ></el-input-number>
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <h4>参考答案</h4>
                  <span>{{item.answer}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- 问答题结束 -->
        <!-- 获取考试题目结束 -->
        <!-- 是否保存批阅开始 -->
        <div class="savePaper">
          <el-tag type="info">
            学生成绩
            <span>{{resCount}}</span>分
          </el-tag>
          <el-button type="primary" @click="saveTest" size="small">保存阅卷</el-button>
        </div>
        <!-- 是否保存批阅结束 -->
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      info:this.$route.query.dataInfo,
      isShow2:false,//考生详情隐藏和显示
      tableData1: [], //学员个人考试信息
      testUid:"",//学员考试标识符
      fillQuestion: [], //批阅填空题
      choseQuestions: [], //批阅选择题
      answer: [], //批阅问答题
      result: ["A", "B", "C", "D","E","F","G"],//选择题序号
      totalPoints: [],//学生考试结果
      tpTitle: "",//考试科目
      /**
       * 获取已批阅和未批阅的学员名单信息
       * @param title {string} 是否批阅的标题
       * @param thStyle {Object} 标题的样式
       * @param tdStyle {Object} 学员名单的样式
       * @param stuName {Object} 学员名称
       */
      tableDatas: [
        {
          title: "未批阅",
          thStyle: "info",
          tdStyle: "info",
          stuName: []
        },
        {
          title: "已批阅",
          thStyle: "success",
          tdStyle: "success",
          stuName: []
        }
      ],
    }
  },
  filters: {
    /**
     * 过滤时间里面的T
     * @param cutTimeT 过滤后的数据
     * @param value 需要过滤的数据
     */
    cutTimeT: function(value){
      return value.replace('T',' ')
    },
    /**
     * 管道过滤选择题答案
     * @param formatId 过滤后的数据
     * @param value 需要过滤的数据
     */
    formatId: function(value) {
      var _this = this;
      var result = ["A", "B", "C", "D","E","F","G"];
      var ChooseAnswer = "";
      for (let i in value.questions) {
        for (let j in value.myChoose) {
          if (value.questions[i].cqId == value.myChoose[j]) {
            ChooseAnswer += result[i];//防止有多选题出现
          }
        }
      }
      return  "【" + ChooseAnswer + "】";
    }
  },
  computed: {
    // 计算填空题
    computFillQuestion: function() {
      let _this = this;
      let testPaperScore = 0; //计算填空题的总分数
      let score = 0; //计算填空题所得到的分数
      let result = ""; //用于存储数组添加标签转成字符串
      let results = []; //存储添加好标签的字符串
      let index = 0; //分数的下标
      let fqAnswer = ""; //填空题的答案
      let socre = 0; //填空题的分数
      for (let i in _this.fillQuestion) {
        for (let j in _this.fillQuestion[i].fillQuestion.myFill) {
          score += _this.fillQuestion[i].fillQuestion.myFill[j].fillScore; //计算填空题所得到的分数
        }
        for (let j in _this.fillQuestion[i].questionTitle.split("")) {
          if (_this.fillQuestion[i].questionTitle[j] == "▁") {
            if (index < _this.fillQuestion[i].fillQuestion.questions.length) {
              fqAnswer =_this.fillQuestion[i].fillQuestion.questions[index].fqAnswer;
              socre = _this.fillQuestion[i].fillQuestion.questions[index].socre;
            }
            testPaperScore += socre;
            result +=
              "<i style='display: inline-block;padding: 0px 20px; border-bottom:1px solid #626262;text-align: center;'>" +fqAnswer +
              "</i>(" +socre +"分)"
            index++;
            fqAnswer = "";
            socre = 0;
          } else {
            result += _this.fillQuestion[i].questionTitle[j];
          }
        }
        index = 0; //刷新下标
        results.push(result); //把标签字符串添加到数组
        result = ""; //刷新标签字符串
      }
      _this.totalPoints.fillQuestionscore = _this.fillQuestion; //获取所有填空题的内容
      return [_this.fillQuestion.length, testPaperScore, score, results];
    },
    //计算问答题答案
    answerdata: function() {
      let _this = this;
      let testPaperScore = 0;
      let score = 0;
      for (let i in _this.answer) {
        testPaperScore += _this.answer[i].testPaperScore;
        score += _this.answer[i].score;
      }
      _this.totalPoints.scoretestPaperScore = testPaperScore;
      return [ _this.answer.length, testPaperScore, score];
    },
    //计算总分
    resCount:function(){
      var _this=this
      return  _this.tableData1[0].fillQuestion +_this.tableData1[0].choseQuestions + _this.tableData1[0].answer
    }
  },
  methods:{
    getInfo(){
      var _this=this
      for (let i in _this.info) {
            if ( _this.info[i].hasView) {
              _this.tableDatas[1].stuName.push(_this.info[i]);
            } else {
              _this.tableDatas[0].stuName.push(_this.info[i]);
            }
          }
          console.log(_this.info)
          console.log(_this.tableDatas[1].stuName)
          console.log(_this.tableDatas[0].stuName)
    },
    handleChange(value){
      console.log(value)
    },
    /**
     * 获取学员个人考试信息
     * @param testUid {string} 获取学员考试标识符
     */
    getStuTestInfo(testUid) {
      let _this = this;
      _this.isShow2 = true
      _this.testUid=testUid//
      _this.axios
        .get("/api/TestResult/GetStudentTestPaper?testUid=" + testUid)
        .then(res => {
          // console.log(res.data);
          _this.tpTitle = res.data.tpTitle;
          _this.totalPoints.id = res.data.id;//学生答卷的主键编号,用在保存阅卷
          let fillTiScore = 0; //填空题分
          let choseTiScore = 0; //选择题分
          let answerScore = 0; //问答题分
          let choseQuestionstotalpoints = 0; //计算选择题总共有多少分
          let choseQuestionsdata = []; //获取选择题的问题和答案
          let fillQuestiondata = []; //获取填空题的内容
          let answerdata = []; //获取问答题的内容
          //判断题目
          for (let i in res.data.questions) {
            //判断题目是不是填空题
            if (res.data.questions[i].fillQuestion != null) {
              fillTiScore += res.data.questions[i].score;
              fillQuestiondata.push(res.data.questions[i]);
              _this.fillQuestion = fillQuestiondata;
              //判断题目是不是选择题
            } else if (res.data.questions[i].choseQuestions != null) {
              choseTiScore += res.data.questions[i].score;//我的得分
              choseQuestionstotalpoints += res.data.questions[i].testPaperScore;//选择题总分
              choseQuestionsdata.push(res.data.questions[i]); //获取选择题的问题和答案
              _this.choseQuestions = choseQuestionsdata; //获取选择题的问题和答案
              _this.choseQuestions.totalpoints = choseQuestionstotalpoints; //计算选择题总共有多少分
              _this.choseQuestions.score = choseTiScore; //获取我所得到的分数
              _this.choseQuestions.length = choseQuestionsdata.length; //获取选择题有多少道
              _this.stuScore =  _this.choseQuestions.score;//获取学生选择题的分数
              //判断题目是不是问答题
            } else if (res.data.questions[i].answer != null) {
              answerScore += res.data.questions[i].score;
              answerdata.push(res.data.questions[i]);
              _this.answer = answerdata;
            }
          }
          _this.tableData1 = [res.data];
          _this.tableData1[0].fillQuestion = fillTiScore;
          _this.tableData1[0].choseQuestions = choseTiScore;
          _this.tableData1[0].answer = answerScore;
          console.log(_this.tableData1)
          // console.log(_this.choseQuestions.choseQuestions)
          // console.log(_this.answer.answer)
        });
    },

    //保存阅卷
      saveTest(){
      var _this = this;
      //  console.log(sessionStorage.getItem("uid"))
      let userUid = sessionStorage.getItem("uid");
     let saveTest = "[";
      for (let i in  _this.answer) {
        saveTest +=
          "{'id':" +
          _this.answer[i].id +
          ",'score':" +
          _this.answer[i].score +
          "},";
      }
      for (let i in _this.fillQuestion) {
        saveTest +=
          "{'id':" +
          _this.fillQuestion[i].id +
          ",'score':" +
          _this.fillQuestion[i].score +
          ",'fillOption': [";
        for (let j in _this.fillQuestion[i].fillQuestion.myFill) {
          saveTest +=
            "{'id': " +
            _this.fillQuestion[i].fillQuestion.myFill[j].id +
            ",'fillScore': " +
            _this.fillQuestion[i].fillQuestion.myFill[j]
              .fillScore +
            "},";
        }
        saveTest = saveTest.substring(0, saveTest.lastIndexOf(","));
        saveTest += "]},";
      }

      saveTest = saveTest.substring(0, saveTest.lastIndexOf(","));//去掉最后一个逗号
      saveTest += "]";//加上最后一个]
      var info = eval("(" + saveTest + ")");
      let arr = {
        id: _this.totalPoints.id, //学生答卷的主键编号
        testScore: 100, //总分
        studentAnswer: info
      };
      _this.axios
        .post("/api/TestResult/SetTestPaperScore?userUid=" + userUid, arr)
        .then(res => {
          // console.log(_this.tableDatas[0].stuName.filter(item=>item.testUid ==_this.testUid)[0])
          document.querySelector(".el-main").scrollTop = 0; //保存阅卷回到顶部
          _this.tableDatas[1].stuName.push(_this.tableDatas[0].stuName.filter(item=>item.testUid ==_this.testUid)[0])
          _this.tableDatas[0].stuName.splice(_this.tableDatas[0].stuName.lastIndexOf(_this.tableDatas[0].stuName.filter(item=>item.testUid ==_this.testUid)[0]),1)
        });
    }
  },
  created:function() {
    var _this=this
    _this.getInfo();
  }

}
</script>

<style lang="less" scoped>
// *{
//   padding: 0px;
//   margin: 0px;
// }
ul,li {
  list-style: none;
}

table{
  border: 1px solid #ccc;
  border-bottom: 0px;
  th,td{
   border:0px;
   border-bottom: 1px solid #ccc;
  }
  th{
    border-right: 1px solid #ccc;
  }
}
//题目的样式
.examInfo {
  margin-top: 20px;
}
//设置选择题正确答案样式
.el-icon-success {
  color: rgb(12, 219, 57);
}
// 选择题的样式
.answer {
  margin: 15px 0px;
  .score {
    padding: 0px 5px 0px 5px;
    border-radius: 50%;
    color: white;
    background: red;
  }
  span {
    margin: 0px 5px;
  }
}
// 填空题的样式
.fillQuestion-result {
  margin: 15px 0px;
  h4 {
    margin: 15px 0px;
  }
  li {
    margin: 10px 0px 0px 10px;
  }
  .el-tag {
    margin-right: 10px;
  }
}

.el-row {
  margin: 20px 0px 20px 0px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple {
  background: #d3dce6;
  padding: 10px 0px 10px 20px;
  h4 {
    margin: 0px 0px 5px 0px;
    color: #9193a3;
  }
  span {
    font-size: 15px;
    color: #9193a3;
  }
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.savePaper {//保存阅卷样式
  text-align: center;
  margin: 20px 0px;
  .el-tag {
    margin-right: 15px;
    span {
      display: inline-block;
      width: 30px;
      height: 20px;
      background: red;
      border-radius: 10px;
      text-align: center;
      padding-bottom: 5px;
      color: white;
    }
  }
}
//考试科目
.title {
  margin-top: 20px;
  text-align: center;
  color: #196ebd;
  margin-bottom: 20px;
}

</style>
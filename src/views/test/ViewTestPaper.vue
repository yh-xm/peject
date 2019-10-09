<template>
  <div id="ViewTestPaper">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/ViewTestPaper'}">测试任务</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/piYueTestPaper'}">批阅试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <h6>试卷任务列表</h6>
      </div>
      <div class="text item">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" width="80" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.$index+(currentPage - 1)*currentPageSize + 1}}</span>
          </template>
        </el-table-column>
          <el-table-column label="试卷名">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.tpTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出卷人">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试开始时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskStartTime  | cutTimeT}}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试结束时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskEndTime  | cutTimeT}}</span>
            </template>
          </el-table-column>
          <el-table-column label="耗时" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskEscapeTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交卷人数" width="80">
            <template slot-scope="scope" >
              <span style="margin-left: 10px">{{ scope.row.counter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="piYueTest(scope.$index, scope.row)"
                type="primary"
                size="mini"
                :disabled="scope.row.counter==0"
              >批阅试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页开始 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="0"
            layout="total, sizes, prev, pager, next, jumper"
            :total="items"
          ></el-pagination>
        </div>
        <!-- 分页结束-->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
    return {
      tableData: [], //获取所有的试卷信息
      currentPageSize: 5, //默认初始化每页为5条数据
      currentPage: 1, //默认当前页为第一页
      items: 0, //获取总共的试卷
    };
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
  methods: {
    /**
     * 分页获取所有试卷信息
     * @param pageIndex {string} 设置当前页 默认为1
     * @param pageSize {string} 设置每页有多少条数据
     */
    testPaperMessage(pageIndex, pageSize) {
      var _this = this;
      _this.axios.get("/api/TestPaper/GetTestTask?pageIndex=" +pageIndex +"&pageSize=" +pageSize)
        .then(res => {
          _this.tableData = res.data.data;
          _this.items = res.data.items;
        });
    },
    /**
     * 设置每页多少条数据
     * @param val 每页多少条数据
     */
    handleSizeChange(val) {
      var _this=this
      _this.currentPageSize = val;
      _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
    },
    /**
     * 设置当前页
     * @param val {string} 当前的页数
     */
    handleCurrentChange(val) {
      var _this=this
      console.log(`当前页: ${val}`);
      _this.currentPage = val;
      _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
    },
    
    
    handleChange(value) {
      console.log(value);
    },
    /**
     * 获取指定的考试信息
     * @param index {string} 试卷下标
     * @param row {Object} 获取试卷选中信息
     */
    piYueTest(index, row) {
      let _this = this;
      _this.axios
        .get("/api/TestResult/GetStudentTest?taskId=" + row.taskId)
        .then(res => {
          _this.$router.push({
            path:'/piYueTestPaper',
            query:{
              dataInfo:res.data
            }
          })
        });
     }
  },
  created:function() {
    var _this=this
    _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
  }
};
</script>
<style lang="less" scoped>
// *{
//   padding: 0px;
//   margin: 0px;
// }
ul,li {
  list-style: none;
}
// 分页的样式
.el-pagination {
  text-align: center;
  padding-top: 20px;
}
//试卷任务列表居中
/deep/.is-leaf,/deep/.cell
{
  text-align: center;
}
</style>
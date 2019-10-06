<template>
  <div id="MakeOver">
    <div class="content-make">
      <h2 class="title">{{title}}</h2>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="name" label="科目" width="180"></el-table-column>
        <el-table-column label="选择题" width="180">
          <template slot-scope="scope">
            <p v-html="scope.row.choose"></p>
          </template>
        </el-table-column>
        <el-table-column label="填空题" width="180">
          <template slot-scope="scope">
            <p v-html="scope.row.gapfill"></p>
          </template>
        </el-table-column>
        <el-table-column label="问答题" width="180">
          <template slot-scope="scope">
            <p v-html="scope.row.answer"></p>
          </template>
        </el-table-column>
        <el-table-column label="总分" width="180">
          <template slot-scope="scope">
            <p v-html="scope.row.sum"></p>
          </template>
        </el-table-column>
      </el-table>
        <el-button type="primary" @click="goback">上一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "", //测试科目
      tableData: [], //分数信息
      data:[], //完整试卷信息
    };
  },
  methods:{
      goback(){ //上一步
 this.$parent.$parent.active = 1;
 console.log(6666)
      }
  },
  created() { //获取试卷信息
    var pageId = sessionStorage.testPaperId;
    var chooseScore = 0; //选择题分数
    var answerScore = 0; //问答题分数
    var gapfillScore = 0;//填空题分数
    this.axios.get(`/api/TestPaper/GetTestPaper?id=${pageId}`).then(res => {
      var data = res.data;
      this.data = data;
      for (const key in data.questions) {
        if (data.questions[key].tpqQuestion.questionTypeId == "1") {  //选择题
          chooseScore += data.questions[key].tpqScore;
        }
        if (data.questions[key].tpqQuestion.fillQuestion.length != 0) {//填空题
          gapfillScore += data.questions[key].tpqScore;
        }
        if (data.questions[key].tpqQuestion.answerQuestion != null) {//问答题
          answerScore += data.questions[key].tpqScore;
        }
      }
      var osum =
        parseInt(chooseScore) + parseInt(gapfillScore) + parseInt(answerScore);
      this.tableData.push({
        name: data.courseName,
        choose: `<el-tag type="danger" effect="dark" size="mini" class="el-tag el-tag--danger el-tag--mini el-tag--dark">${chooseScore +
          "`"}</el-tag>`,
        gapfill: `<el-tag type="danger" effect="dark" size="mini" class="el-tag el-tag--danger el-tag--mini el-tag--dark">${gapfillScore +
          "`"}</el-tag>`,
        answer: `<el-tag type="danger" effect="dark" size="mini" class="el-tag el-tag--danger el-tag--mini el-tag--dark">${answerScore +
          "`"}</el-tag>`,
        sum: `<el-tag type="danger" effect="dark" size="mini" class="el-tag el-tag--danger el-tag--mini el-tag--dark">${osum +
          "`"}</el-tag>`,
      });
      this.title = data.tpTitle;
    });
  }
};
</script>
<style lang="less" scoped>
#MakeOver {
  .content-make {
    width: 80%;
    margin: 0px auto;
    .title {
      display: block;
      margin-top: 50px;
      margin-bottom: 20px;
    }
    .el-button{
        margin-top: 50px;
    }
  }
}
</style>
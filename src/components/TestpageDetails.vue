<!--
试卷详情组件
通过路由传参 
需要传入 试卷Id 
-->
<template>
  <div class="TestInfo">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">
        <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
        <a v-else>{{item.name}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <make-over></make-over>
    <test-page></test-page>
  </div>
</template>
<script>
import MakeOver from "@/components/MakeTestPaper/MakeOver"; //第三步组件
import TestPage from  "@/components/TestPage";
export default {
  components: {
    TestPage,//试卷的操作
    MakeOver //完成试卷
  },
  data() {
    return {
      id: this.$route.params.id,
      AllPageInfo:[],
      testInfo:{}
    };
  },
  methods: {
    init() {
      var _this = this;
      sessionStorage.testPaperId = _this.id;
      _this.axios
        .get("/api/TestPaper/GetTestPaper?id=" + _this.id)
        .then(res => {
          var data = res.data;
          if (data.questions.length == 0) {
            return;
          }
        _this.$nextTick(()=>{
            for (const key in data.questions) {
            if (data.questions[key].tpqQuestion.questionTypeId == "1") {
              //选择题
              _this.AllPageInfo[0].nowAdd += 1;
              _this.AllPageInfo[0].bodys.push(data.questions[key]);
            }
            if (data.questions[key].tpqQuestion.fillQuestion.length != 0) {
              //填空题
              _this.AllPageInfo[1].nowAdd += 1;
              data.questions[key].tpqQuestion.questionTypeId = 2;
              _this.AllPageInfo[1].bodys.push(data.questions[key]);
            }
            if (data.questions[key].tpqQuestion.answerQuestion != null) {
              //问答题
              _this.AllPageInfo[2].nowAdd += 1;
              _this.AllPageInfo[2].bodys.push(data.questions[key]);
            }
          }
          _this.AllPageInfo[0].nowScroe = parseInt(_this.score.chooseScore);
          _this.AllPageInfo[1].nowScroe = parseInt(_this.score.gapfillScore);
          _this.AllPageInfo[2].nowScroe = parseInt(_this.score.answerScore);
          _this.courseName = data.courseName;
          _this.tpTitle = data.tpTitle;
          _this.AllPageInfo = [..._this.AllPageInfo];
})
        });
    },
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.TestInfo {
  min-width: 450px;
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
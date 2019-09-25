<template>
  <div id="TestInfo">
    <div class="tabs">
      <div class="left-list">
        <span class="list-title">题目类型</span>
        <el-radio-group v-model="radio" @change="changeInfo">
          <el-radio v-for="(item,index) in pageInfo" :key="index" :label="index">{{item.typeName}}</el-radio>
        </el-radio-group>
      </div>

      <div class="right-button">
        <el-button type="primary" @click="fnover">完成制卷</el-button>
      </div>
    </div>
    <!-- 路由跳转 -->
    <router-view></router-view>
    <!-- 路由跳转结束 -->
    <div class="bottom-view" :data-t="pageInfo">
      <el-card class="box-card" v-for="(item,index) in pageInfo" :key="index">
        <div slot="header" class="clearfix">
          <span>
            一、{{item.typeName}}（本题共{{item.nowAdd}}道小题，共
            <el-tag type="danger" effect="dark" size="small">{{item.nowScroe}}/{{sumSoce}}</el-tag>分）
          </span>
        </div>
        <div v-for="(items,indexs) in item.bodys" :key="indexs" class="text item">
          <chooseQuestion
            v-if="items.questionTypeId=='1'?true:false"
            :searchList="items"
            :nowIndex="indexs"
          ></chooseQuestion>
          <gapfill
            v-if="items.questionTypeId=='2'?true:false"
            :searchList3="items"
            :nowIndex3="indexs"
          ></gapfill>
          <answerQuestion
            v-if="items.questionTypeId=='3'?true:false"
            :searchList2="items"
            :nowIndex2="indexs"
          ></answerQuestion>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import chooseQuestion from "./pageQusetion/chooseQuestion";
import gapfill from "./pageQusetion/gapfill";
import answerQuestion from "./pageQusetion/answerQuestion";
export default {
  data() {
    return {
      radio: 3, //选项
      pageInfo: [], //题目信息
    };
  },
  methods: {
    changeInfo(v) { //改变路由
      switch (v) {
        case 0:
          this.$router.push({ name: "MultipleChoice" });
          console.log(this);
          break;
        case 1:
          console.log(this);
          this.$router.push({ name: "GapFilling" });
          break;
        case 2:
          this.$router.push({ name: "EssayQuestion" });
          break;
      }
    },
    fnover() { //完成制作
      this.$router.push({ name: "MakeOver" });
      this.$parent.$parent.active = 2;
    }
  },
  computed: {
    sumSoce() { //算总分
      var sum = 0;
      for (let i in this.pageInfo) {
        sum += this.pageInfo[i].nowScroe;
      }
      return sum;
    }
  },
  components: {
    chooseQuestion, //选择题
    answerQuestion, //问答题
    gapfill //填空题
  },
  created() {
    switch (this.$router.history.current.fullPath) {
      case "/EssayQuestion":
        this.radio = 2;
        break;
      case "/GapFilling":
        this.radio = 1;
        break;
      case "/MultipleChoice":
        this.radio = 0;
        break;
    }

    if (sessionStorage.pageInfo) { //上一步还原
      var data = JSON.parse(sessionStorage.pageInfo);
      console.log(data);
      console.log(this.pageInfo);
      this.pageInfo = [{}, {}, {}];
      for (let i = 0; i < this.pageInfo.length; i++) {
        this.pageInfo[i].bodys = [];
        this.pageInfo[i].nowAdd = 0;
        this.pageInfo[i].nowScroe = 0;
      }

      for (const key in data.questions) {
        this.pageInfo[1].typeName = "填空题";
        this.pageInfo[0].typeName = "选择题";
        this.pageInfo[2].typeName = "问答题";
        if (data.questions[key].tpqQuestion.questionTypeId == "1") {
          this.pageInfo[0].bodys.push(data.questions[key].tpqQuestion);
          this.pageInfo[0].nowAdd += 1;
          this.pageInfo[0].nowScroe += parseInt(data.questions[key].tpqScore);
          this.pageInfo[0].typeId = 1;
        }
        if (data.questions[key].tpqQuestion.fillQuestion.length != 0) {
          this.pageInfo[1].bodys.push(data.questions[key].tpqQuestion);
          this.pageInfo[1].nowAdd += 1;
          this.pageInfo[1].nowScroe += parseInt(data.questions[key].tpqScore);
          this.pageInfo[1].typeId = 2;
        }
        if (data.questions[key].tpqQuestion.answerQuestion != null) {
          this.pageInfo[2].bodys.push(data.questions[key].tpqQuestion);
          this.pageInfo[2].nowAdd += 1;
          this.pageInfo[2].nowScroe += parseInt(data.questions[key].tpqScore);
          this.pageInfo[2].typeId = 3;
        }
      }
      this.pageInfo = [...this.pageInfo];
      console.log(this.pageInfo);
    } else {
      this.axios.get(`/api/TestPaper/GetQuestionType`).then(res => {
        this.pageInfo = res.data;
        for (let i in this.pageInfo) {
          this.pageInfo[i].bodys = [];
          this.pageInfo[i].nowAdd = 0;
          this.pageInfo[i].nowScroe = 0;
          console.log(this.pageInfo);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
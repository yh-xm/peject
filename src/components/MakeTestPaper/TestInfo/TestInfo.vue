<template>
  <div id="TestInfo" >
    <div class="tabs">
      <div class="left-list">
        <span class="list-title">题目类型</span>
        <el-radio-group v-model="radio" @change="changeInfo">
          <el-radio v-for="(item,index) in pageInfo" :key="index" :label="index">{{item.typeName}}</el-radio>
        </el-radio-group>
      </div>

      <div class="right-button">
        <el-button type="primary">完成制卷</el-button>
      </div>
    </div>
    <!-- 路由跳转 -->
    <router-view></router-view>
    <!-- 路由跳转结束 -->
    <div class="bottom-view" :data-t ="pageInfo" >
      <el-card class="box-card" v-for="(item,index) in pageInfo" :key="index">
        <div slot="header" class="clearfix">
          <span>
            一、{{item.typeName}}（本题共{{item.nowAdd}}道小题，共
            <el-tag
              type="danger"
              effect="dark"
              size="small"
            >{{item.nowScroe}}/{{sumSoce}}</el-tag>分）
          </span>
        </div>
        <div v-for="(items,indexs) in item.bodys" :key="indexs" class="text item">
          <chooseQuestion v-if="items.questionTypeId=='1'?true:false"  :searchList="items" :nowIndex="indexs"></chooseQuestion>
      
          <answerQuestion v-if="items.questionTypeId=='3'?true:false"  :searchList2="items" :nowIndex2="indexs"></answerQuestion>
        </div>
      </el-card>


    </div>
  </div>
</template>
<script>
import chooseQuestion from './pageQusetion/chooseQuestion'
import answerQuestion from './pageQusetion/answerQuestion'
export default {
  data() {
    return {
      radio: 3,
      pageInfo:[]
    };
  },
  methods: {
    changeInfo(v) {
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
    }
  },
  computed:{
    sumSoce(){
      var sum = 0;
        for (let i in this.pageInfo){
        sum+= this.pageInfo[i].nowScroe
        }
        return sum;
    }
  },
  components:{
    chooseQuestion,
    answerQuestion
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
      this.axios
              .get(
                `/api/TestPaper/GetQuestionType`
              )
              .then(res=>{
                  this.pageInfo = res.data
                  for(let i in  this.pageInfo){
                  this.pageInfo[i].bodys = []
                  this.pageInfo[i].nowAdd = 0
                  this.pageInfo[i].nowScroe = 0
                  }
              })
  }
};
</script>
<style lang="less" scoped>
#TestInfo {
  border: 1px solid red;
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
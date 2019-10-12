<template>
  <div id="MakeTestPaper">
    <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
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
        
      <begin-make v-if="active==0" @changeType="nextActive"></begin-make>
      <div id="TestInfo" v-if="active==1">
        <test-page v-model="AllPageInfo">
          <template slot="rightBtn">
           <el-button type="primary" @click="active++">完成制卷</el-button>
        </template>
        </test-page>
      </div>
      <make-over v-if="active==2"  @changeType="changeActive" :testInfo="testInfo" :AllPageInfo="AllPageInfo">
      <template slot="preActive">
        <el-button type="primary" @click="active--">上一步</el-button>
         </template>
      </make-over>
      
    </el-card>
  </div>
</template>
<script>
//步奏
import BeginMake from "@/components/MakeTestPaper/BeginMake"; //第一步组件
import MakeOver from "@/components/MakeTestPaper/MakeOver"; //第三步组件
import TestPage from  "@/components/TestPage";
export default {
    components: {
    BeginMake, //第一步，选择科目
    TestPage,//第二步，试卷的操作
    MakeOver //第三步，完成试卷
  },
  data() {
    return {
      active: 0, //当前步奏
      AllPageInfo:[],
      testInfo:{}
    };
  },
  methods: {
    changeActive(v){
      this.active = v;
    },
    nextActive(data){
      var _this = this;
      _this.testInfo=data
      _this.active = data.index
    }
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
#MakeTestPaper {
  min-width: 450px;
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
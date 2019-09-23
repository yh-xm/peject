<template>
<div id="MakeTestPaper">

    <!-- 面包屑 -->
      <el-breadcrumb separator="/" style="margin: 12px 25px;">
      <el-breadcrumb-item :to="{ path: '/' }"> {{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item> {{$t('base.title')}}</el-breadcrumb-item>
           <el-breadcrumb-item> {{$t('test.r1')}}</el-breadcrumb-item>
    </el-breadcrumb>
<!-- 步骤条 -->
<el-steps :active="0" align-center finish-status="success">
  <el-step title="试卷信息" ></el-step>
  <el-step title="添加题目" ></el-step>
  <el-step title="完成制作" ></el-step>
</el-steps>

     <!-- 路由跳转 -->
          <router-view>
              
          </router-view>
          <!-- 路由跳转结束 -->

</div>
</template>
<script>
export default {
    data(){
        return{
             active: 0
        }
    }
    
}
</script>
<style lang="less" scoped>
#MakeTestPaper{
    .el-steps{
        margin-top: 40px;
    } 
}
</style>
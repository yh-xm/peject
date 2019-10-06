<template>
  <div id="TestSetter">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>安排测试</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Breadcrumb 面包屑 结束 -->

    <el-card class="box-card">
      <div>
        <!-- 组件引用 -->
        <test-drop-down-box></test-drop-down-box>
        <test-drop-down-box></test-drop-down-box>
        <test-time></test-time>
        <!-- 组件引用结束 -->
      </div>
    </el-card>
  </div>
</template>
<script>
import TestDropDownBox from "@/components/TestSetter/TestDropDownBox"; //试卷下拉框
import TestTime from "@/components/TestSetter/TestTime"; //考试时间
export default {
  data() {
    return {};
  },
  //定义组件
  components: {
    TestDropDownBox,
    TestTime
  },
  //定义方法
  methods: {}
};
</script>
<style lang="less" scoped>
#TestSetter {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
}
</style>
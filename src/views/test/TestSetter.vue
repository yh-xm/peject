<template>
  <div id="TestSetter">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>安排测试</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Breadcrumb 面包屑 结束 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header">
        <div class="impComp">
          <!-- 组件引用 -->
          <test-drop-down-box></test-drop-down-box>
          <test-time></test-time>
          <!-- 组件引用结束 -->
        </div>
        <el-row style="margin-left: 85px;">
          <!-- 圆角按钮 -->
          <el-button round>取消</el-button>
          <el-button type="primary" round>设置</el-button>
          <!-- 圆角按钮结束 -->
        </el-row>
      </div>
      <div>
        <!-- 表格 -->

        <el-table :data="SetTest" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="试卷名称" prop="tpTitle" align="center"></el-table-column>
          <el-table-column label="班级" prop="className" align="center"></el-table-column>
          <el-table-column label="出卷人" prop="userName" align="center"></el-table-column>
          <el-table-column label="测试开始时间" prop="taskStartTime" align="center"></el-table-column>
          <el-table-column label="测试结束时间" prop="taskEndTime" align="center"></el-table-column>
          <el-table-column label="耗时(分钟)" prop="taskEscapeTime" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 表格结束 -->
      </div>
    </el-card>
    <!-- 卡片结束 -->
  </div>
</template>
<script>
import TestDropDownBox from "@/components/TestSetter/TestDropDownBox"; //试卷下拉框
import TestTime from "@/components/TestSetter/TestTime"; //考试时间
export default {
  data() {
    return {
      SetTest: [] //初始化分页数据
    };
  },
  //定义组件
  components: {
    TestDropDownBox,
    TestTime
  },
  //定义方法
  methods: {
    /**
     * 分页获取测试任务表
     * 渲染到表格
     *
     * */

    getSetTest() {
      let _this = this;
      _this.axios.get("/api/TestPaper/GetTestTask").then(
        function(res) {
          // roles等于回调函数返回的res（值）
          _this.SetTest = res.data.data;
        },
        function() {
          console.log("请求失败处理");
        }
      );
    },

    /**
     * 编辑当前行表格信息
     * @param {Nameber} index 当前行所在下标
     * @param {String} row 当前行所有数据
     * */
    handleEdit(index, row) {
      console.log(index, row);
    },
    /**
     * 删除当前行表格信息
     * @param {String} row 当前行所有数据
     * */

    handleDelete(row) {
      console.log(row);




    }
  },
  created() {
    let _this = this;
    _this.getSetTest();
  }
};
</script>
<style lang="less" scoped>
#TestSetter {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
}
</style>
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
          <class-and-grade></class-and-grade>
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
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格结束 -->
      </div>
    </el-card>
    <!-- 卡片结束 -->
    <!-- 分页 -->

    <div class="block">
      <!-- :page-count="SetTest." -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="SetTest.length"
      ></el-pagination>
    </div>
    <!-- 分页结束 -->
    <!-- 添加对话框 -->
    <el-dialog title="修改测试信息" :visible.sync="dialogFormVisible" center width="30%">
      <!-- 嵌套的表单 -->
      <el-form :model="form">
        <!-- <el-form-item label="试卷" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>-->
        <test-drop-down-box></test-drop-down-box>
        <class-and-grade></class-and-grade>
        <test-time></test-time>
      </el-form>
      <!-- 嵌套的表单结束 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加对话框结束 -->
  </div>
</template>
<script>
import TestDropDownBox from "@/components/TestSetter/TestDropDownBox"; //试卷下拉框
import ClassAndGrade from "@/components/TestSetter/ClassAndGrade"; //班级
import TestTime from "@/components/TestSetter/TestTime"; //考试时间

export default {
  data() {
    return {
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      form: {
        name: ""
      },
      currentPage:1,//当前页
      pageSize:10,//默认记录
      // totalNum: null, //总条目
      // showNum: null, //每页显示条目个数
      // totalPage: null //总页数
    };
  },
  //定义组件
  components: {
    TestDropDownBox,
    ClassAndGrade,
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
      _this.axios
        .get("/api/TestPaper/GetTestTask")
        .then(
          function(res) {
            // roles等于回调函数返回的res（值）
            // console.log(res);
            _this.SetTest = res.data.data; //表格数据
            // _this.totalNum = res.data.items; //总条数
            // _this.totalPage = res.data.pages; //总页码（数）

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
      let _this = this;
      console.log(index, row);
      _this.dialogFormVisible = true;
      // _this.row =
    },
    /**
     * 删除当前行表格信息
     * @param {Nameber} index 当前行所在下标
     * @param {String} row 当前行所有数据
     * */

    handleDelete(index, row) {
      let taskId = row.taskId;
      let _this = this;

      _this
        .$confirm("此操作将永久删除该数据,是否继续", "提示", {
          congirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          _this.axios
            .post("/api/TestPaper/RemoveTestTask?taskId=" + taskId)
            .then(res => {
              if (res.status === 200) {
                _this.SetTest.splice(index, 1);
                _this.message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 分页 pageSize 改变时会触发
     * @param {Number} val 传过来的值
     * */
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let _this = this;
    // _this.getSetTest();
    },
    /**
     * 分页 currenPage 改变时会触发
     *
     * */

    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let _this = this;
    // _this.getSetTest();
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
// 导航样式
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  // 对话框样式
  .el-form-item {
    display: flex;
    /deep/.el-form-item__label {
      flex: none;
      text-align: right;
      margin-right: 10px;
    }
    /deep/.el-form-item__content {
      width: 100%;
    }
  }
  // 分页样式
  .block {
    margin: 30px auto;
    text-align: center;
  }
}
</style>
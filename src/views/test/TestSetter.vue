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
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            hide-required-asterisk

          >
            <!-- 试卷 -->
            <el-form-item label="试卷" prop="tpId" size="small">
              <el-select v-model="ruleForm.tpId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.tpId"
                  :label="item.tpTitle"
                  :value="item.tpId"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 班级 -->

            <el-form-item label="班级" prop="classId" size="small">
              <el-select v-model="ruleForm.classId" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 时间 -->
            <el-form-item label="时间" prop="logEnd" size="small">
              <el-date-picker
                v-model="ruleForm.logEnd"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                size="small"
                @change="logTimeChange"
              ></el-date-picker>
              <el-button type="danger" size="small" disabled plain>用时：{{timeLimit}} 分钟</el-button>
            </el-form-item>
          </el-form>

          <!-- 组件引用结束 -->
        </div>
        <el-row style="margin-left: 85px;">
          <!-- 圆角按钮 -->
          <el-button round @click="cancelTest()">取消</el-button>
          <el-button type="primary" round @click="setTest()">设置</el-button>
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,15,20,30,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 分页结束 -->
    <!-- 添加对话框 -->
    <el-dialog title="修改测试信息" :visible.sync="dialogFormVisible" center width="30%">
      <!-- 嵌套的表单 -->
      <el-form :model="form"></el-form>
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
export default {
  data() {
    return {
      options: [], //试卷下拉框数组
      options2: [], //班级下拉框数组

      ruleForm: {
        //表单数据
        tpId: "", //试卷
        classId: "", //班级下拉框绑定值
        logEnd:[]//初始化始终时间值
      },
      rules: {
        //表单验证
        tpId: [{ required: true, message: "请选择试卷", trigger: "change" }],
        classId: [{ required: true, message: "请选择班级", trigger: "change" }],
        logEnd:[{ required: true, message: "请选择时间", trigger: "change" }]
      },
      timeLimit: 0, //初始化 用时
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //设置选择今天以及今天之后的日
        }
      },
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      form: {
        name: ""
      },
      currentPage: 1, //当前页码
      pageSize: 10, //每页大小
      total: null //总条目
    };
  },
  //定义方法
  methods: {
    /**
     * 获取所有试卷
     * 可复用
     *
     * */

    getAllTestPaper() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/TestPaper/GetAllTestPaper").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          // console.log(res.data);
          _this.options = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    /**
     * 获取所有班级信息
     * 可复用
     *
     * */

    getAllClass() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/Class/GetAllClass").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          //   console.log(res);
          _this.options2 = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },

    /**
     * 时间改变事件
     * @param {Date} val input框内容
     */
    logTimeChange(val) {
      let _this = this;
      _this.logEnd = val;
      // Math.abs()取绝对值
      _this.timeLimit = parseInt(Math.abs(_this.logEnd[1] - _this.logEnd[0]) / 1000 / 60);
      if(_this.logEnd.trim() ==""){
         _this.timeLimit =0;
      }
    },
    /**
     * 安排测试
     *
     *
     * */

    setTest() {
      console.log("安排测试");
      let _this = this;
      var obj = {};
      // 调用接口
      // _this.axios.post("/api/TestPaper/SetTest",obj).then((res) => {
      //       console.log(res);

      // })
    },

    /**
     * 取消安排测试
     *
     * */

    cancelTest() {
      console.log("取消安排测试");
      let _this = this;
    },

    /**
     * 分页获取测试任务表
     * 渲染到表格
     *
     * */
    getSetTest() {
      let _this = this;
      _this.axios
        .get(
          "/api/TestPaper/GetTestTask?pageIndex=" +
            _this.currentPage +
            "&pageSize=" +
            _this.pageSize
        )
        .then(
          function(res) {
            // roles等于回调函数返回的res（值）
            // console.log(res);
            _this.SetTest = res.data.data; //表格数据
            _this.total = res.data.items; //总条数
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
     * 长度改变----改变每页显示的条数的时候  自动触发
     * @param {Number} val 显示多少条数据
     * */
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;
      _this.getSetTest();
    },
    /**
     * 分页 currenPage 改变时会触发
     * 当前改变----当前页码改变之后，触发这个函数
     *@param {Number} val 点击后的当前页
     * */

    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;
      _this.getSetTest();
    }
  },
  created() {
    let _this = this;
    _this.getAllTestPaper();
    _this.getAllClass();
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
  // 卡片样式
  .box-card {
    .impComp {
      /deep/.el-form-item__content {
        margin-left: 0 !important;

        .el-select {
          width: 100%;
        }
      }
    }
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
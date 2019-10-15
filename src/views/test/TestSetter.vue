<template>
  <div id="TestSetter">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('test.r3')}}</el-breadcrumb-item>
    </el-breadcrumb>
    时间：{{ruleForm.tiemObj}}
    <br />
    试卷id：{{testObj}}
    <!-- Breadcrumb 面包屑 结束-->
    <el-card class="box-card">
      <div slot="header">
        <div class="impComp">
          <!-- 组件引用 -->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="试卷">
              <test-drop-down-box v-model="testObj"></test-drop-down-box>
            </el-form-item>

            <el-form-item label="班级">
              <class-name-select v-model="classObj"></class-name-select>
            </el-form-item>
            <el-form-item label="考试时间">
              <test-time v-model="timeObj"></test-time>
            </el-form-item>
          </el-form>

          <!-- 组件引用结束 -->
        </div>
        <el-row style="margin-left: 85px;">
          <!-- 圆角按钮 -->
          <el-button round @click="cancelTest()">{{$t('btn.res')}}</el-button>
          <el-button type="primary" round @click="setAddInfo()">{{$t('btn.c')}}</el-button>
          <!-- 圆角按钮结束 -->
        </el-row>
      </div>
      <div>
        <!-- 表格 -->
        <el-table :data="SetTest" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column :label="$t('tableName.tt')" prop="tpTitle" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.tcn')" prop="className" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.tp')" prop="userName" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.tts')" prop="taskStartTime" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.tte')" prop="taskEndTime" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.ths')" prop="taskEscapeTime" align="center"></el-table-column>
          <el-table-column :label="$t('tableName.tm')" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.c')}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row)"
              >{{$t('btn.d')}}</el-button>
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
    <el-dialog title="修改测试信息" :visible.sync="dialogFormVisible" center width="50%">
      <!-- 嵌套的表单 -->
      <!-- 嵌套的表单结束 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('btn.res')}}</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">{{$t('btn.c')}}</el-button>
      </div>
    </el-dialog>
    <!-- 添加对话框结束 -->
  </div>
</template>
<script>
import TestDropDownBox from "@/components/TestSetter/TestDropDownBox"; //试卷下拉框
import ClassNameSelect from "@/components/classNameSelect"; //班级
import TestTime from "@/components/TestSetter/TestTime"; //考试时间
export default {
  data() {
    return {
      ruleForm: { testObj: 0, classObj: null, timeObj: null }, //表单绑定的数据
      rules: {
        testObj:[
          {}
        ]
      }, //表单验证
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      currentPage: 1, //当前页码
      pageSize: 10, //每页大小
      total: null, //总条目
      form: {},
      testObj: 0, // 父传子 试卷
      classObj: {}, // 父传子  班级
      timeObj: [] //父传子  考试时间
    };
  },
  //定义组件
  components: {
    TestDropDownBox,
    ClassNameSelect,
    TestTime
  },
  //定义方法
  methods: {
    /**
     * 安排测试
     *
     *
     * */
    setAddInfo() {
      let _this = this;
      console.log(_this.ruleForm.tiemObj);
      // if (_this.logTime == null) {
      //   _this.timeLimit = 0;
      // } else {
      //   let date1 = new Date(_this.logTime[0]); //转格式
      //   let date2 = new Date(_this.logTime[1]); //转格式
      //   var dates = date2.getTime() - date1.getTime(); //计算
      //   _this.timeLimit = dates / (60 * 1000); //赋值
      // }

      // 判断输入框是否有值  是否符合条件

      // if (
      //   _this.childRes1 == "" ||
      //   _this.childRes2 == "" ||
      //   _this.childRes3 == ""
      // ) {
      //   _this.$msg(_this, -1, "信息不能为空！");
      //   return;
      // } else if (_this.childRes3.a <= 30) {
      //   _this.$msg(_this, -1, "考试时间不能少于30分钟！");
      //   return;
      // }
      // let obj = {
      //   // taskTestPaperId: _this.childRes1, //试卷编号
      //   // taskClassId: _this.childRes2, //班级编号
      //   // taskStartTime: _this.childRes3[0], //开始时间
      //   // taskEndTime: _this.childRes3[1] //结束时间
      // };
      // let uId = sessionStorage.getItem("userId"); //获取本地存储中登录的编号
      // // 调用接口
      // _this.axios.post("/api/TestPaper/SetTest?uid=" + uId, obj).then(
      //   res => {
      //     let dataCu = res.data.data;
      //     console.log(dataCu);
      //     if (res.data.code == 1) {
      //       _this.$message({
      //         type: "success",
      //         message: "设置成功!"
      //       });
      //       _this.SetTest.unshift(dataCu);
      //       // _this.cancelTest();//调用清空表单方法
      //     } else if (res.data.code == -2) {
      //       _this.$message({
      //         type: "error",
      //         message: "参数错误!设置失败！"
      //       });
      //     }
      //   },
      //   () => {
      //     _this.$message({
      //       type: "error",
      //       message: "系统错误!"
      //     });
      //   }
      // );
    },
    /**
     * 取消安排测试
     * 清空表单
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
      console.log(row);
      _this.dialogFormVisible = true;
      // _this.pRes = row.taskTestPaperId; //试卷
      // _this.cRes = row.classId; //班级
      // _this.$set(_this.timeRes, "begin", row.taskStartTime);
      // _this.$set(_this.timeRes, "end", row.taskEndTime);
      // _this.$set(_this.timeRes, "escape", row.taskEscapeTime);
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
      width: 70px;
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
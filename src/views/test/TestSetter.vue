<template>
  <div id="TestSetter">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('test.r3')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Breadcrumb 面包屑 结束-->
    <el-card class="box-card">
      <div slot="header">
        <div class="impComp">
          <!-- 组件引用 -->
          <test-drop-down-box @childByValue="childByValue"></test-drop-down-box>
          <class-and-grade @childByValue2="childByValue2"></class-and-grade>
          <test-time @childByValue3="childByValue3"></test-time>
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
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">{{$t('btn.d')}}</el-button>
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
      <el-form :model="form">
        <test-drop-down-box :parentRes="pRes"></test-drop-down-box>
        <class-and-grade :parentRes2="cRes"></class-and-grade>
        <test-time :parentRes3="timeRes"></test-time>
      </el-form>
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
import ClassAndGrade from "@/components/TestSetter/ClassAndGrade"; //班级
import TestTime from "@/components/TestSetter/TestTime"; //考试时间

export default {
  data() {
    return {
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      currentPage: 1, //当前页码
      pageSize: 10, //每页大小
      total: null, //总条目
      form: {},
      childRes1: "", //接收子组件传的值  试卷
      childRes2: "", //接收子组件传的值 班级
      childRes3: {}, //接收子组件传的值 考试时间
      pRes: "", //父级组件下发给子组件的值 试卷
      cRes: "", //父级组件下发给子组件的值 班级
      timeRes: [] //父级组件下发给子组件的值 考试时间
    };
  },
  //定义组件
  components: {
    TestDropDownBox,
    ClassAndGrade,
    TestTime,
  },
  //定义方法
  methods: {
    /**
     * 获取子组件的数据
     * 试卷
     * @param {String} childValue 就是子组件传过来的值
     *
     * */
    childByValue(childValue) {
      // childValue就是子组件传过来的值
      let _this = this;
      _this.childRes1 = childValue;
    },
    /**
     * 获取子组件的数据
     * 班级
     *@param {String} cVal 就是子组件传过来的值
     * */
    childByValue2(cVal) {
      let _this = this;
      // cVal就是子组件传过来的值
      _this.childRes2 = cVal;
    },
    /**
     * 获取子组件的数据
     * 考试时间
     *  @param {Object} tVal 就是子组件传过来的值
     *
     * */
    childByValue3(tVal) {
      // tVal就是子组件传过来的值
      let _this = this;
      // console.log(tVal);
      // console.log(tVal.a)

      // console.log(tVal);
      // _this.childRes3[0] = tVal[0];
      _this.childRes3 = tVal;
    },
    /**
     * 安排测试
     *
     *
     * */
    setAddInfo() {
      let _this = this;
      let obj = {
        taskTestPaperId: _this.childRes1, //试卷编号
        taskClassId: _this.childRes2, //班级编号
        taskStartTime: _this.childRes3[0], //开始时间
        taskEndTime: _this.childRes3[1] //结束时间
      };
      // console.log(obj)
      // console.log(obj);
      let uId = sessionStorage.getItem("userId"); //获取本地存储中登录的编号
      // console.log(uId);
      // 调用接口
      _this.axios.post("/api/TestPaper/SetTest?uid=" + uId, obj).then(
        res => {
          let dataCu = res.data.data;
          console.log(dataCu);
          if (res.data.code == 1) {
            _this.$message({
              type: "success",
              message: "设置成功!"
            });
            _this.SetTest.unshift(dataCu);
          } else if (res.data.code == -2) {
            _this.$message({
              type: "error",
              message: "参数错误!设置失败！"
            });
          }
        },
        () => {
          _this.$message({
            type: "error",
            message: "系统错误!"
          });
        }
      );
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
      _this.pRes = row.taskTestPaperId; //试卷
      _this.cRes = row.classId; //班级
      _this.timeRes[0] = row.taskStartTime; //考试时间  开始
      _this.timeRes[1] = row.taskEndTime; //考试时间  结束
      _this.timeRes[2] = row.taskEscapeTime; //耗时
      console.log(_this.timeRes);
      // console.log(_this.pRes);
      // console.log(row.taskId);
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
<template>
  <div id="TestSetter">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>安排测试</el-breadcrumb-item>
    </el-breadcrumb>
     {{son}}
    <!-- Breadcrumb 面包屑 结束 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header">
        <div class="impComp">
          <!-- 组件引用 -->
          <c-t-t-box v-model="son"></c-t-t-box>
          <!-- <h1>{{son}}</h1> -->
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
      <c-t-t-box v-model="son" :obj1="obj1"></c-t-t-box>
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
import CTTBox from "@/components/TestSetter/CTTBOx";
export default {
  data() {
    return {
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      currentPage: 1, //当前页码
      pageSize: 10, //每页大小
      total: null, //总条目
      son: [], //接收子值
      obj1:{
        tPaper:"",
        cGrade:"",
        m:{s:"",e:""},
        time:"",
      } //父传子
    };
  },
  components: {
    "c-t-t-box": CTTBox
  },
  //定义方法
  methods: {
    /**
     * 安排测试
     *
     *
     * */
    setTest() {
      let _this = this;
      let obj = {
        taskTestPaperId: _this.son.t, //试卷编号
        taskClassId: _this.son.c, //班级编号
        taskStartTime: _this.son.m[0], //开始时间
        taskEndTime: _this.son.m[1] //结束时间
      };
      console.log(obj);
      let uId = sessionStorage.getItem("userId"); //获取本地存储中登录的编号
      console.log(uId);
      // 调用接口
      _this.axios.post("/api/TestPaper/SetTest?uid=" + uId, obj).then(
        res => {
          console.log(res);
          if (res.data.code == 1) {
            _this.$message({
              type: "success",
              message: "设置成功!"
            });
            // obj = {}; //清空值
            // _this.son = []; //清空值
            // console.log( obj);
            // console.log(_this.son)
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
      // _this.son = ;
      console.log(_this.son);
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
      // console.log(index, row);
      _this.obj1 = {
        tPaper: row.taskTestPaperId, //试卷
        cGrade: row.classId, //班级
        m:{
          s:row.taskStartTime,//开始
          e:row.taskEndTime//结束
        },
        time:row.taskEscapeTime,//耗时
        flag:false
      };
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
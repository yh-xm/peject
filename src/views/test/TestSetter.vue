<!--按排测试-->
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
          <el-form>
            <el-form-item :label="$t('base.r7')">
              <test-drop-down-box v-model="testObj"></test-drop-down-box>
            </el-form-item>

            <el-form-item :label="$t('base.r8')" >
              <class-name-select v-model="classObj"></class-name-select>
            </el-form-item>
            <el-form-item :label="$t('base.r9')" >
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
    <el-dialog :title="$t('base.r10')" :visible.sync="dialogFormVisible" center width="50%">
      <!-- 嵌套的表单 -->
      <el-form>
        <el-form-item :label="$t('base.r7')">
          <test-drop-down-box v-model="testObj2"></test-drop-down-box>
        </el-form-item>

        <el-form-item :label="$t('base.r8')">
          <class-name-select v-model="classObj2"></class-name-select>
        </el-form-item>
        <el-form-item :label="$t('base.r9')">
          <test-time v-model="timeObj2"></test-time>
        </el-form-item>
      </el-form>
      <!-- 嵌套的表单结束 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePageInfo">{{$t('btn.c')}}</el-button>
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
      SetTest: [], //初始化分页数据
      dialogFormVisible: false, //对话框隐藏
      currentPage: 1, //当前页码
      pageSize: 10, //每页大小
      total: null, //总条目
      testObj: {}, // 父传子 试卷
      testObj2: {},// 父传子 试卷
      classObj: {}, // 父传子  班级
      classObj2: {}, // 父传子  班级
      timeObj: [], //父传子  考试时间
      timeObj2: [], //父传子  考试时间
      taskId: "",//试卷id
      oindex: ""//下标
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
      const _this = this;
      // 判断输入框是否有值  是否符合条件
      if (
        !_this.testObj.hasOwnProperty("tpId") ||
        !_this.classObj.hasOwnProperty("classId") ||
        _this.timeObj.length == 0
      ) {
        _this.$msg(_this, 0, _this.$t("mesTips.empty"));
        return;
      } else if (_this.timeObj.TimeDiff < 30) {
        _this.$msg(_this, 0, _this.$t("mesTips.time"));
        return;
      }
      let obj = {
        taskTestPaperId: _this.testObj.tpId, //试卷编号
        taskClassId: _this.classObj.classId, //班级编号
        taskStartTime: _this.timeObj[0], //开始时间
        taskEndTime: _this.timeObj[1] //结束时间
      };
      let uId = sessionStorage.getItem("userId"); //获取本地存储中登录的编号
      _this.$post("/api/TestPaper/SetTest?uid=" + uId, obj).then(
        res => {
          let dataCu = res.data;
          if (res.code == 1) {
            _this.$msg(_this, 1, _this.$t("mesTips.set"));
            var tpId = dataCu.tpId;
            dataCu.taskTestPaperId = tpId;
            _this.SetTest.unshift(dataCu);
            _this.cancelTest(); //调用清空表单方法
          } else if (res.code == -2) {
            _this.cancelTest(); //调用清空表单方法
            _this.$msg(_this, -1, _this.$t("mesTips.parameter"));
          }
        },
        () => {
          _this.cancelTest(); //调用清空表单方法
          _this.$msg(_this, -1,  _this.$t("mesTips.systemError"));
        }
      );
    },
    /**
     * 取消安排测试
     * 清空表单
     *
     * */
    cancelTest() {
      const _this = this;
      _this.testObj = {};
      _this.classObj = {};
      _this.timeObj = [];
      _this.timeObj.TimeDiff = 0;
    },

    /**
     * 分页获取测试任务表
     * 渲染到表格
     *
     * */

    getSetTest() {
      const _this = this;
      _this
        .$get(
          "/api/TestPaper/GetTestTask?pageIndex=" +
            _this.currentPage +
            "&pageSize=" +
            _this.pageSize
        )
        .then(res => {
          // roles等于回调函数返回的res（值）
          _this.SetTest = res.data; //表格数据
          for (const key in _this.SetTest) {
            _this.SetTest[key].taskEndTime = _this.SetTest[
              key
            ].taskEndTime.replace("T", " ");
            _this.SetTest[key].taskStartTime = _this.SetTest[
              key
            ].taskStartTime.replace("T", " ");
            _this.SetTest[key].taskEndTime = _this.SetTest[
              key
            ].taskEndTime.replace(/-/g, "/");
            _this.SetTest[key].taskStartTime = _this.SetTest[
              key
            ].taskStartTime.replace(/-/g, "/");
          }
          _this.total = res.items; //总条数
        });
    },

    /**
     * 编辑当前行表格信息
     * @param {Nameber} index 当前行所在下标
     * @param {String} row 当前行所有数据
     * */
    handleEdit(index, row) {
      const _this = this;
      _this.taskId = row.taskId;
      _this.oindex = index;
      _this.dialogFormVisible = true;
      var taskEndTime = row.taskEndTime;
      var taskStartTime = row.taskStartTime;
      taskStartTime = taskStartTime.replace("T", " ");
      taskEndTime = taskEndTime.replace("T", " ");
      taskStartTime = taskStartTime.replace(/-/g, "/");
      taskEndTime = taskEndTime.replace(/-/g, "/");
      _this.timeObj2 = [taskStartTime, taskEndTime, row.taskEscapeTime];
      _this.classObj2 = {
        classId: row.classId,
        className: row.className
      };
      _this.testObj2 = {
        tpId: row.taskTestPaperId,
        tpTitle: row.tpTitle
      };
    },
    changePageInfo() {
      const _this = this;
      _this
        .$post("/api/TestPaper/ModifyTestTask", {
          taskId: _this.taskId, //主键编号
          taskTestPaperId: _this.testObj2.tpId, //试卷编号
          taskClassId: _this.classObj2.classId, //班级编号，可修改
          taskStartTime: _this.timeObj2[0], //测试开始时间，可修改
          taskEndTime: _this.timeObj2[1] //测试结束时间，可修改
        })
        .then(res => {
          if (res.message == "修改成功。") {
            _this.$msg(_this, 1,_this.$t("systemError.modifySuccess"));
            _this.dialogFormVisible = false;
            _this.SetTest[_this.oindex].className = _this.classObj2.className;
            _this.SetTest[_this.oindex].taskTestPaperId = _this.testObj2.tpId;
            _this.SetTest[_this.oindex].classId = _this.classObj2.classId;
            _this.SetTest[_this.oindex].tpTitle = _this.testObj2.tpTitle;
            _this.SetTest[_this.oindex].taskStartTime = _this.timeObj2[0];
            _this.SetTest[_this.oindex].taskEndTime = _this.timeObj2[1];
            _this.SetTest[_this.oindex].taskEscapeTime = _this.timeObj2[2];
          } else {
            _this.$msg(_this, -1, _this.$t("systemError.failed"));
          }
        });
    },
    /**
     * 删除当前行表格信息
     * @param {Nameber} index 当前行所在下标
     * @param {String} row 当前行所有数据
     * */

    handleDelete(index, row) {
      let taskId = row.taskId;
      const _this = this;
      var lang = localStorage.locale;
      if (lang == "en") {
        var contentText = "Confirm";
        var contentText2 = "Cancel";
        var flag = "Hint";
        var title =
          "This operation will permanently delete the data. Do you want to continue?";
      } else {
        var contentText = "确定";
        var contentText2 = "取消";
        var flag = "提示";
        var title = "此操作将永久删除该数据, 是否继续?";
      }
      _this
        .$confirm(title, flag, {
          congirmButtonText: contentText,
          cancelButtonText: contentText2,
          type: "warning",
          center: true
        })
        .then(() => {
          _this
            .$post("/api/TestPaper/RemoveTestTask?taskId=" + taskId)
            .then(res => {
              console.log(res);
              if (res.code === 1) {
                _this.SetTest.splice(index, 1);
                _this.$msg(_this, 1, _this.$t("systemError.deleteSuccess"));
              }
            });
        })
        .catch(() => {
          _this.$msg(_this, 0, _this.$t("systemError.resDelete"));
        });
    },

    /**
     * 分页 pageSize 改变时会触发
     * 长度改变----改变每页显示的条数的时候  自动触发
     * @param {Number} val 显示多少条数据
     * */
    handleSizeChange(val) {
      const _this = this;
      _this.pageSize = val;
      _this.getSetTest();
    },
    /**
     * 分页 currenPage 改变时会触发
     * 当前改变----当前页码改变之后，触发这个函数
     *@param {Number} val 点击后的当前页
     * */

    handleCurrentChange(val) {
      const _this = this;
      _this.currentPage = val;
      _this.getSetTest();
    }
  },
  created() {
    const _this = this;
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
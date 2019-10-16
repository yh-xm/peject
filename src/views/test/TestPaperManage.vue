<!---试卷管理-->
<template>
  <div id="TestPaperManage">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">
        <router-link v-if="item.url" :to="item.url">{{$t(item.name)}}</router-link>
        <a v-else>{{$t(item.name)}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <div slot="header" class="clearfix">
        <el-table :data="tableData" style="width:100%" :border="true">
          <el-table-column label="#" prop="index"></el-table-column>
          <el-table-column :label="$t('tableName.tt')" prop="tpTitle"></el-table-column>
          <el-table-column :label="$t('tableName.tp')" prop="userName"></el-table-column>
          <el-table-column :label="$t('tableName.tc')" prop="courseName"></el-table-column>
          <el-table-column :label="$t('tableName.td')">
            <template slot-scope="scope">{{scope.row.tpDate | firstSet}}</template>
          </el-table-column>
          <el-table-column align="left" :label="$t('tableName.tm')" width="320">
            <template slot-scope="scope">
              <!-- hasTest -->
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                :disabled="scope.row.hasTest"
              >{{$t('btn.c')}}</el-button>
              <el-button
                size="mini"
                @click="handleGet(scope.$index, scope.row)"
                :disabled="scope.row.hasTest"
              >{{$t('btn.detail')}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="scope.row.hasTest"
              >{{$t('btn.d')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text">
        <div class="block">

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pages"
          ></el-pagination>
        </div>
        <!-- 弹出框 -->
        <el-dialog center :title="$t('test.makep16')" :visible.sync="dialogFormVisible">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item :label="$t('tableName.tt')" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <course-frame  v-model="bothWay"  :oname="nemuId" class="selectOptions"></course-frame>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{$t('btn.res')}}</el-button>
            <el-button type="primary" @click="amend('ruleForm')">{{$t('btn.s')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import CourseFrame from "@/components/CourseFrame.vue";
export default {
  components: { CourseFrame }, //组件注册
  data() {
    return {
      bothWay:{courseId:0,courseName:""}, //接收子组件的值
      nemuId: "", //用于发送给子组件的宽度
      tableData: [], //接收渲染的数据
      pages: 0, //总条数
      each: 10, // 显示多少条每页
      fewPages: 1, //显示从第几条显示
      dialogFormVisible: false, //用于判断是否弹出弹出框
      tpId: "", //试卷编号
      usIndex: "", //编辑时选中的下标
      ruleForm: {
        name: "" //试卷标题
      },
      rules: {
        name: [
          //试卷标题验证
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
  
    /**
     * 点击编辑
     * @param {Number} index 当前行的下标
     * @param {object} row 当前行的用户数据
     */
    handleEdit(index, row) {
   
      var _this = this;
        // console.log(row, _this.bothWay)
      _this.ruleForm.name = row.tpTitle; //获取的名字赋值给弹出框
      //   //赋值给子组件
        _this.bothWay={
          courseId:row.tpCourseId, //把课程id 赋值给子组件
          courseName:row.courseName
        }
      _this.tpId = row.tpId; //当前行的试卷id
      _this.usIndex = index; //当前行的下标
      _this.dialogFormVisible = true;
    },
    /**
     * 点击确定修改
     * @param {boolean} formName 表单的验证
     */
    amend(formName) {
      
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.$post("api/TestPaper/ModifyTestPaper", {
              tpId: _this.tpId, //试卷编号
              tpCourseId: _this.bothWay.courseId, //课程编号
              tpTitle: _this.ruleForm.name //试卷标题
            })
            .then(function(data) {
              if (data.code == 1) {
                _this.$msg(_this, 1, "修改成功"); //成功提示

                var alter = _this.tableData[_this.usIndex]; //数据赋值以达到刷新
                alter.tpTitle = _this.ruleForm.name;
                alter.courseName = _this.bothWay.courseName;
                alter.tpCourseId = _this.bothWay.courseId;
              } else if (data.code == 0) {
                _this.$msg(_this, 0, "数据没做修改"); //警告提示
              } else if (data.code == -1) {
                _this.$msg(_this, -1, "系统异常"); //错误提示
              }
            });
          _this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    /**
     * 点击删除
     * @param {Number} index 当前行的下标
     * @param {object} row 当前行的用户数据
     */
    handleDelete(index, row) {
      var _this = this;
      var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "Confirm";
        var contentText2 = "Cancel";
        var flag ="Hint"
        var title = "This operation will permanently delete the data. Do you want to continue?"
      }else{
         var contentText = "确定";
        var contentText2 = "取消";
        var flag ="提示"
        var title = "此操作将永久删除该数据, 是否继续?"
      }
      _this
        .$confirm(title, flag, {
          confirmButtonText: contentText,
          cancelButtonText: contentText2,
          type: "warning",
          center: true
        })
        .then(() => {
          //删除axios
          _this.$post("api/TestPaper/RemoveTestPaper?id=" + row.tpId)
            .then(function(data) {
              if (data.code == 1) {
                _this.tableData.splice(index, 1); //用下标删除面板中单行的数据达到刷新
                _this.$msg(_this, 1, "删除成功"); //成功提示
                _this.pages=_this.pages-1 //总数量也减一
                for (let key in _this.tableData) {
                  if (index < _this.tableData[key].index) { //删除时会自动排序
                    _this.tableData[key].index = _this.tableData[key].index - 1;
                  }
                }

              } else if (data.code == 0) {
                _this.$msg(_this, 0, "数据没做修改"); //警告提示
              } else if (data.code == -1) {
                _this.$msg(_this, -1, "系统异常"); //错误提示
              }
            });
        })
        .catch(() => {
        });
    },
    /**
     * 获取每页显示多少条的数据并赋值
     * @param {Number} val 每页需要显示的条数
     */
    handleSizeChange(val) {
      var _this = this;
      _this.each = val; //每页需要显示的条数 赋值给定义的变量并调用渲染接口
      _this.testPaper();
    },
    /**
     * 获取当前多少页并赋值
     * @param {Number} val 表示第几页
     */
    handleCurrentChange(val) {
      var _this = this;
      _this.fewPages = val; //显示第几页的数据 赋值给定义的变量并调用渲染接口
      _this.testPaper();
    },

    /**
     * 封装渲染数据方法以达到重复调用
     */
    testPaper() {
      var _this = this;
      _this.$get(
          "/api/TestPaper/GetTestPaperList?pageIndex=" +
            _this.fewPages +
            "&pageSize=" +
            _this.each
        )
        .then(function(data) {
          var stu = data.data; //赋值给定义的变量用于渲染
          for (const key in stu) {
            //计算位置下标并赋值
            stu[key].index =
              Number(_this.each) * (Number(_this.fewPages) - 1) +
              Number(key) +
              1;
          }
          _this.tableData = stu;
          _this.pages = data.items; //赋值给显示的条数
        });
    },
    /**
     *查看详情
     * @param {Number} index 当前行的下标
     * @param {object} row 当前行的用户数据
     */
    handleGet(index, row) {
      // console.log(row.tpId)
      this.$router.push({ path: `/testPageInfo/${row.tpId}` });
    }
  },
  created() {
    var _this = this;
    _this.testPaper(); //调用数据渲染
  }
};
</script>
<style lang="less" scoped>
//面包屑导航下外边距20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}
//分页居中
.block {
  text-align: center;
}
//控制from表单输入框宽度
/deep/.el-form-item {
  /deep/.el-form-item__label {
    margin-left: 15px;
  }
  /deep/.el-input__inner {
    margin-left: 15px;
  }

  div {
    width: 350px;
    //调下拉框小三角
    /deep/.el-input__suffix {
      left: 340px;
    }
  }
}
//把表单的小 *点变成白色的
/deep/.el-form-item__label:before {
  content: "*";
  color: #fff !important;
  margin-right: 4px;
}

//弹出弹出框的宽度
/deep/.el-dialog {
  width: 430px;
}
</style>
<template>
  <div id="ClassManage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>基础数据</el-breadcrumb-item>
          <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <!-- 新增 -->
        <div class="newly">
          <el-button type="text" @click="newly">
            <i class="el-icon-circle-plus-outline"></i> 新增班级
          </el-button>
        </div>
        <!-- 班级表格 -->
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="班级名称" prop="className"></el-table-column>
          <el-table-column label="授课老师" prop="userName"></el-table-column>
          <el-table-column label="专业" prop="courseName"></el-table-column>
          <el-table-column label="班级人数" prop="classStudents"></el-table-column>
          <el-table-column label="开班日期" prop="classCreateTime"></el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="scope.row.classStudents > 0?true : false"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出框 -->
        <!-- Form -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm">
            <!-- 弹出框 班级名称框 -->
            <el-form-item label="班级名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <!-- 弹出框 专业课程下拉框 -->
            <el-form-item label="专业课程" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择">
                <el-option
                  v-for="(inte,index) in course"
                  :key="index"
                  :label="inte.courseName"
                  :value="inte.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 弹出框 授课老师下拉框 -->
            <el-form-item label="授课老师" prop="usName">
              <el-select v-model="ruleForm.usName" placeholder="请选择">
                <el-option
                  v-for="(inte,index) in teacher"
                  :key="index"
                  :label="inte.userName"
                  :value="inte.userId"
                  center
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 弹出框的确定取消按钮 -->
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')" v-show="stunewly">添加</el-button>
            <el-button type="primary" @click="amend('ruleForm')" v-show="stuamend">修改</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  
  data() {
    return {
      title:"",//弹出框标题
      tableData: [], //接收向后台请求的数据用渲染
      teacher: [], //接收后台传过来的老师信息
      course: [], //接收后台传过来的课程信息
      search: "",
      dialogFormVisible: false, //用于判断是否弹出弹出框
        classId: "", //修改的班级主键
      ruleForm: {
        //新增的参数
        name: "", //班级名
        region: "", //课程编码
        usName: "" //老师编码
      },
      rules: {
        //表单验证
        name: [
          //表单验证班级名字
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 1, trigger: "blur" }
        ],
        region: [
          //表单验证课程
          { required: true, message: "请选择课程", trigger: "change" }
        ],
        usName: [
          //表单验证授课老师
          { required: true, message: "请选择老师", trigger: "change" }
        ]
      },
      stunewly: true, //新增按钮
      stuamend: true, //修改按钮
    };
  },
  methods: {
    // 修改弹出框并赋值
    handleEdit(index, row) {
      this.dialogFormVisible = true; //当为true时弹出弹出框
      this.stunewly = false; //弹出框的新增按钮为false时销毁
      this.stuamend = true; //弹出框的修改按钮按钮为true时销毁
      this.ruleForm.name = row.className; //点击获取的班级名字赋值给输入框
      this.classId = row.classId; //获取的班级主键赋值
      this.ruleForm.region = row.classCourseId; //获取的课程编码赋值给原课程编码 就能默认选中
      this.ruleForm.usName = row.classTeacherId; //获取的授课老师编码赋值给原授课老师编码 就能默认选中
      this.title="修改班级信息"
    },
    // 点击修改修改
    amend(formName) {
    
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断输入框是否为空
          this.axios({
            //修改axios
            method: "post",
            url: "/api/Class/ModifyClass",
            data: {
              classId: _this.classId,
              className: _this.ruleForm.name,
              classCourseId: _this.ruleForm.region,
              classTeacherId: _this.ruleForm.usName
            } 
          }).then(function(data) {
            //deta 接收的值为 1 时修改成功， -1 为异常，0 为没有改变
            if (data.data.code == "1") {
              _this.open4();
            } else if (data.data.code == "-1") {
              _this.open3();
            } else if (data.data.code == "0") {
              _this.open();
            }
            _this.overall(); //调用封装好的渲染方法用来做实时刷新
          });
          this.dialogFormVisible = false; //关闭弹出框
        } else {
          //输入框为空时执行
          return false;
        }
      });
    },
    // 点击删除
    handleDelete(index, row) {
      var _this = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          //删除axios
          _this
            .axios("/api/Class/RemoveClass?classId=" + row.classId)
            .then(function(data) {
              //deta 接收的值为 1 时删除成功， -1 为异常表示不能删除，0 为没有改变
              if (data.data.code == "1") {
                _this.open5();
              } else if (data.data.code == "-1") {
                _this.open6();
              } else if (data.data.code == "0") {
                _this.open();
              }
              _this.overall();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击弹出新增班级
    newly() {
      this.dialogFormVisible = true; //当为true时弹出弹出框
      this.stunewly = true; //弹出框的新增按钮为true时销毁
      this.stuamend = false; //弹出框的修改按钮按钮为false时销毁
      this.ruleForm.name = ""; //点击获取的班级名字赋值给输入框
      this.ruleForm.region = ""; //清除修改时赋的值
      this.ruleForm.usName = ""; //清除修改时赋的值
      this.title="新增班级信息"
    },
    //点击新增班级
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios({ //新增的axis
            method: "post",
            url: "/api/Class/AddClass",
            data: {
              className: _this.ruleForm.name,
              classCourseId: _this.ruleForm.region,
              classTeacherId: _this.ruleForm.usName
            }
          }).then(function(data) {
            //deta 接收的值为 1 时新增成功， -1 为异常，0 为没有改变
            if (data.data.code == "1") {
              _this.open2();
            } else if (data.data.code == "-1") {
              _this.open3();
            } else if (data.data.code == "0") {
              _this.open();
            }
            _this.overall();
          });
          this.dialogFormVisible = false;
        } else {
          //输入框为空时执行
          return false;
        }
      });
    },
    // 分装的提示信息用于调用
    open() {
      this.$message("数据没有改变");
    },
    open2() {
      this.$message({
        message: "新增班级成功",
        type: "success"
      });
    },
    open3() {
      this.$message({
        message: "系统异常请重新操作",
        type: "warning"
      });
    },
    open4() {
      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    open5() {
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },
    open6() {
      this.$message({
        message: "此班级不能删除，如要删除请联系管理员",
        type: "warning"
      });
    },
    // 分装的axios班级信息用来调用刷新
    overall() {
      var _this = this;
      this.axios.get("/api/Class/GetAllClass").then(function(data) {
        var stu = data.data;
        for (const key in stu) {
          //可根据本地时间把 Date 对象的日期部分转换为字符串，并返回结果
          stu[key].classCreateTime = new Date(stu[key].classCreateTime).toLocaleDateString(); 
        }
        _this.tableData = stu;
      });
    }
  },
  created() {
    this.overall(); //调用封装渲染axios
    var _this = this;
    //获取授课老师信息
    this.axios.get("/api/User/GetTeachers").then(function(data) {
      _this.teacher = data.data;
    });
    //获取课程信息
    this.axios.get("/api/Class/GetAllCourse").then(function(data) {
      _this.course = data.data;
    });
  }
};
</script>

<style lang="less" scoped>
// 新增按钮
.newly {
  margin: 0px auto;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 17px;
  /deep/.el-button{
    font-weight:bold ;
  }
}

// 表格
/deep/.el-table {
  margin: 0px auto;
}
// 弹出框
/deep/.el-form-item {
  div {
    width: 300px;
    .el-input.el-input--suffix {
      width: 250px;
    }
  }
}
/deep/.el-dialog {
  width: 448px;
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
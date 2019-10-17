<!--班级管理-->
<template>
  <div id="ClassManage">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.r1')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <!-- 新增 -->
        <div class="newly">
          <el-button type="text" @click="newly">
            <i class="el-icon-circle-plus-outline"></i> {{$t('btn.addclass')}}
          </el-button>
        </div>
        <!-- 班级表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column :label="$t('tableName.tcn')" prop="className"></el-table-column>
          <el-table-column :label="$t('tableName.tte')" prop="userName"></el-table-column>
          <el-table-column :label="$t('tableName.tc')" prop="courseName"></el-table-column>
          <el-table-column :label="$t('tableName.tcp')" prop="classStudents"></el-table-column>
          <el-table-column :label="$t('tableName.tcs')">
            <template slot-scope="scope">{{scope.row.classCreateTime | firstSet}}</template>
          </el-table-column>
          <el-table-column align="left" :label="$t('tableName.tm')">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.c')}}</el-button>
         
          <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="scope.row.classStudents >0"
                v-has
              >{{$t('btn.d')}}</el-button>
          
    
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出框 -->
        <!-- Form -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" center>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <!-- 弹出框 班级名称框 -->
            <el-form-item :label="$t('tableName.tcn')" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <!-- 弹出框 专业课程下拉框 -->
        <course-frame v-model="lovingVue"  :oname="nemuId"></course-frame>
            <!-- 弹出框 授课老师下拉框 -->
            <el-form-item :label="$t('tableName.tte')" prop="usName">
              <el-select v-model="ruleForm.usName" placeholder="请选择">
                <el-option
                  v-for="(inte,index) in teacher"
                  :key="index"
                  :label="inte.userName"
                  :value="inte.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 弹出框的确定取消按钮 -->
          <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisible = false">{{$t('btn.r')}}</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" v-if="stuNewly==!true">{{$t('btn.a')}}</el-button>
            <el-button type="primary" @click="amend('ruleForm')" v-if="stuNewly">{{$t('btn.c')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import CourseFrame from '@/components/CourseFrame.vue'
export default {
   components:{CourseFrame}, //注册
  data() {
    return {
      nemuId:"100px",//传递给子组件用于命名
      lovingVue:{courseId:0,courseName:""}, //接收子组件传过来的值
      title: "", //弹出框标题
      tableData: [], //接收向后台请求的数据用渲染
      teacher: [], //接收后台传过来的老师信息
      course: [], //接收后台传过来的课程信息
      dialogFormVisible: false, //用于判断是否弹出弹出框
      classId: "", //修改的班级主键
      ruleForm: {
        //新增的参数
        name: "", //班级名
        usName: "" //老师编码
      },
      rules: {
        //表单验证
        name: [
          //表单验证班级名字
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 1, trigger: "blur" }
        ],
        usName: [
          //表单验证授课老师
          { required: true, message: "请选择老师", trigger: "change" }
        ]
      },
      stuNewly: true, //新增按钮
      index: "", //修改所需要的下标
      laoShi: "" //用来接收老师名字
    };
  },
  methods: {
    /**
     * 获取下拉框选中的名字
     */
    minZhi() {
      var _this = this;
      var usLaoShi = _this.teacher.filter(function(data) {
        //过滤器过滤名字
        return data.userId == _this.ruleForm.usName;
      });
      _this.laoShi = usLaoShi[0].userName;
    },
    
    /**
     * 修改弹出框并赋值
     * @param {Number} index 当前行的下标
     * @param {object} row 点击当前行的数据
     */
    handleEdit(index, row) {
         var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "Modify Class Information";
      }else{
         var contentText = "修改班级信息";
      }
      var _this = this;
      _this.index = index;
      _this.dialogFormVisible = true; //当为true时弹出弹出框
      _this.stuNewly = true; //弹出框的新增按钮为true时
      _this.ruleForm.name = row.className; //点击获取的班级名字赋值给输入框
      _this.classId = row.classId; //获取的班级主键赋值
      _this.lovingVue = {
        courseId:row.classCourseId,//获取的课程编码赋值给原课程编码 就能默认选中
        courseName:row.courseName
      }; 
      _this.ruleForm.usName = row.classTeacherId; //获取的授课老师编码赋值给原授课老师编码 就能默认选中
      
      _this.title = contentText;
     
      
    },
    /**
     * 点击修改数据
     * @param {Boolean} formName 验证表单
     */
    amend(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.minZhi(); //调用 获取下拉框选中的名字 方法
          //判断输入框是否为空
          _this.axios
            .post("/api/Class/ModifyClass", {
              classId: _this.classId,
              className: _this.ruleForm.name,
              classCourseId:_this.lovingVue.courseId,
              classTeacherId: _this.ruleForm.usName
            })
            .then(function(data) {
              //deta 接收的值为 1 时修改成功， -1 为异常，0 为没有改变
              if (data.data.code == 1) {
                  _this.$msg(_this, 1, "修改成功");//成功提示
                var banJi = _this.tableData[_this.index]; //获取要修改的那组数据并赋值了一个变量
                banJi.courseName =_this.lovingVue.courseName; //课程名字
                banJi.classCourseId =_this.lovingVue.courseId
                banJi.userName = _this.laoShi; //授课老师
                banJi.className = _this.ruleForm.name; //班级名字
                banJi.classTeacherId = _this.ruleForm.usName; //授课老师编码
              } else if (data.data.code == -1) {
                 _this.$msg(_this, -1, "系统异常"); //错误提示 
              } else if (data.data.code == 0) {
              _this.$msg(_this, 0, "数据没做修改"); //警告提示 
              }
            });
          _this.dialogFormVisible = false; //关闭弹出框
        } else {
          //输入框为空时执行
          return false;
        } 
      });
    },
    /**
     * 点击删除
     * @param {Number} index 当前行的下标
     * @param {object} row 点击当前行的所有数据
     */
    handleDelete(index, row) {
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
      var _this = this;
     
      _this
        .$confirm(title, flag, {
          confirmButtonText: contentText,
          cancelButtonText: contentText2,
          type: "warning",
          center: true
        })
        .then(() => {
          //删除axios
          _this
            .axios("/api/Class/RemoveClass?classId=" + row.classId)
            .then(function(data) {
              //deta 接收的值为 1 时删除成功， -1 为异常表示不能删除，0 为没有改变
              if (data.data.code == 1) {
                _this.tableData.splice(index, 1);
               _this.$msg(_this, 1, "删除成功");//成功提示
              } else if (data.data.code == -1) {
               _this.$msg(_this, -1, "系统异常"); //错误提示 
              } else if (data.data.code == 0) {
                 _this.$msg(_this, 0, "数据没做修改"); //警告提示 
              }
            });
        })
        .catch(() => {
          _this.$msg(_this, 2, "已取消删除");//成功提示
        });
    },
    /**
     * 点击弹出新增框
     */
    newly() {
          var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "New Class Information";
      }else{
         var contentText = "新增班级信息";
      }
      var _this = this;
      _this.dialogFormVisible = true; //当为true时弹出弹出框
      _this.stuNewly = false; //弹出框的新增按钮为false
      _this.ruleForm.name = ""; //点击获取的班级名字赋值给输入
      _this.ruleForm.usName = ""; //清除修改时赋的值
      _this.title =contentText;
      _this.lovingVue = {
        courseId:"",//获取的课程编码赋值给原课程编码 就能默认选中
        courseName:""
      };//赋值为空用以清除
    },
    /**
     * 点击新增
     * @param {boolean} formName 表单的验证
     */
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
         
          _this.minZhi(); //调用 获取下拉框选中的名字 方法
          _this.axios
            .post("/api/Class/AddClass", {
              className: _this.ruleForm.name,
              classCourseId: _this.lovingVue.courseId,
              classTeacherId: _this.ruleForm.usName
            })
            .then(function(data) {
              //deta 接收的值为 1 时新增成功， -1 为异常，0 为没有改变
              var quanBu = data.data.data; //后台返回的数据赋值了一个变量
              if (data.data.code == 1) {
                quanBu.courseName =_this.lovingVue.courseName; //获取的课程名字
                quanBu.userName = _this.laoShi; //获取的老师名字
                _this.tableData.unshift(quanBu); // 把后台的数据从渲染的数组第一个位置插入
                 _this.$msg(_this, 1, "新增成功");//成功提示
              } else if (data.data.code == -1) {
                  _this.$msg(_this, -1, "系统异常"); //错误提示 
              } else if (data.data.code == 0) {
                _this.$msg(_this, 0, "数据没做修改"); //警告提示 
              }
            });
          _this.dialogFormVisible = false;
        } else {
          //输入框为空时执行
          return false;
        }
      });
    },
    /**
     * 分装的axios班级信息用来调用刷新
     */
    overall() {
      var _this = this;
      _this.axios.get("/api/Class/GetAllClass").then(function(data) {
       _this.tableData = data.data;
      });
    },
    /**
     *  获取授课老师信息
     */
    usTeacher() {
      var _this = this;
      _this.axios.get("/api/User/GetTeachers").then(function(data) {
        _this.teacher = data.data;
      });
    },
  },
  /**
   * 生命周期创建后
   */
  created() {
    var _this = this;
    _this.overall(); //调用封装渲染axios
    _this.usTeacher(); //授课老师信息
  
   
  }
};
</script>

<style lang="less" scoped>
//面包屑导航统一向下20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}

// 新增班级按钮
.newly {
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 17px;
  /deep/.el-button {
    font-weight: bold;
  }
}

// 弹出框 form 表单
/deep/.el-form-item {
  div {
    width: 300px;
    .el-input.el-input--suffix {
      width: 250px;
    }
  }
}
//弹出框宽度
/deep/.el-dialog {
  width: 448px;
  .el-dialog__footer {
    text-align: center;
  }
}
/deep/.cell {
  width:145px;
}
</style>
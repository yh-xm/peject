<template>
  <div id="ClassManage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <!-- 新增 -->
        <div class="newly"><el-button type="text" @click="dialogFormVisible = true"><i class="el-icon-circle-plus-outline
"></i> 新增班级</el-button></div>
        <!-- 班级表格 -->
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 70%"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="班级名称" prop="className"></el-table-column>
          <el-table-column label="授课老师" prop="userName"></el-table-column>
          <el-table-column label="专业" prop="courseName"></el-table-column>
          <el-table-column label="班级人数" prop="classStudents"></el-table-column>
          <el-table-column label="开班日期" prop="classCreateTime"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 弹出框 -->
        <!-- Form -->
      

        <el-dialog title="新增班级信息" :visible.sync="dialogFormVisible">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="班级名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="专业课程" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择">
                <el-option
                  v-for="(inte,index) in tableData"
                  :key="index"
                  :label="inte.courseName"
                  :value="inte.courseName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授课老师" prop="usName">
              <el-select v-model="ruleForm.usName" placeholder="请选择">
                <el-option
                  v-for="(inte,index) in tableData"
                  :key="index"
                  :label="inte.userName"
                  :value="inte.userName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="submitForm('ruleForm')">添加</el-button>
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
      tableData: [], //接收向后台请求的数据用于渲染
      search: "",

      dialogTableVisible: false,
      dialogFormVisible: false,

      ruleForm: {
        name: "",
        region: "",
        usName: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 1, trigger: "blur" }
        ],
        region: [
         { required:true, message: '请选择活动区域', trigger: 'change' }
        ],
        usName: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ]
      },
     
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
     submitForm(formName) {
         var _this=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
               console.log(_this.ruleForm.name)
                console.log(_this.ruleForm.region)
                 console.log(_this.ruleForm.usName)
        this.axios({
          method:"post",
          url:"/api/Class/AddClass",
          data:{
            className:"wer",
            classCourseId:"1",
            classTeacherId:"3"
          }
        }).then(function(data){
              console.log(data.dat)
        })


          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },




  },
  created() {
    var _this = this;
    this.axios.get("/api/Class/GetAllClass").then(function(data) {
      var stu = data.data;
      console.log(stu)
      for (const key in stu) {
        _this.tableData.push(stu[key]);
        // console.log(stu[key])
      }
    });
  }
};
</script>

<style lang="less" scoped>
.newly{
    width:70% ;
    margin: 0px auto;
    border-bottom: 1px solid #EBEEF5;
    text-align: left;
    font-size: 17px;
}
/deep/.el-table {
  margin: 0px auto;
}
/deep/.el-form-item {
  div {
    width: 300px;
    .el-input.el-input--suffix {
      width: 250px;
    }
  }
}
/deep/.el-dialog{
    width: 448px;
    .el-dialog__footer{
            text-align: center;
    }
}

</style>
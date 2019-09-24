<template>
  <div id="TeacherManage">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Breadcrumb 面包屑 结束 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 角色导航 -->
      <div slot="header" class="clearfix">
        <!-- 添加对话框 -->
        <!-- Form -->
        <el-button type="text" @click="canAdd()" class="el-icon-circle-plus-outline">新增用户</el-button>
        <el-dialog
          title="新增用户信息"
          :rules="rules"
          :visible.sync="dialogFormVisible"
          center="true"
          width="30%"
        >
          <!-- 嵌套的表单 -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="pass">
              <el-input v-model="ruleForm.pass"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
              <el-radio v-model="sex" label="1">男</el-radio>
              <el-radio v-model="sex" label="2">女</el-radio>
            </el-form-item>

            <el-form-item label="角色" prop="TypeName">
              <el-select v-model="ruleForm.TypeName" placeholder="请选择">
                <el-option label="管理员" value="Administrator"></el-option>
                <el-option label="老师" value="teacher"></el-option>
                <el-option label="业务" value="Professionalwork"></el-option>
                <el-option label="市场" value="market"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 嵌套的表单结束 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="addClose()">添 加</el-button>
          </div>
        </el-dialog>
        <!-- 添加对话框结束 -->

        <el-radio v-model="radio" label="1">全部</el-radio>
        <el-radio v-model="radio" label="2">管理员</el-radio>
        <el-radio v-model="radio" label="3">老师</el-radio>
        <el-radio v-model="radio" label="4">业务</el-radio>
        <el-radio v-model="radio" label="5">市场</el-radio>
      </div>
      <!-- 角色导航结束 -->
      <div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column label="用户名称" prop="userName"></el-table-column>
          <el-table-column label="手机号" prop="userMobile"></el-table-column>
          <el-table-column label="密码" prop="userPassword"></el-table-column>
          <el-table-column label="性别" prop="userSex"></el-table-column>

          <el-radio v-model="sex" label="1">男</el-radio>
          <el-radio v-model="sex" label="2">女</el-radio>
          <el-table-column label="角色名称" prop="userTypeTypeName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格结束 -->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  /**
   *  这里存储数据
   */
  data() {
    return {
      sex: "1", //性别单选
      radio: "1", //角色单选
      tableData: [], //表格渲染数据
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      ruleForm: {
        name: "",
        TypeName: []
      },
      rules: {
        name: [
          //姓名
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        mobile: [
          //手机号
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度在 11 个字符",
            trigger: "blur"
          }
        ],
        pass: [
          //密码
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur"
          }
        ],
        TypeName: [
          //角色
          { required: true, message: "请输入用户角色", trigger: "blur" }
        ]
      }
    };
  },
  //   这里定义方法
  methods: {
    /**
     * 渲染---获取用户信息
     */
    getUserInfo: function() {
      /**
       * 发送get请求*/
      let _this = this; //保存this
      this.axios.get("http://192.168.1.188:12/api/User/GetTeachers").then(
        function(res) {
          /**
           * tableData等于回调函数返回的res（值）
           */
          _this.tableData = res.data;
          console.log(_this.tableData);
        },
        function() {
          console.log("请求失败处理");
        }
      );
    },
    /**
     * 新增用户信息
     */
    canAdd() {
      this.dialogFormVisible = true;
    },
    // 编辑用户信息
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      console.log(index, row);
    },
    // 删除用户信息
    handleDelete(index, row) {
      console.log(index); //下标
      console.log(row); //当前行数据
      let _this = this;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.tableData.splice(index, 1);
      });

      // this.open();
    },

    cancel() {
      //取消
      this.dialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消"
      });
    },
    addClose() {
      //添加确认
      this.dialogFormVisible = false;
      this.$message({
        type: "success",
        message: "添加成功!"
      });
    },
    // 删除弹框
    open() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  //这里写钩子函数
  mounted() {
    /**
     * 调用---获取用户信息方法
     */
    this.getUserInfo();
  }
};
</script>


<style lang="less" scoped>
ul,
li {
  list-style: none;
}

#TeacherManage {
  .box-card {
    margin-top: 20px;
    /deep/.el-card__header {
      height: 65px;
      .clearfix {
        text-align: left;
        margin-left: 30px;
        .el-icon-circle-plus-outline {
          color: #409eff;
          margin-right: 30px;
          font-weight: bold;
          font-size: 14px;
        }
        /deep/.el-input--suffix {
          // width: 330px;
          width: 100%;
        }
      }
    }
  }
}
</style>
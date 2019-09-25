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
        <el-button type="text" @click="canAdd()" class="el-icon-circle-plus-outline">新增用户</el-button>
        <el-radio v-model="radio" label="1" @click.native="getAll()">全部</el-radio>
        <el-radio v-model="radio" label="2" @click.native="getAdmin()">管理员</el-radio>
        <el-radio v-model="radio" label="3" @click.native="getTeach()">老师</el-radio>
        <el-radio v-model="radio" label="4" @click.native="getBus()">业务</el-radio>
        <el-radio v-model="radio" label="5" @click.native="getMarket()">市场</el-radio>
      </div>
      <!-- 角色导航结束 -->
      <div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <!-- :index="indexMethod" -->
          <el-table-column label="用户名称" prop="userName"></el-table-column>
          <el-table-column label="手机号" prop="userMobile"></el-table-column>
          <el-table-column label="密码" prop="userPassword"></el-table-column>
          <el-table-column label="性别" prop="userSex"></el-table-column>
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
      <div>
        <!-- 添加对话框 -->
        <!-- Form -->
        <el-dialog
          :title="title"
          :rules="rules"
          :visible.sync="dialogFormVisible"
          center
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
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="userMobile">
              <el-input v-model="ruleForm.userMobile"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="ruleForm.userPassword"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="userSex">
              <el-radio-group v-model="ruleForm.userSex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色" prop="userUserTypeId">
              <!-- userUserTypeId -->
              <el-select v-model="ruleForm.userUserTypeId" placeholder="请选择">
                <el-option label="管理员" value="1"></el-option>
                <el-option label="老师" value="190"></el-option>
                <el-option label="业务" value="82"></el-option>
                <el-option label="市场" value="187"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 嵌套的表单结束 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="addClose()" v-show="addFlag">添 加</el-button>
            <el-button type="primary" @click="edit()" v-show="editFlag">修 改</el-button>
          </div>
        </el-dialog>
        <!-- 添加对话框结束 -->
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
      radio: "1", //角色单选
      tableData: [], //表格渲染数据
      dialogTableVisible: false,
      dialogFormVisible: false, //对话框
      ruleForm: {
        uid: "", //id
        userName: "", //用户名称
        userMobile: "", //手机号
        userPassword: "", //密码
        userSex: "男", //性别
        userUserTypeId: "" //角色id
      },
      rules: {
        userName: [
          //姓名
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        userMobile: [
          //手机号
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度在 11 个字符",
            trigger: "blur"
          }
        ],
        userPassword: [
          //密码
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur"
          }
        ],
        TypeId: [
          //角色
          { required: true, message: "请选择用户角色", trigger: "blur" }
        ]
      },
      title: "", //对话框标题
      addFlag: false, //添加弹框确认按钮
      editFlag: false //修改弹框确认按钮
    };
  },
  //   这里定义方法
  methods: {
    //根据角色过滤显示
    getAll(){
      //全部
      console.log("all")
    },
    getAdmin() {
      // 管理员
      let _this = this;
      var filterArray = _this.tableData.filter(function(item,index,array){
        return item.userTypeTypeName == "管理员";
      })
      console.log(filterArray);//[]
      _this.tableData = filterArray;

      





    },
    getTeach(){//老师

      console.log("laoshi")
    },
     getBus(){//业务

      console.log("yw")
    },
    getMarket(){//市场
      console.log("shichang");

    },
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
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    // 删除用户信息
    handleDelete(index, row) {
      let uid = (index, row.userUid);
      let _this = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          _this.axios
            .post("http://192.168.1.188:12/api/User/RemoveTeacher?uid=" + uid)
            .then(
              function(res) {
                if (res.status === 200) {
                  _this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  _this.tableData.splice(index, 1);
                  // this.reload();
                }
              },
              function() {
                console.log("删除请求失败处理");
                _this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            );
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancel() {
      //取消
      this.dialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消"
      });
    },
    /**
     * 新增用户信息
     */
    canAdd() {
      this.dialogFormVisible = true;
      this.title = "新增用户信息";
      this.addFlag = true;
      this.editFlag = false;
      // 清空赋值
      this.ruleForm = {};
      this.ruleForm.userSex = "男";
    },
    /**
     * 新增用户信息
     */
    addClose() {
      //添加确认
      var _this = this;
      this.axios({
        method: "post",
        url: "http://192.168.1.188:12/api/User/AddTeacher",
        data: {
          userName: _this.ruleForm.userName, //用户名，不能为空
          userMobile: _this.ruleForm.userMobile, //手机号，长度11位
          userSex: _this.ruleForm.userSex, //性别，男|女
          userPassword: _this.ruleForm.userPassword, //密码，长度6~18
          userUserTypeId: _this.ruleForm.userUserTypeId //用户角色编号
        }
      }).then(
        function(res) {
          console.log("新增请求成功处理");
          var code = res.data.code;
          if (code == "1") {
            _this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
        },
        function() {
          console.log(添加请求失败处理);
          this.$message({
            type: "error",
            message: "添加失败"
          });
        }
      );
      _this.reload();
      this.dialogFormVisible = false;
    },
    // 编辑用户信息
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.title = "编辑用户信息";
      this.editFlag = true;
      this.addFlag = false;
      // 修改赋值
      this.ruleForm = Object.assign({}, row);
      // console.log(row);
    },
    /**
     * 编辑用户信息
     */
    edit() {
      let _this = this;
      this.axios({
        method: "post",
        url: "http://192.168.1.188:12/api/User/ModifyTeacher",
        data: {
          userUid: _this.ruleForm.userUid, //要修改的用户标识符
          userName: _this.ruleForm.userName, //用户名，不能为空
          userMobile: _this.ruleForm.userMobile, //手机号，长度11位
          userSex: _this.ruleForm.userSex, //性别，男|女
          userPassword: _this.ruleForm.userPassword, //密码，长度6~18
          userUserTypeId: _this.ruleForm.userUserTypeId //角色id
        }
      }).then(
        function(res) {
          console.log(res);
          _this.$message({
            type: "success",
            message: "修改成功!"
          });
        },
        function() {
          console.log("修改请求失败处理");
        }
      );
      _this.dialogFormVisible = false;
      _this.reload();
    },

    reload() {
      //伪刷新
      var _this = this;
      _this.$router.push("/");
      setTimeout(() => {
        _this.$router.push("/TeacherManage");
      }, 100);
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
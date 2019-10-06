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
      <div slot="header" class="clearfix">
        <!-- 新增用户按钮 -->
            <el-button type="text" @click="handleAdd()" class="el-icon-circle-plus-outline">新增用户</el-button>
            <!-- 新增用户按钮 -->
            <!-- 角色导航 -->
            <el-radio v-model="filtRadio" label="0">全部</el-radio>
            <el-radio
              v-for="item in roles"
              :key="item.userTypeTypeName"
              v-model="filtRadio"
              :label="item.userTypeTypeName"
            >{{item.userTypeTypeName}}</el-radio>
            <!-- 角色导航结束 -->
      </div>
      <div>
        <!-- 表格 -->
        <el-table :data="filtData" style="width: 100%">
          <el-table-column type="index"></el-table-column>
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
            <el-form-item label="角色" prop="userTypeTypeName">
              <el-select v-model="ruleForm.userTypeTypeName" placeholder="请选择">
                <el-option
                  v-for="item in roles"
                  :key="item.userTypeId"
                  :label="item.userTypeTypeName"
                  :value="item.userTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 嵌套的表单结束 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="addClose('ruleForm')" v-show="flag ==! true ">添 加</el-button>
            <el-button type="primary" @click="editColse('ruleForm')" v-show="flag == true">修 改</el-button>
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
   *  data里面存储数据
   */
  data() {
    //用户密码正则
    let validcodePass = (rule, value, callback) => {
      let reg = /^([0-9]|[a-zA-Z]){6,18}$/;
      if (!reg.test(value)) {
        callback(new Error("账号必须是由6-18位数字或字母"));
      } else {
        callback();
      }
    };
    // 用户手机号正则
    let validMobile = (rule, value, callback) => {
      if (value.trim() == "") {
        callback();
      } else {
        let reg = /1[0-9]{10}/;
        if (!reg.test(value)) {
          callback(new Error("手机号错误"));
        } else {
          callback();
        }
      }
    };
    return {
      filtRadio: "0", //初始化过滤角色导航按钮选中
      filtLabel: "", //初始化过滤角色导航label值
      filtName: "", //初始化过滤角色导航名
      tableData: [], //初始化获取的所有用户信息
      roles: [], //初始化获取的所有的角色
      title: "", //对话框标题
      flag: false, //对话框确认按钮隐藏显示
      dialogFormVisible: false, //对话框隐藏显示
      // 获取表单信息
      ruleForm: {
        // userUid: "", //id
        userName: "", //用户名称
        userMobile: "", //手机号
        userPassword: "", //密码
        userSex: "", //性别
        userTypeTypeName: "", //角色称号
        userUserTypeId: "" //角色ID
      },
      //表单失焦验证
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
            validator: validMobile,
            trigger: "blur"
          }
        ],
        userPassword: [
          //密码
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: validcodePass,
            trigger: "blur"
          }
        ],
        userTypeTypeName: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      }
    };
  },
  /**
   * 这里面定义方法
   * */
  methods: {
    /**
     *  获取所有角色--- 可调用
     * @method getRole
     * */
    getRole() {
      let _this = this; //保存this对象
      _this.axios.get("/api/UserType/GetUserRoles").then(
        function(res) {
          //roles等于回调函数返回的res（值）
          // console.log(res);
          _this.roles = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    /**
     * 渲染---获取用户信息 可调用
     * @method getUserInfo
     *
     */
    getUserInfo() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/User/GetTeachers").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          // console.log(res);
          _this.tableData = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },

    /**
     * 删除所在行的数
     * @method handleDelete
     * @param   {Integer} index 点击行数据所在下标
     * @param {Array} row  点击行数据所在行数据
     *
     * */
    handleDelete(index, row) {
      // console.log(index, row);
      let _this = this;
      let uid = (index, row.userUid);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          _this.axios.post("api/User/RemoveTeacher?uid=" + uid).then(
            function(res) {
              if (res.status === 200) {
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.tableData.splice(index, 1);
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

    /**
     * 触发添加用户信息
     * @method handleAdd
     *
     * */
    handleAdd() {
      let _this = this;
      _this.dialogFormVisible = true; //打开对话框
      _this.title = "添加用户信息"; //改变对话框标题
      _this.flag = !true; //显示添加按钮
      // 清空表单的赋值
      _this.ruleForm.userTypeTypeName = "";
      _this.ruleForm.userPassword = "";
      _this.ruleForm.userName = "";
      _this.ruleForm.userMobile = "";
      _this.ruleForm.userUid = "";
      _this.ruleForm.userSex = "男";
      _this.ruleForm.userUserTypeId = "";
    },
    /**
     * 确认添加用户信息
     * @method addClose
     * @param  {string} formName 传过来的数据
     *
     * */
    addClose(formName) {
      let _this = this;
      // console.log(_this.ruleForm.userName);

      var obj = {
        userName: _this.ruleForm.userName, //用户名，不能为空
        userMobile: _this.ruleForm.userMobile, //手机号，长度11位
        userSex: _this.ruleForm.userSex, //性别，男|女
        userPassword: _this.ruleForm.userPassword, //密码，长度6~18
        userUserTypeId: _this.ruleForm.userTypeTypeName //用户角色编号
      };
      //调用添加接口
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios.post("api/User/AddTeacher", obj).then(function(res) {
            console.log(res);
            if (res.data.code == 1) {
              _this.$message({
                type: "success",
                message: "添加成功!"
              });
            } else if (res.data.code == 0) {
              _this.$message({
                type: "info",
                message: "内容没有变化"
              });
            } else {
              _this.$message({
                type: "error",
                message: "添加失败！"
              });
            }
            _this.dialogFormVisible = false; //关闭对话框
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     *@method Object.assign()
     * Object.assign方法实行的是浅拷贝，
     * 而不是深拷贝。也就是说，
     * 如果源对象某个属性的值是对象，
     * 那么目标对象拷贝得到的是这个对象的引用。
     * 方法用于对象的合并，将源对象（source）的所有可枚举属性，
     * 复制到目标对象（target）。
     * */
    /**
     * 触发修改弹框
     * @param {number} index 点击行数据所在下标
     * @param {object} row 点击行数据所在行数据
     */

    handleEdit(index, row) {
      // console.log(row);
      let _this = this;
      _this.dialogFormVisible = true; //打开对话框
      _this.title = "编辑用户信息"; //改变对话框标题
      _this.flag = true; //显示编辑按钮
      _this.ruleForm = Object.assign({}, row); //将当前行的数据赋值给表单
      _this.ruleForm.userTypeTypeName = _this.ruleForm.userUserTypeId;
    },
    /**
     * 确认修改用户信息
     * @param {string} formName 传过来的内容
     * */
    editColse(formName) {
      let _this = this;
      // console.log(_this.ruleForm.userTypeTypeName);
      // console.log(_this.ruleForm.userUserTypeId);
      _this.$refs[formName].validate(valid => {
        if (valid) {
          //调用添加接口
          _this.axios
            .post("/api/User/ModifyTeacher", {
              userUid: _this.ruleForm.userUid, //要修改的用户标识符
              userName: _this.ruleForm.userName, //用户名，不能为空
              userMobile: _this.ruleForm.userMobile, //手机号
              userSex: _this.ruleForm.userSex, //性别
              userPassword: _this.ruleForm.userPassword, //密码
              userUserTypeId: _this.ruleForm.userTypeTypeName //角色id
            })
            .then(function(res) {
              if (res.data.code == 1) {
                _this.$message({
                  type: "success",
                  message: "修改成功!"
                });
              } else if (res.data.code == 0) {
                _this.$message({
                  type: "info",
                  message: "内容没有变化"
                });
              } else {
                _this.$message({
                  type: "error",
                  message: "修改失败！"
                });
              }
              _this.dialogFormVisible = false; //关闭对话框
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * 取消/关闭对话框
     * @method cancel
     *  @param {string} formName 传过来的内容
     *
     * */
    cancel(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
      _this.$message({
        type: "info",
        message: "已取消"
      });
      _this.dialogFormVisible = false; //关闭对话框
    }
  },

    //定义计算属性
  computed: {
    /**
     * 导航角色过滤
     * @method filtData
     * 思路  根据你当前 点 击 的值来进行判断 根据从后台拿到的相关数据来过滤掉不与你当前点击的值不一致的数据；
     * 同时，根据过滤之后表格需要显示与之对应的内容；
     *
     * 步骤
     * 使用filtRadio按钮属性判断你点击的是谁，
     * 然后用tabaData（就是从后台拿到的数据）用es6的filter()方法进行过滤判断；
     * 然后返回出去（就是return）;
     * 这是计算属性
     * 所以直接把这个方法名(也就是filtData)像data值一样绑定到显示结果的表格中;
     * */
    filtData() {
      let _this = this;
      if (_this.filtRadio == "0") {
        return _this.tableData;
      } else {
        return _this.tableData.filter(
          item => item.userTypeTypeName == _this.filtRadio
        );
      }
    }
  },
  /**
   * 生命周期
   * 定义钩子函数
   * */
  mounted() {
    let _this = this; //保存this对象
    _this.getUserInfo(); //用户信息
    _this.getRole(); //用户角色
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
        overflow: hidden;

        .el-radio{
          flex: none;
        }
        
        .el-icon-circle-plus-outline {
          color: #409eff;
          margin-right: 30px;
          font-weight: bold;
          font-size: 14px;
        }
        /deep/.el-input--suffix {
          width: 100%;
        }
      }
    }
  }
}
</style>
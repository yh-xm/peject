<!--用户管理-->
<template>
  <div id="TeacherManage">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.r3')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Breadcrumb 面包屑 结束 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 新增用户按钮 -->
        <el-button
          type="text"
          @click="handleAdd()"
          class="el-icon-circle-plus-outline"
        >{{$t("tableName.addnewusers")}}</el-button>
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
          <el-table-column :label="$t('tableName.user')" prop="userName"></el-table-column>
          <el-table-column :label="$t('tableName.phone')" prop="userMobile"></el-table-column>
          <el-table-column :label="$t('tableName.psw')" prop="userPassword"></el-table-column>
          <el-table-column :label="$t('tableName.sex')" prop="userSex"></el-table-column>
          <el-table-column :label="$t('tableName.tjs')" prop="userTypeTypeName"></el-table-column>
          <el-table-column :label="$t('tableName.tm')">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.c')}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                v-has
              >{{$t('btn.d')}}</el-button>
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
            <el-form-item :label="$t('tableName.user')" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>

            <el-form-item :label="$t('tableName.phone')" prop="userMobile">
              <el-input v-model="ruleForm.userMobile"></el-input>
            </el-form-item>

            <el-form-item :label="$t('tableName.psw')" prop="userPassword">
              <el-input v-model="ruleForm.userPassword"></el-input>
            </el-form-item>

            <el-form-item :label="$t('tableName.sex')" prop="userSex">
              <el-radio-group v-model="ruleForm.userSex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('tableName.tjs')" prop="userTypeTypeName">
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
            <el-button @click="cancel('ruleForm')">{{$t('btn.res')}}</el-button>
            <el-button
              type="primary"
              @click="addClose('ruleForm')"
              v-show="flag ==! true "
            >{{$t('btn.a')}}</el-button>
            <el-button
              type="primary"
              @click="editColse('ruleForm')"
              v-show="flag == true"
            >{{$t('btn.modification')}}</el-button>
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
      dialogFormVisible: false, //对话框隐
      oindex: "",
      // 获取表单信息
      ruleForm: {
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
      const _this = this; //保存this对象
      _this.$get("/api/UserType/GetUserRoles").then(
        function(res) {
          //roles等于回调函数返回的res（值）
          // console.log(res);
          _this.roles = res;
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
      const _this = this; //保存this对象
      _this.$get("/api/User/GetTeachers").then(function(res) {
        //tableData等于回调函数返回的res（值）
        _this.tableData = res;
      });
    },
    /**
     * 渲染---获下拉框角色名称 可
     * @method typName
     * @param v 下拉框的id
     */

    /**
     * 删除所在行的数
     * @method handleDelete
     * @param   {Integer} index 点击行数据所在下标
     * @param {Array} row  点击行数据所在行数据
     *
     * */
    handleDelete(index, row) {
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
      const _this = this;
      let uid = (index, row.userUid);

      this.$confirm(title, flag, {
        confirmButtonText: contentText,
        cancelButtonText: contentText2,
        type: "warning",
        center: true
      })
        .then(() => {
          _this.$post("api/User/RemoveTeacher?uid=" + uid).then(
            function(res) {
              console.log(res);
              if (res.code == 1) {
                _this.$msg(_this, 1, _this.$t("mesTips.deleteSuccess"));
                _this.tableData.splice(index, 1);
              }else if(res.code == -2){
              _this.$msg(_this, 0, _this.$t("mesTips.parameter"));

              }
            }
          );
        }).catch(() => {
          _this.$msg(_this, -1, _this.$t("mesTips.systemError"));
        })
    },

    /**
     * 触发添加用户信息
     * @method handleAdd
     *
     * */
    handleAdd() {
      const _this = this;

      var lang = localStorage.locale;
      if (lang == "en") {
        var contentText = "Add User Information";
      } else {
        var contentText = "添加用户信息";
      }
      _this.dialogFormVisible = true; //打开对话框
      _this.title = contentText; //改变对话框标题
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
      const _this = this;
      // console.log(typName);
      var obj = {
        userName: _this.ruleForm.userName, //用户名，不能为空
        userMobile: _this.ruleForm.userMobile, //手机号，长度11位
        userSex: _this.ruleForm.userSex, //性别，男|女
        userPassword: _this.ruleForm.userPassword, //密码，长度6~18
        userUserTypeId: _this.ruleForm.userTypeTypeName //用户角色编号
      };
      var typNames = _this.roles.find(
        res => res.userTypeId == _this.ruleForm.userTypeTypeName
      );
      var typName = typNames.userTypeTypeName;
      console.log(obj);
      //调用添加接口
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.$post("api/User/AddTeacher", obj).then(function(res) {
            if (res.code == 1) {
              let typeName = res.data;
              typeName.userTypeTypeName = typName;
              _this.tableData.unshift(typeName);
              _this.$msg(_this, 1, "添加成功!");
            } else if (res.code == 0) {
              _this.$msg(_this, 0,_this.$t("mesTips.dataChange"));
            } else {
              _this.$msg(_this, -1, _this.$t("mesTips.failure"));
            }
            _this.dialogFormVisible = false; //关闭对话框
          });
        } else {
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
      const _this = this;
      _this.oindex = index;
      var lang = localStorage.locale;
      if (lang == "en") {
        var contentText = "Edit User Information";
      } else {
        var contentText = "编辑用户信息";
      }
      _this.dialogFormVisible = true; //打开对话框
      _this.title = contentText; //改变对话框标题
      _this.flag = true; //显示编辑按钮
      _this.ruleForm = Object.assign({}, row); //将当前行的数据赋值给表单
      _this.ruleForm.userTypeTypeName = _this.ruleForm.userUserTypeId;
    },
    /**
     * 确认修改用户信息
     * @param {string} formName 传过来的内容
     * */
    editColse(formName) {
      const _this = this;

      const xmlObj = {
        userUid: _this.ruleForm.userUid, //要修改的用户标识符
        userName: _this.ruleForm.userName, //用户名，不能为空
        userMobile: _this.ruleForm.userMobile, //手机号
        userSex: _this.ruleForm.userSex, //性别
        userPassword: _this.ruleForm.userPassword, //密码
        userUserTypeId: _this.ruleForm.userTypeTypeName //角色id
      };

      _this.$refs[formName].validate(valid => {
        if (valid) {
          //调用添加接口
          _this.$post("/api/User/ModifyTeacher", xmlObj).then(function(res) {
            if (res.code == 1) {
              var typNames = _this.roles.find(
                res => res.userTypeId == _this.ruleForm.userTypeTypeName
              );
              var typName = typNames.userTypeTypeName;
              var rows = _this.tableData[_this.oindex];
              rows.userTypeTypeName = typName;
              rows.userName = _this.ruleForm.userName;
              rows.userMobile = _this.ruleForm.userMobile;
              rows.userSex = _this.ruleForm.userSex;
              rows.userPassword = _this.ruleForm.userPassword;
              rows.userUserTypeId = _this.ruleForm.userTypeTypeName;

              _this.$msg(_this, 1, "修改成功");
            } else if (res.code == 0) {
              _this.$msg(_this, 0, "内容没有变化");
            } else {
              _this.$msg(_this, -1, "修改失败！");
            }
            _this.dialogFormVisible = false; //关闭对话框
          });
        } else {
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
      const _this = this;
      _this.$refs[formName].resetFields();
      
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
      const _this = this;
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
    const _this = this; //保存this对象
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
      .clearfix {
        text-align: left;
        margin-left: 30px;
        overflow: hidden;
        margin-top: 20px;

        .el-radio {
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
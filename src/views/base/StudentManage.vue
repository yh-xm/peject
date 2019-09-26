<template>
  <div id="StudentManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/StudentManage' }">学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="StudentManage">
      <div class="StudentSelect">
        <el-select v-model="classId" @change="getClassName(classId)" placeholder="请选择班级">
          <el-option
            v-for="item in options"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
        <el-button
          type="text"
          @click="addEquipment"
          class="el-icon-circle-plus-outline addStudent"
        >新增学生</el-button>
        <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="form" :rules="addRules" ref="form">
            <el-form-item label="班级" :label-width="formLabelWidth" prop="classId2">
              <el-select v-model="classId2" placeholder="请选择" @change="resClassName(classId2)">
                <el-option
                  v-for="item in options"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学生名称" :label-width="formLabelWidth" prop="stuName">
              <el-input v-model="form.stuName" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item label="生日" :label-width="formLabelWidth" prop="born">
              <div class="block" style="width:160px">
                <span class="demonstration"></span>
                <el-date-picker v-model="form.born" type="date" placeholder="选择日期"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="form.phone" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item label="*性别" :label-width="formLabelWidth" prop="radio">
              <template>
                <el-radio v-model="form.radio" label="男">男</el-radio>
                <el-radio v-model="form.radio" label="女">女</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStuName('form')" v-if="showBoth == true">添加</el-button>
            <el-button type="primary" @click="upDate('form',index)" v-if="showBoth == false">修改</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级名称" width="130">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" width="130">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuSex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuMobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" width="200" style="text-align:center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuBirthDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" width="80" style="padding-left: 60px;">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuAge }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { METHODS } from "http";
export default {
  data() {
    var validateClassName = (rule, value, callback) => {
      setTimeout(() => {
        if (value=="") {
          callback(new Error("班级名不能为空"));
        } else {
          callback();
        }
      }, 100);
    };

    var name = /^[\u4e00-\u9fa5a-zA-Z]+$/;
    var validateName = (rule, value, callback) => {
      setTimeout(() => {
        if (!name.test(value)) {
          callback(new Error("名字必须必须为中文或英文"));
        } else {
          callback();
        }
      }, 100);
    };

    var validateBorn = (rule, value, callback) => {
      setTimeout(() => {
        if (value=="" ||value==null) {
          callback(new Error("生日不能为空"));
        } else {
          callback();
        }
      }, 100);
    };

    var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var validatePhone = (rule, value, callback) => {
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error("手机格式有误"));
        } else {
          callback();
        }
      }, 100);
    };


    var passWord = /^[a-zA-Z0-9]{3,9}$/;
    var validatepassWord = (rule, value, callback) => {
      setTimeout(() => {
        if (!passWord.test(value)) {
          callback(new Error("密码为3-9位字符"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      showBoth: true, //判断新增还是修改
      dialogStatus: "", //判断标题
      index: "", //表格行的下标
      titleMap: {
        addEquipment: "新增学生",
        editEquipment: "修改学生"
      },
      dialogFormVisible: false, //判断是否取消
      centerDialogVisible: false, //判断标题
      options: [], //班级选择
      classId: "", //默认班级编号
      tableData: [], //表单数据
      classId2: "",
      form: {
        //新增
        stuUid: "", //学生遍号
        class: "", //班级编号
        stuName: "", //学生姓名
        stuClassId: "",
        born: "", //生日
        phone: "",
        radio: "男", //男女默认值
        password: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      addRules: {
        // 校验手机号码，主要通过validator来指定验证器名称
        classId2: [{ required: true, validator: validateClassName, trigger: "blur" }],
        stuName: [{ required: true, validator: validateName, trigger: "blur" }],
        born: [{ required: true, validator: validateBorn, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        password: [{ required: true, validator: validatepassWord, trigger: "blur" }]
      },
      formLabelWidth: "140px"
    };
  },
  methods: {
    addEquipment() {//新增学生
      var _this = this;
      _this.showBoth = true;//显示新增按钮
      _this.dialogFormVisible = true; //显示弹框
      _this.dialogStatus = "addEquipment"; //新增弹框标题
      _this.form.stuName = "";//清空模态弹框的值
      _this.form.class = "";
      _this.form.born = "";
      _this.form.phone = "";
      _this.form.password = "";
      _this.form.radio = "";
    },
    /**
     * @{argument} addStuName新增
     * @param {String} ruleForm表单验证
     */
    addStuName(ruleForm) {
      //新增
      var _this = this;
      _this.$refs[ruleForm].validate(valid => {
        if (valid) {
          _this.dialogFormVisible = false;
          let params = {
            //发送请求
            stuName: _this.form.stuName, //学生姓名
            stuClassId: _this.classId2, //班级编号
            stuBirthDay: new Date(_this.form.born), //生日
            stuMobile: _this.form.phone, //手机号
            stuPassword: _this.form.password, //登录密码,
            stuSex: _this.form.radio, //性别
            className: _this.form.class,
            stuAge: 18
          };
          _this.axios.post("/api/Student/AddStudent", params).then(response => {
            // console.log(_this.tableData)
            //  console.log(_this.options)
            //  console.log(params)
            if (response.data.code == 1) {
              _this.tableData.push(params);
              _this.getClassName(_this.classId2); //跳转到所选班级，方便查看
              _this.$message({
                type: "success",
                message: "新增成功！"
              });
            } else {
              _this.$message({
                type: "warning",
                message: "新增失败！"
              });
            }
          });
        }
      });
    },
    resClassName() {
      //获取所有班级名字
      var _this = this;
      _this.axios.get("api/Class/GetAllClass").then(r => {
        _this.options = r.data;
      });
    },
    /**
     * @{argument} handleEdit()编辑学生信息
     * @param {Num} index 点击行下表
     * @param {String} row 点击行对应的数据
     */
    handleEdit(index, row) {
      var _this = this;
      _this.showBoth = false;//隐藏模态框
      _this.index = index;//传过来的值赋值重新赋值
      _this.show2 = true; //显示修改按钮
      _this.show1 = false; //隐藏新增按钮
      _this.dialogFormVisible = true; //显示弹框
      _this.dialogStatus = "editEquipment"; //编辑弹框标题
      _this.form.stuUid = row.stuUid; //学生ID赋值给输入框
      _this.form.stuName = row.stuName; //学生名字赋值给输入框
      _this.form.class = row.className; //班级名字赋值给输入框
      _this.form.born = row.stuBirthDay; // 生日赋值给输入框
      _this.form.phone = row.stuMobile; //电话赋值给输入框
      _this.form.password = row.stuPassword; //密码赋值给输入框
      _this.form.radio = row.stuSex; //性别赋值给输入框
      _this.form.classId = row.classId; //班级编号赋值给输入框
    },
    /**
     * @{argument} upDate()点击修改
     * @param {Num} index 点击行下表
     * @param {String} ruleForm 表单验证
     */
    upDate(ruleForm, index) {
      var _this = this;
      _this.$refs[ruleForm].validate(valid => {
        if (valid) {
          _this.dialogFormVisible = false;
          _this.axios
            .post("/api/Student/ModifyStudent", {
              stuUid: _this.form.stuUid, // 要修改学生的唯一标识符
              stuName: _this.form.stuName, //学生姓名
              stuBirthDay: new Date(_this.form.born), //生日
              stuClassId: _this.classId2, //班级编号
              stuMobile: _this.form.phone, //手机号
              stuPassword: _this.form.password, //登录密码,
              stuSex: _this.form.radio //性别
            })
            .then(response => {
              if (response.data.code == 1) {
                // console.log(_this.tableData[index])
                _this.getClassName(_this.classId2); //修改成功后跳转到所选班级，方便查看
                _this.$message({
                  type: "success",
                  message: "修改成功！"
                });
              } else {
                _this.$message({
                  type: "warning",
                  message: "修改失败！"
                });
              }
            });
        }
      });
    },
    /**
     * @{argument} handleEdit编辑
     * @param {Num} index1 点击行下表
     * @param {String} row1 点击行对应的数据
     */
    handleDelete(index1, row1) {
      //删除学生
      var _this = this;
      // console.log(row1);
      _this.axios
        .get(`/api/Student/RemoveStudent?uid=${row1.stuUid}`)
        .then(res => {
          _this
            .$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
            .then(() => {
              _this.tableData.splice(index1, 1);
              _this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        });
    },
    /**
     * @{argument} getClassName改变监听班级编号事件
     * @param {Num} res 班级编号
     */
    getClassName(res) {
      //获取班级学生
      var _this = this;
      // console.log(res)//班级编号
      _this.axios.get(`/api/Student/GetClassStudent?classId=${res}`).then(r => {
        _this.tableData = r.data;
        _this.classId = r.data[0].classId; //报错是因为没有数据
        _this.classId2 = r.data[0].classId;
        _this.public();
        // _this.form.class=r.data[0].className
        //  console.log(r.data)//班级所有学生
      });
    },
    public() {
      //获取所有班级
      var _this = this;
      _this.axios.get("api/Class/GetAllClass").then(r => {
      _this.options = r.data;
      });
    }
  },
  created: function() {
    this.public(); //调用班级数据
  }
};
</script>
<style lang="less" scoped>
#StudentManage {
  width: 100%;
  height: 100%;
  .StudentManage {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    margin-top: 30px;
    .StudentSelect {
      width: 100%;
      height: 70px;
      border-bottom: 1px solid #ccc;
      line-height: 70px;
      padding-left: 3%;
      .addStudent {
        color: rgb(36, 156, 211);
        margin-left: 1%;
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
  /deep/.el-dialog__header {
    text-align: center;
  }
  /deep/.el-dialog__body {
    margin-top: -30px;
  }
}
/deep/.el-input {
  width: 100%;
}
/deep/.el-form-item__content{
  width: 45%;
}
/deep/.el-table_1_column_5,
/deep/.el-table_1_column_1,
/deep/.el-table_1_column_6,
/deep/.el-table_1_column_8 {
  text-align: center;
}
</style>
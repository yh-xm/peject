<template>
  <div id="StudentManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('base.r2')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="StudentManage">
      
      <div class="StudentSelect">
<classNameSelect v-model="classes" ref="classNameSelect" @change="classInfo(classes)" style="width:12%;min-width:130px; display:inline-block"></classNameSelect>
        <el-button
          type="text"
          @click="addEquipment"
          class="el-icon-circle-plus-outline addStudent"
        >{{$t("tableName.students")}}</el-button>
        <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="form" :rules="addRules" ref="form" style="width:100%">
            <el-form-item :label="$t('tableName.tcn')" :label-width="formLabelWidth" >
              <classNameSelect v-model="classes2" style="display:inline"></classNameSelect>
            </el-form-item>
            <el-form-item :label="$t('tableName.name')" :label-width="formLabelWidth" prop="stuName">
              <el-input v-model.trim="form.stuName" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tableName.birth')" :label-width="formLabelWidth" prop="born">
              <div class="block" style="width:100%">
                <span class="demonstration"></span>
                <el-date-picker v-model="form.born" type="date" placeholder="选择日期" style="width:100%"></el-date-picker>
              </div>
            </el-form-item> 
            <el-form-item :label="$t('tableName.phone')" :label-width="formLabelWidth" prop="phone">
              <el-input v-model.trim="form.phone" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tableName.sex')" :label-width="formLabelWidth" prop="radio">
              <template>
                <el-radio v-model="form.radio" label="男">男</el-radio>
                <el-radio v-model="form.radio" label="女">女</el-radio>
              </template>
            </el-form-item>
            <el-form-item :label="$t('tableName.psw')" :label-width="formLabelWidth" prop="password">
              <el-input v-model.trim="form.password" autocomplete="true" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{$t('btn.res')}}</el-button>
            <el-button type="primary" @click="addStuName('form')" v-if="showBoth == true">{{$t('btn.a')}}</el-button>
            <el-button type="primary" @click="upDate('form',index)" v-if="showBoth == false">{{$t('btn.c')}}</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tcn')" width="110">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.name')" width="110">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.sex')" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuSex }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.phone')" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuMobile }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.birth')" width="210" style="text-align:center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuBirthDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" width="100" style="padding-left: 60px;">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stuAge }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tm')" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('btn.c')}}</el-button>
              <el-button size="mini" type="danger" v-has @click="handleDelete(scope.$index,scope.row)">{{$t('btn.d')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import classNameSelect from "@/components/classNameSelect"
export default {
  components:{
      classNameSelect
  },
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


    var passWord = /^[a-zA-Z0-9]{6,18}$/;
    var validatepassWord = (rule, value, callback) => {
      setTimeout(() => {
        if (!passWord.test(value)) {
          callback(new Error("密码为6-18位字符"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      classes2:{},
      classes:'',
      showBoth: true, //判断新增还是修改
      dialogStatus: "", //判断标题
      index: "", //表格行的下标
      titleMap: {
        addEquipment: "",
        editEquipment: ""
      },
      dialogFormVisible: false, //判断是否取消
      centerDialogVisible: false, //判断标题
      options: [], //班级选择
      tableData: [], //表单数据
      form: {
        //新增
        stuUid: "", //学生遍号
        class: "", //班级编号
        stuName: "", //学生姓名
        stuClassId: "",
        born: new Date(), //生日
        phone: "",
        radio: "男", //男女默认值
        password: "",
      },
      addRules: {
        // 校验班级名，主要通过validator来指定验证器名称
        classes: [{ required: true, validator: validateClassName, trigger: "blur" }],
        // 校验学生名，主要通过validator来指定验证器名称
        stuName: [{ required: true, validator: validateName, trigger: "blur" }],
        // 校验生日，主要通过validator来指定验证器名称
        born: [{ required: true, validator: validateBorn, trigger: "blur" }],
        // 校验手机号码，主要通过validator来指定验证器名称
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        // 校验手机密码，主要通过validator来指定验证器名称
        password: [{ required: true, validator: validatepassWord, trigger: "blur" }]
      },
      formLabelWidth: "140px"
    };
  },
  methods: {
    addEquipment() {//新增学生
      var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "The New Students";
      }else{
         var fText = "新增学生";
      }
      var _this = this;
      _this.titleMap.addEquipment=fText //新增弹框标题
      _this.showBoth = true;//显示新增按钮
      _this.dialogFormVisible = true; //显示弹框 
      _this.form.stuName = "";//清空模态弹框的值
      _this.classes2 = 0
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
            stuClassId: _this.classes.classId, //班级编号
            stuBirthDay: new Date(_this.form.born), //生日
            stuMobile: _this.form.phone, //手机号
            stuPassword: _this.form.password, //登录密码,
            stuSex: _this.form.radio, //性别
            className: _this.classes.className,
          };
         
          _this.$post("/api/Student/AddStudent", params).then(response => {
            // console.log(_this.tableData)
            //  console.log(_this.options)
             console.log(response)
            if (response.code == 1) {
               _this.$msg(_this,1,'新增成功！') //成功提示
              _this.tableData.push(params);
              _this.classInfo(_this.classes2); //跳转到所选班级，方便查看
            } else {
              _this.$msg(_this,-1,'新增失败！') //错误提示
            }
          });
        }
      });
    },
    /**
     * @{argument} handleEdit()编辑学生信息
     * @param {Num} index 点击行下表
     * @param {String} row 点击行对应的数据
     */
    handleEdit(index, row) {
      var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "Modify The Students";
      }else{
         var fText = "修改学生";
      }
      var _this = this;
       _this.titleMap.editEquipment=fText //编辑弹框标题
       _this.classes2 = row;
      _this.showBoth = false;//隐藏模态框
      _this.index = index;//传过来的值赋值重新赋值
      _this.show2 = true; //显示修改按钮
      _this.show1 = false; //隐藏新增按钮
      _this.dialogFormVisible = true; //显示弹框
      _this.form.stuUid = row.stuUid; //学生ID赋值给输入框
      _this.form.stuName = row.stuName; //学生名字赋值给输入框
      _this.form.class = row.className; //班级名字赋值给输入框
      _this.form.born = row.stuBirthDay; // 生日赋值给输入框
      _this.form.phone = row.stuMobile; //电话赋值给输入框
      _this.form.password = row.stuPassword; //密码赋值给输入框
      _this.form.radio = row.stuSex; //性别赋值给输入框
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
          _this.$post("/api/Student/ModifyStudent",
             {
              stuUid: _this.form.stuUid, // 要修改学生的唯一标识符
              stuName: _this.form.stuName, //学生姓名
              stuBirthDay: new Date(_this.form.born), //生日
              stuClassId: _this.classes2.classId, //班级编号
              stuMobile: _this.form.phone, //手机号
              stuPassword: _this.form.password, //登录密码,
              stuSex: _this.form.radio //性别
            })
            .then(response => {
              if (response.code == 1) {
                _this.classInfo(_this.classes2); //修改成功后跳转到所选班级，方便查看
                _this.$msg(_this,1,'修改成功！')
              } else {
                _this.$msg(_this,-1,'修改失败！')
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
        var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "Confirm";
        var fText2 = "Cancel";
        var flag ="Hint"
        var title = "This operation will permanently delete the data. Do you want to continue?"
      }else{
         var fText = "确定";
        var fText2 = "取消";
        var flag ="提示"
        var title = "此操作将永久删除该数据, 是否继续?"
      }
      var _this = this;
      // console.log(row1);
      _this.$get(`/api/Student/RemoveStudent?uid=${row1.stuUid}`)
        .then(res => {
            _this.$confirm(title,flag, {
              confirmButtonText: fText,
              cancelButtonText: fText2,
              type: "warning",
              center: true
            })
            .then(() => {
              _this.tableData.splice(index1, 1);
             _this.$msg(_this,1,' 删除成功') //成功提示
            })
            .catch(() => {
            _this.$msg(_this,-1,' 已取消删除') 
            });
        });
    },
    /**
     * @{argument} getClassName改变监听班级编号事件
     * @param {Num} res 班级编号
     */
    classInfo(classes) {
      //获取班级学生aaa
      var _this = this;
      _this.$get('/api/Student/GetClassStudent?classId='+classes.classId).then(r => {
        _this.tableData = r;
        _this.classes=classes
      });
    }
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
      width:97%;
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
/deep/.is-leaf,/deep/.cell
{
  text-align: center;
}
</style> 

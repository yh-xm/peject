<template>
  <div id="StudentManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/StudentManage' }">学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="StudentManage">
      <div class="StudentSelect">
        <el-select v-model="classId" @change="res(classId)" placeholder="请选择班级">
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
        <el-dialog 
        :title="titleMap[dialogStatus]" 
        :visible.sync="dialogFormVisible"
        width="40%">
          <el-form :model="form" :rules="addRules" ref="form">
            <el-form-item label="*班级" :label-width="formLabelWidth">
              <el-select v-model="classId" placeholder="请选择" @change="res(classId)">
              <el-option
                v-for="item in options"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="*学生名称" :label-width="formLabelWidth" prop="stuName">
              <el-input v-model="form.stuName" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item label="*生日" :label-width="formLabelWidth">
              <div class="block" style="width:160px">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="form.born"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="*手机号" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="form.phone" autocomplete="true"></el-input>
            </el-form-item>
            <el-form-item label="*性别" :label-width="formLabelWidth">
              <template>
                <el-radio v-model="form.radio" label="男">男</el-radio>
                <el-radio v-model="form.radio" label="女">女</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="*密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="add('form')" v-show="show1">添加</el-button>
            <el-button type="primary" @click="update('form')" v-show="show2">修改</el-button>
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
    var name = /^[\u4e00-\u9fa5a-zA-Z]+$/
    var validateName = (rule, value, callback) => {
      setTimeout(() => {
        if (!name.test(value)) {
          callback(new Error('名字必须必须为中文或英文'))
        } else {
          callback()
        }
      }, 1000)
    }
    var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
    var validatePhone = (rule, value, callback) => {
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error('手机格式有误'))
        } else {
          callback()
        }
      }, 1000)
    }

    var passWord = /^[a-zA-Z0-9]{3,9}$/
    var validatepassWord = (rule, value, callback) => {
      setTimeout(() => {
        if (!passWord.test(value)) {
          callback(new Error('密码为3-9位字符'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      show1:false,//判断新增还是修改
      show2:false,//判断新增还是修改
      dialogStatus:'',
      titleMap: {
        addEquipment:'新增学生',
        editEquipment: "修改学生"
                },
      dialogFormVisible: false,
      options: [],//班级选择
      classId:'',//默认班级编号
      tableData: [],//
      form: {//新增
        stuUid:'',//学生遍号
        class: "",//班级编号
        stuName: "",//学生姓名
        stuClassId:'',
        born: '',//生日
        phone:'',
        radio: '男',//男女默认值
        password:'',
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      addRules: {
        // 校验手机号码，主要通过validator来指定验证器名称
        stuName: [{ required: true, validator: validateName, trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        password: [{ required: true, validator: validatepassWord, trigger: 'blur' }]
      },
      formLabelWidth: "120px",
      
    };
  },
  // inject: ['reload'], //注入
  methods: {
    addEquipment(){//新增
      this.dialogFormVisible = true;//显示弹框
      this.show1=true//显示新增按钮
      this.show2=false//隐藏修改按钮
      this.dialogStatus = "addEquipment"; //新增弹框标题
      this.form.stuName=''
      this.form.class=''
      this.form.born=''  
      this.form.phone=''
      this.form.password=''
      this.form.radio=''
    },
    
    add(ruleForm){//新增
    this.$refs[ruleForm].validate((valid)=>{
      if (valid) {
        this.dialogFormVisible=false
      // this.res(classId)
      let params = {//发送请求 
          "stuName":this.form.stuName,//学生姓名
          "stuClassId":this.classId,//班级编号
          "stuBirthDay":new Date(this.form.born),//生日
          "stuMobile":this.form.phone,//手机号
          "stuPassword":this.form.password,//登录密码,
          "stuSex":this.form.radio,//性别
          "className":this.form.class,
          "stuAge":18
        }
      this.axios.post('/api/Student/AddStudent',params)
     .then((response) => {
          // console.log(this.tableData)
          //  console.log(this.options)
          //  console.log(params)
          if (response.data.code==1) {
            this.tableData.push(params)
            this.res(this.classId)//调用onchange事件
            this.$message({
              type:"success",
              message:"新增成功！"
              })
          }else{
            this.$message({
              type:"warning",
              message:"新增失败！"
              })
          }
        })
      }
    })
      
    },
    handleEdit(index,row) {//编辑

    this.show2=true//显示修改按钮
    this.show1=false//隐藏新增按钮
    this.dialogFormVisible = true;//显示弹框
    this.dialogStatus = "editEquipment"//编辑弹框标题
    this.form.stuUid=row.stuUid//学生ID
    this.form.stuName=row.stuName//学生名字
    this.form.class=row.className//班级名字
    this.form.born=row.stuBirthDay // 生日
    this.form.phone=row.stuMobile//电话
    this.form.password=row.stuPassword//密码
    this.form.radio=row.stuSex//性别
    this.form.classId=row.classId//
      // console.log(row.classId);
    },
    update(ruleForm){//修改
    this.$refs[ruleForm].validate((valid)=>{
      if (valid) {
      var _this=this
      _this.dialogFormVisible=false
      _this.axios({
        method:"post",
        url:'/api/Student/ModifyStudent',
        data:{
          stuUid:_this.form.stuUid,// 要修改学生的唯一标识符
          stuName:_this.form.stuName,//学生姓名
          stuBirthDay:new Date(_this.form.born),//生日 
          stuClassId:_this.classId,//班级编号
          stuMobile:_this.form.phone,//手机号
          stuPassword:_this.form.password,//登录密码,
          stuSex:_this.form.radio//性别
        }
        })
        .then((response) => {
          // console.log(response.data)
          // this.reload()
          if (response.data.code==1) {
             _this.res(_this.classId)//修改成功后调用onchange事件
          _this.$message({
          type:"success",
          message:"修改成功！"
          })
          }else{
            this.$message({
              type:"warning",
              message:"修改失败！"
              })
            }
         })
       }
     })
    },
    handleDelete(index1,row1) {//删除学生
      console.log(row1);
      this.axios
      .get(`/api/Student/RemoveStudent?uid=${row1.stuUid}`)
      .then((res) => {
          if(confirm("确定删除吗？")){
          this.tableData.splice(index1,1)
          this.$message({
          type:"success",
          message:"删除成功！"
          })
         }else{
            this.$message({
              type:"warning",
              message:"取消删除！"
              })
          }
      });
    },
    res(res){//获取班级学生
    // console.log(res)//班级编号
       this.axios
      .get(`/api/Student/GetClassStudent?classId=${res}`)
      .then((r) => {
        this.tableData=r.data;
        this.classId=r.data[0].classId//报错是因为没有数据
        this.public()
        this.form.class=r.data[0].className
        //  console.log(r.data)//班级所有学生
      });
    },
    public(){
       this.axios.get("api/Class/GetAllClass").then(r => {
      this.options = r.data;
      // this.classId=r.data[0].className
    });
    }
    
  },
  created: function() {//获取班级
   this.public()
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
    box-shadow: 0px 0px 5px 0px #999;
    .StudentSelect {
      width: 97%;
      height: 70px;
      border-bottom: 1px solid #ccc;
      line-height: 70px;
      padding-left: 3%;
      .addStudent {
        color: rgb(36, 156, 211);
        margin-left: 1%;
      }
    }
    .dialog-footer{
      text-align: center;
    }
  }
  /deep/.el-dialog__header{
    text-align: center;
  }
  /deep/.el-dialog__body{
    margin-top: -30px;
  }
}
/deep/.el-date-editor .el-input{
  width: 100%
}
/deep/.el-table_1_column_5,/deep/.el-table_1_column_1,/deep/.el-table_1_column_6,/deep/.el-table_1_column_8{
    text-align: center;
  }
</style>
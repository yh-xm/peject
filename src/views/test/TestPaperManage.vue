<template>
  <div id="TestPaperManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">
        <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
        <a v-else>{{item.name}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-table :data="tableData" style="width:100%" :border="true">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="标题" prop="tpTitle"></el-table-column>
          <el-table-column label="出卷人" prop="userName"></el-table-column>
          <el-table-column label="课程" prop="courseName"></el-table-column>
          <el-table-column label="出卷日期" prop="tpDate"></el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" @click="handleGet(scope.$index, scope.row)">详情</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pages"
          ></el-pagination>
        </div>
        <el-dialog title="修改试卷信息" :visible.sync="dialogFormVisible" center>
          <!-- 弹出框的确定取消按钮 -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <p>试卷标题</p>
            <el-form-item  prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
             <p>专业课程</p>
            <course-frame v-model="lovingVue" :oindex="seed" :oname="nemuId"></course-frame>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="amend('ruleForm')">修改</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import CourseFrame from '@/components/CourseFrame.vue'
export default {
   components:{CourseFrame},
  data() {
    return {
      lovingVue:[],
      seed:0,
      nemuId:"",
      tableData: [], //接收渲染的数据
      pages: 0, //总条数
      each: 10, // 显示多少条每页
      fewPages: 1, //显示从第几条显示
      dialogFormVisible: false, //用于判断是否弹出弹出框
      tpId:"", //试卷编号
      usIndex:"",//编辑时选中的下标
       ruleForm: {
          name: '',
        },
              rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1,  trigger: 'blur' }
          ],
        }
    };
  },
  methods: {
    /**
     * 点击编辑
     * @param {Number} index 当前行的下标
     * @param {object} row 当前行的用户数据
     */
    handleEdit(index, row) {
      console.log(index, row);
      var _this = this;
      _this.ruleForm.name =row.tpTitle //获取的名字赋值给弹出框
      _this.seed = row.tpCourseId //把课程id 赋值给子组件
      _this.tpId = row.tpId
      _this.usIndex =index
      _this.dialogFormVisible = true;
    },
       /**
       * 点击确定修改
       * @param {boolean} formName 表单的验证
       */
      amend(formName) {
        var _this=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(_this.lovingVue[0])
           _this.axios.post("api/TestPaper/ModifyTestPaper",{
             tpId:_this.tpId,//试卷编号
              tpCourseId:_this.lovingVue[0].courseId,//课程编号，可修改
              tpTitle:_this.ruleForm.name,//试卷标题，可修改
           }).then(function(data){
               var alter=_this.tableData[_this.usIndex]
              alter.tpTitle=_this.ruleForm.name;
              alter.courseName=_this.lovingVue[0]

             console.log(data)
           })
            _this.dialogFormVisible = false;
          } else {
          
            return false;
          }
        });
      },
    /**
     * 点击删除
     * @param {Number} index 当前行的下标
     * @param {object} row 当前行的用户数据
     */
    handleDelete(index, row) {
      console.log(row.tpId);
      var _this = this;
      _this.axios
        .post("api/TestPaper/RemoveTestPaper?id=" + row.tpId)
        .then(function(data) {
          console.log(data);
          if (data.data.code == 1) {
            _this.message(_this, 1, "66666");
            _this.tableData.splice(index, 1);
          }
        });
    },
    /**
     * 获取每页显示几条的数据并赋值
     * @param {Number} val 每页需要显示的条数
     */
    handleSizeChange(val) {
      var _this = this;
      _this.each = val; //每页需要显示的条数 赋值给定义的变量并调用渲染接口
      _this.testPaper();
    },
    /**
     * 获取当前多少页并赋值
     * @param {Number} val 显示第几页
     */
    handleCurrentChange(val) {
      var _this = this;
      _this.fewPages = val; //显示第几页的数据 赋值给定义的变量并调用渲染接口
      _this.testPaper();
    }, 

    /**
     * 封装渲染数据方法以达到重复调用
     */
    testPaper() {
      var _this = this;
      _this.axios("/api/TestPaper/GetTestPaperList?pageIndex=" +_this.fewPages +"&pageSize=" +_this.each)
        .then(function(data) {
          var stu = data.data.data; //赋值给定义的变量用于渲染
          for (const key in stu) {
            //可根据本地时间把 Date 对象的日期部分转换为字符串，并返回结果
            stu[key].tpDate = new Date(stu[key].tpDate).toLocaleDateString();
          }
          _this.tableData = stu;
          _this.pages = data.data.items; //赋值给显示的条数
        });
    },
     /**
     *查看详情
     */
      handleGet(index, row) {
      // console.log(row.tpId)
      this.$router.push({ path: `/testPageInfo/${row.tpId}` });
    }
  },
  created() {
    var _this = this;
    _this.testPaper();
  }
};
</script>
<style lang="less" scoped>
//面包屑导航下外边距20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}
//分页居中
.block {
  text-align: center;
}

//控制输入框宽度
/deep/.el-form-item {
  div {
    width: 300px;   
  }
 
}

//弹出弹出框的宽度
/deep/.el-dialog {
  p{text-indent: 100px;padding-bottom: 10px ;padding-top: 15px;}
/deep/.el-dialog__body{
      padding: 0px;
    }
  width: 478px;
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
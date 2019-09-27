<template>
  <div id="ViewTestPaper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/StudentManage' }">批阅试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷名" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.tpTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出卷人" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试开始时间" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.taskStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试结束时间" width="170" style="text-align:center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.taskEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时(分钟)" width="100" style="padding-left: 60px;">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.taskEscapeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交卷人数" width="80" style="padding-left: 60px;">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.counter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.counter==0"  @click="piYueTest(scope.$index,scope.row)">批阅试卷</el-button>
        </template>
      </el-table-column>
    </el-table>
     <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        tableData:[],
        currentPage:'',
    };
  },
  methods: {
    /**
     * 获取测试任务
     */
    getTestInfo(){
        var _this=this
        _this.axios.get('/api/TestPaper/GetTestTask')
        .then((res)=>{
            _this.tableData=res.data.data
            _this.currentPage=_this.tableData.length+1
            console.log(res.data.data)
        })
    },
    /**
     * 批阅试卷
     */
    piYueTest(){

    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    // getTest() {
    //   var _this = this;
    //   let params = {
    //         "taskTestPaperId": 244,//试卷编号
    //         "taskClassId": 336,//班级编号
    //         "taskStartTime": "2019/03/07 10:30",//开始时间
    //         "taskEndTime": "2019/03/07 11:30"//结束时间
    //       };
    //    _this.axios.post("/api/Student/AddStudent", params).then(response => {
    //         if (response.data.code == 1) {
    //           _this.tableData.push(params);
    //           _this.getClassName(_this.classId2); //跳转到所选班级，方便查看
    //           _this.$message({
    //             type: "success",
    //             message: "新增成功！"
    //           });
    //         } else {
    //           _this.$message({
    //             type: "warning",
    //             message: "新增失败！"
    //           });
    //         }
    //       });
   // }
  },
  created: function() {
    this.getTestInfo(); //调用班级数据
  }
};
</script>
<style lang="less" scoped>
</style>
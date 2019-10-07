<template>
  <div id="TestPaperManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
     <div slot="header" class="clearfix">
        <el-table :data="tableData" style="width:100%" :border=true>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="标题" prop="tpTitle"></el-table-column>
          <el-table-column label="出卷人" prop="userName"></el-table-column>
          <el-table-column label="课程" prop="courseName"></el-table-column>
          <el-table-column label="出卷日期" prop="tpDate"></el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini">详情</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text item">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
              :total="pages"
            ></el-pagination>
          </div>
        </div>
        </div>
     
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      pages:0,
      each:10,

    fewPages:1
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
     var _this=this
     _this.each = val
    _this.testPaper()
    },
    handleCurrentChange(val) {
         var _this = this
         _this.fewPages=val
         _this.testPaper()
    },
    testPaper(){
        var _this=this
        _this.axios("/api/TestPaper/GetTestPaperList?pageIndex="+_this.fewPages+"&pageSize="+_this.each).then(function(data){
           _this.tableData=data.data.data
           _this.pages=data.data.items
          
           console.log( _this.tableData)
        })
    } 

  },
  created(){
    var _this=this
    _this.testPaper()
  }



};
</script>
<style lang="less" scoped>
//面包屑导航下外边距20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}

.block{
  border-top: 1px solid #EBEEF5;
  text-align: center;
  height: 60px;
  line-height: 60px;
}


</style>
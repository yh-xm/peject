<template>
  <div id="TestPaperManage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-table :data="tableData" style="width: 100%" border=true>
          <el-table-column label="#" prop="date"></el-table-column>
          <el-table-column label="标题" prop="name"></el-table-column>
          <el-table-column label="出卷人" prop="address"></el-table-column>
          <el-table-column label="课程" prop="a"></el-table-column>
          <el-table-column label="出卷日期" prop="b"></el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
               <el-button size="mini">详情</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          a: "111",
          b: "222",
          c: "333"
        },
       
      ],
      search: ""
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
<style lang="less" scoped>
//面包屑导航下外边距20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
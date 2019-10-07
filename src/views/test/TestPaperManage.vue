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

      <router-view />
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navTitle: [
        { name: "首页", path: "/" },
        { name: "在线测试", path: "/TestPaperManage" },
        { name: "试卷管理", path: "/TestPaperManage" }
      ],
      tableData: [],
      pages: 0,
      each: 10,
      fewPages: 1
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
      var _this = this;
      _this.each = val;
      _this.testPaper();
    },
    handleCurrentChange(val) {
      var _this = this;
      _this.fewPages = val;
      _this.testPaper();
    },
    testPaper() {
      var _this = this;
      _this
        .axios(
          "/api/TestPaper/GetTestPaperList?pageIndex=" +
            _this.fewPages +
            "&pageSize=" +
            _this.each
        )
        .then(function(data) {
          _this.tableData = data.data.data;
          _this.pages = data.data.items;

          console.log(_this.tableData);
        });
    },
    handleGet(index, row) {
      // console.log(row.tpId)
      this.$router.push({ path: `/testPageInfo/${row.tpId}` });
    }
  },
  created() {
    var _this = this;
    _this.testPaper();
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      console.log(vm);
    });
  }
};
</script>
<style lang="less" scoped>
//面包屑导航下外边距20px
/deep/.el-breadcrumb {
  margin-bottom: 20px;
}

.block {
  border-top: 1px solid #ebeef5;
  text-align: center;
  height: 60px;
  line-height: 60px;
}
</style>
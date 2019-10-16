<template>
  <div id="ViewTestPaper">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:20px">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/ViewTestPaper'}">{{$t('test.r6')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/piYueTestPaper'}">{{$t('test.r5')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <h6>{{$t('test.r4')}}</h6>
      </div>
      <div class="text item">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" width="80" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.$index+(currentPage - 1)*currentPageSize + 1}}</span>
          </template>
        </el-table-column>
          <el-table-column :label="$t('tableName.tt')">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.tpTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tcn')" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tp')">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tts')" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskStartTime  | cutTimeT}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tte')" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskEndTime  | cutTimeT}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.ths')" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.taskEscapeTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.thp')" width="80">
            <template slot-scope="scope" >
              <span style="margin-left: 10px">{{ scope.row.counter }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableName.tm')">
            <template slot-scope="scope">
              <el-button
                @click="piYueTest(scope.$index, scope.row)"
                type="primary"
                size="mini"
                :disabled="scope.row.counter==0"
              >{{$t('test.r4')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页开始 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="0"
            layout="total, sizes, prev, pager, next, jumper"
            :total="items"
          ></el-pagination>
        </div>
        <!-- 分页结束-->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
    return {
      tableData: [], //获取所有的试卷信息
      currentPageSize: 5, //默认初始化每页为5条数据
      currentPage: 1, //默认当前页为第一页
      items: 0, //获取总共的试卷
    };
  },
  filters: {
    /**
     * 过滤时间里面的T
     * @param cutTimeT 过滤后的数据
     * @param value 需要过滤的数据
     */
    cutTimeT: function(value){
      return value.replace('T',' ')
    },
    /**
     * 管道过滤选择题答案
     * @param formatId 过滤后的数据
     * @param value 需要过滤的数据
     */
    formatId: function(value) {
      var _this = this;
      var result = ["A", "B", "C", "D","E","F","G"];
      var ChooseAnswer = "";
      for (let i in value.questions) {
        for (let j in value.myChoose) {
          if (value.questions[i].cqId == value.myChoose[j]) {
            ChooseAnswer += result[i];//防止有多选题出现
          }
        }
      }
      return  "【" + ChooseAnswer + "】";
    }
  },
  methods: {
    /**
     * 分页获取所有试卷信息
     * @param pageIndex {string} 设置当前页 默认为1
     * @param pageSize {string} 设置每页有多少条数据
     */
    testPaperMessage(pageIndex, pageSize) {
      var _this = this;
      _this.axios.get("/api/TestPaper/GetTestTask?pageIndex=" +pageIndex +"&pageSize=" +pageSize)
        .then(res => {
          _this.tableData = res.data.data;
          _this.items = res.data.items;
        });
    },
    /**
     * 设置每页多少条数据
     * @param val 每页多少条数据
     */
    handleSizeChange(val) {
      var _this=this
      _this.currentPageSize = val;
      _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
    },
    /**
     * 设置当前页
     * @param val {string} 当前的页数
     */
    handleCurrentChange(val) {
      var _this=this
      console.log(`当前页: ${val}`);
      _this.currentPage = val;
      _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
    },
    
    
    handleChange(value) {
      console.log(value);
    },
    /**
     * 获取指定的考试信息
     * @param index {string} 试卷下标
     * @param row {Object} 获取试卷选中信息
     */
    piYueTest(index, row) {
      let _this = this;
          _this.$router.push({
            path:'/piYueTestPaper',
            query:{
              taskId:row.taskId
            }
          })
      // _this.axios
      //   .get("/api/TestResult/GetStudentTest?taskId=" + row.taskId)
      //   .then(res => {
      //     _this.$router.push({
      //       path:'/piYueTestPaper',
      //       query:{
      //         dataInfo:res.data,
      //         taskId:row.taskId
      //       }
      //     })
      //   });
     }
  },
  created:function() {
    var _this=this
    _this.testPaperMessage(_this.currentPage, _this.currentPageSize);
  }
};
</script>
<style lang="less" scoped>
// *{
//   padding: 0px;
//   margin: 0px;
// }
ul,li {
  list-style: none;
}
// 分页的样式
.el-pagination {
  text-align: center;
  padding-top: 20px;
}
//试卷任务列表居中
/deep/.is-leaf,/deep/.cell
{
  text-align: center;
}
</style>
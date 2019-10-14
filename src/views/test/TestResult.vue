/** 
* 测试成绩
*/
<template>
  <div id="testResult">
    <el-row>
      <el-col :span="11">
        <el-card class="box-card">
          <!-- 班级下拉框 -->
          <div slot="header" class="clearfix">
            <el-select v-model="classId" placeholder="请选择" @change="elect($event)">
              <el-option
                v-for="item in options"
                :key="item.classId"
                :label="item.courseName"
                :value="item.classId"
              ></el-option>
            </el-select>
          </div>
          <!-- 左列表 -->
          <el-table
            :data="tableData1"
            v-loading="tableLoading"
            highlight-current-row
            @row-click="choose"
            style="width: 100%"
          >
            <el-table-column prop="courseName" label="课程"></el-table-column>
            <el-table-column prop="tpTitle" label="试卷"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="counter" label="提交人数"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="13">
        <el-card class="box-card">
          <!-- 单选切换 -->
          <div slot="header" class="clearfix" @change="switcher">
            <template>
              <el-radio v-model="radio" label="1">列表</el-radio>
              <el-radio v-model="radio" label="2">图表</el-radio>
            </template>
            <el-button type="primary" @click="exportToExcel()">导出</el-button>
            <el-button type="primary" v-print="'#printTest'">打印</el-button>
          </div>
          <h4 style="text-align:center" v-show="show">{{tpTitle}}</h4>
          <!-- 右列表 -->
          <el-table
            :data="tableData2"
            v-show="show"
            v-loading="tableLoading"
            height="300"
            style="width: 100%"
            id="printTest"
          >
            <el-table-column prop="stuName" label="姓名"></el-table-column>
            <el-table-column prop="submitTime" width="180" label="提交时间"></el-table-column>
            <el-table-column prop="testScore" label="成绩"></el-table-column>
            <el-table-column prop="userName" label="阅卷老师"></el-table-column>
          </el-table>
          <!-- 图表 -->
          <div id="main" ref="barchart" v-show="!show" style="height:300px;" ><h4>{{tpTitle}}</h4></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts"); // 引入 ECharts 主模块
require("echarts/lib/chart/bar"); //引入条形图组件

export default {
  name: "testResult",
  data() {
    return {
      options: [], //班级下拉框
      classId: "", //班级下拉框值
      chart: "",
      radio: "1", //单选按钮
      tableData1: [], //左列表
      tableData2: [], //右列表
      show: true, //隐藏显示
      tableLoading: false //表格加载中
    };
  },
  created() {
    var _this = this;
    //班级下拉框
    _this.axios.get("/api/Class/GetAllClass").then(res => {
      _this.options = res.data;
    });
  },
  methods: {
    exportToExcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../assets/js/Export2Excel");
        const tHeader = ["姓名", "提交时间", "成绩", "阅卷老师"]; //标题
        const filterVal = ["stuName", "submitTime", "testScore", "userName"]; //字段名
        const list = this.tableData2; //前端请求的数据
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "列表excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /**
     * 左列表
     * @param{string} event 当前班级的classId
     */
    elect(event) {
      var _this = this;
      _this.tableLoading = true; //表格加载中
      _this.axios
        .get("/api/TestResult/GetTestPaperByClassId", {
          params: {
            classId: event
          }
        })
        .then(res => {
          _this.tableLoading = false; //表格加载中
          _this.tableData1 = res.data; //渲染左列表
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 右列表
     * @param{string} row 对应左表行的数据
     */
    choose(row) {
      // console.log(row.tpTitle);

      var _this = this;
      _this.tpTitle=row.tpTitle
      _this.tableLoading = true; //表格加载中
      _this.axios
        .get("/api/TestResult/GetTestResultByTaskId", {
          params: {
            taskId: row.taskId
          }
        })
        .then(res => {
          _this.tableLoading = false; //表格加载中
          _this.tableData2 = res.data; //渲染右列表
          var stuName = []; //学生姓名
          var testScore = []; //学生成绩
          var myChart = document.getElementById("main"); //获取图表ID
          myChart.style.width = myChart.parentNode.offsetWidth + "px"; //让图表的宽度等于它的父节点的宽
          //根据屏幕大小改变图表大小
          window.onresize = function() {
            myChart.resize({
              width: myChart._dom.parentNode.offsetWidth + "px"
            });
          };
          myChart = echarts.init(myChart);
          for (let i = 0; i < _this.tableData2.length; i++) {
            stuName.push(_this.tableData2[i].stuName); //循环出每个下标的学生姓名
            testScore.push(_this.tableData2[i].testScore); //循环出每个下标的学生成绩
          }
          myChart.setOption({
            title: {
              text: row.tpTitle + "(成绩表)", //标题
              left: "center" //标题居中
            },
            tooltip: {},
            xAxis: [
              {
                type: "category",
                data: stuName, //x轴的学生姓名
                axisLabel: {
                  interval: 0, //横轴信息全部显示
                  /**
                   * 奇数下标标签下移
                   * @param{string} labelX x轴的标签
                   * @param{number} index 标签下标
                   */
                  formatter: function(labelX, index) {
                    if (index % 2 == 1) {
                      return "\n\n" + labelX;
                    } else {
                      return labelX;
                    }
                  }
                }
              }
            ],
            yAxis: {},
            series: [
              {
                name: "成绩",
                type: "bar",
                barWidth: "40%", //条的宽度
                data: testScore //学生的成绩
              }
            ],
            label: {
              show: true, //开启显示
              position: "top" //在上方显示
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换
    switcher() {
      let _this = this;
      _this.show = !_this.show;
    }
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  height: 400px;
  margin: 5px;
}
//试卷任务列表居中
/deep/.is-leaf,/deep/.cell
{
  text-align: center;
}
</style>
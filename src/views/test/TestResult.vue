/** 
* 测试成绩
*/
<template>
  <div class="all">
    <div id="StudentManage">
      <!-- head 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.r5')}}</el-breadcrumb-item>
      </el-breadcrumb>
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
              style="width: 100%;height:350px"
            >
              <el-table-column label="课程" width="120">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.courseName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="试卷" width="230">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.tpTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column label="日期" width="110">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交人数" width="80">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.counter }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="courseName" label="课程"></el-table-column>
              <el-table-column prop="tpTitle" label="试卷"></el-table-column>
              <el-table-column prop="date" label="日期"></el-table-column>
              <el-table-column prop="counter" label="提交人数"></el-table-column> -->
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="13">
          <el-card class="box-card" ref="print" id="classResult">
            <!-- 单选切换 -->
            <div slot="header" class="clearfix" @change="switcher">
              <template>
                <el-radio v-model="radio" label="1">列表</el-radio>
                <el-radio v-model="radio" label="2">图表</el-radio>
                <el-button type="primary" v-print="'#classResult'">打印</el-button>
              </template>
            </div>
            <h3 style="text-align:center;margin:10px" v-show="show">{{title}}</h3>
            <!-- 右列表 -->
            <!-- v-print="'#classResult'" -->
            <el-table
              :data="tableData2"
              v-show="show"
              v-loading="tableLoading"
              style="width:100%;height:300px;margin-right:0px"
            >
              <el-table-column label="#" width="50">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{scope.$index+ 1}}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.stuName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" width="180">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.submitTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="成绩" width="130">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.testScore }}</span>
                </template>
              </el-table-column>
              <el-table-column label="阅卷老师">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 图表 -->
            <div id="main" ref="barchart" v-show="!show" style="height:350px;">
              <h3 style="text-align:center;margin:10px">{{title}}</h3>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
      isShow: true,
      radio: "1", //单选按钮
      tableData1: [], //左列表
      tableData2: [], //右列表
      show: true, //隐藏显示
      title: "",
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
    printTest() {
      this.isShow = false; // 隐藏因素
      setTimeout(() => {
        this.$print(this.$refs.print);
        this.showBtn = true; // 显示元素
      }, 50);
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
      var _this = this;
      // console.log(row)
      _this.tableLoading = true; //表格加载中
      _this.title = row.tpTitle;
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
@media print {
  html,
  body {
    height: inherit;
  }
}
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
  margin: 5px;
}
/deep/.is-leaf,/deep/.cell
{
  text-align: center;
}
</style>
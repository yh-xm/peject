<template>
  <div class="all">
    <div id="StudentManage">
      <!-- head 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{$t('message.home')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('test.r5')}}</el-breadcrumb-item>
      </el-breadcrumb>
    
      <!-- class下拉框 -->

      <div class="StudentManage">
        <div class="StudentSelect">
          <!-- getClassName改变事件 -->
          <el-select v-model="classId" @change="getClassName" placeholder="请选择班级">
            <el-option
              v-for="item in options"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </div>
        <!-- 下拉框结束 -->
        <!-- 第一个文本框 
        根据下拉框中所选中的class 显示相对应的测试任务
        -->
        <div class="main">
          <el-table :data="tableData" style="width: 100%" @row-click="Mary">
            <el-table-column label="#" width="80">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程" width="130">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.courseName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="试卷" width="130">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tpTitle }}</span>
              </template>
            </el-table-column>
            <el-table-column label="日期" width="80">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="提交人数" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.counter}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 结束 -->
      </div>
    </div>
    <div class="jolin">
      <div slot="header" class="clearfix">
        <!-- 切换的 按钮 -->
        <!-- 改变事件 -->
        <template>
          <el-radio v-model="radio" label="1" @change="One">列表</el-radio>
          <el-radio v-model="radio" label="2" @change="One">图表</el-radio>
        </template>
      </div>
      <div>
          <!-- 按钮结束 -->
          <!-- 按钮的显示和隐藏 -->
        <div id="main" v-show="hidde==!true"></div>

      </div>
      <!-- 第二个文本框 -->
      <div class="clearfix1" v-show="hidde">
        <el-table :data="Jack" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <!-- :index="indexMethod" -->
          <el-table-column label="姓名" prop="stuName"></el-table-column>
          <el-table-column label="提交时间" prop="submitTime"></el-table-column>
          <el-table-column label="成绩" prop="testScore"></el-table-column>

          <el-table-column label="阅卷" prop="userName"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>




<script>
var echarts = require("echarts/lib/echarts");
// echarts引入柱状图
require("echarts/lib/chart/bar");
export default {
  data() {
    return {
      
      options: [], //班级选择
    
      tableData: [], //第一个表单数据
      Jack: [], //   渲染班级提交人数
      radio: "1", //单选按钮
    
      hidde: true, //单选隐藏显示
      name:[],  // 图表的数据
      series:[],
      // 成绩
    
    };
  },
  // 方法
  methods: {
    /**封装渲染下拉框
     */
    public() {
      //获取所有班级
      var _this = this;
      //   连接API 接口 所有class 的接口
      _this.axios("api/Class/GetAllClass").then(function(a) {
        //   获取classID  通过点出来找classid
        _this.options = a.data;
      });
    },
    /**
     * 改变事件 选中当前的iD
     * @param {number} all 是选中的classID
     */
    getClassName(all) {
      var _this = this;
      //
      _this
      // 根据classID  来显示 不同class
        .axios("api/TestResult/GetTestPaperByClassId?classId=" + all)
        .then(function(t) {
          // console.log(t.data)
          _this.tableData = t.data;
        });
    },
    /**
     * 点击选中当前数据  调用当前class
     * @param {object} row 当前行所有数据
     */
    Mary(row) {
      // console.log(row.taskId)

      var _this = this;
      _this
      // taskId是任务的ID
        .axios("api/TestResult/GetTestResultByTaskId?taskId=" + row.taskId)
        .then(function(p) {
          // console.log(p)
          _this.Jack = p.data;
          var stu=p.data
          // 用于 echara 的图表调用数据
          for (const key in stu) {
            // 名字的插入
             _this.name.push(stu[key].stuName) 
            //  push 插入数据 
            // 成绩的插入
            _this.series.push(stu[key].testScore)
          }
        });

    },

    // 按钮的显示隐藏

    One(m) {
      console.log(m);
      var _this = this;
      _this.drawLine()
      if (m == 1) {
        _this.hidde = true;
      } else {
        _this.hidde = false;
      }
    },
        drawLine() {
            var _this=this
            
				   // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 成绩表'
            },
            tooltip: {},
            legend: {
                data:['成绩表']
            },
            xAxis: {
              // 名字的数据
                data: _this.name
            },
            yAxis: {},
            series: [{
                name: '成绩表',
                type: 'bar',
                data: _this.series
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
			}
		



  },

  created() {
    this.public(); //调用班级数据
   
  }
};
</script>

 

<style lang="less" scoped>
#main {
		height: 500px;
		width: 500px;
	}
#StudentManage {
  float: left;
  width: 50%;
  height: 100%;
  .StudentManage {
    float: left;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    margin-top: 30px;
    .StudentSelect {
      width: 100%;
      height: 70px;
      // border-bottom: 1px solid #ccc;
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
/deep/.el-form-item__content {
  width: 45%;
}
/deep/.el-table_1_column_5,
/deep/.el-table_1_column_1,
/deep/.el-table_1_column_6,
/deep/.el-table_1_column_8 {
  text-align: center;
}
// .all{

//   width:100%;
//   height:900px;
//   background-color: black;

// }
.jolin {
  width: 480px;
  height: 100%;

  border: 1px solid #e8e8e8;

  float: right;
  margin-top: 50px;
}
.clearfix1 {
  margin-top: 20px;
}
</style> 

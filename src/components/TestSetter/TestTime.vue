<template>
  <div id="testTime">
    <div class="testTime">
      <div class="testTime-name">考试时间</div>
      <div class="timeTable">
        <el-date-picker
          v-model="value"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="logTimeChange"
          size="small"
        ></el-date-picker>
        <el-button type="danger" size="small" disabled plain>用时：{{timeLimit}} 分钟</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: [], //初始化时间表
      timeLimit: 0, //初始化用时
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; ////设置选择今天以及今天之后的日//如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    };
  },
  methods: {
    /**
     * 时间改变事件
     * @param {Date} val input框内容
     */
    logTimeChange(val) {
      let _this = this;
      // console.log(val);
      // Math.abs()取绝对值
    _this.timeLimit = parseInt(Math.abs(val[1] - val[0])/1000/60);
    }
  }
};
</script>

<style lang="less" scoped>
#testTime {
  .testTime {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .testTime-name {
      flex: none;
      text-align: right;
      margin-right: 15px;
      color: #606266;
      width: 70px;
      font-size: 13px;
      line-height: 30px;
    }
    .timeTable {
      width: 100%;
      .el-date-editor--datetimerange.el-input,
      .el-date-editor--datetimerange.el-input__inner {
        width: 40%;
      }
    }
  }
}
</style>
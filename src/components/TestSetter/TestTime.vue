<template>
  <div id="testTime">
    <el-date-picker
      value-format="yyyy/MM/dd HH:mm:ss"
      v-model="logTime"
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
</template>
<script>
export default {
  model: {
    prop: "timeObj", //接受父级组件下发给子组件的值
    event: "timeChange"
  },
  props: {
    required: true, //是否传值
    timeObj: Array //声明父级组件传过来的值 它是啥样的 类型是啥样的 默认值啊
  },

  data() {
    return {
      logTime: [], // 表单绑定的值  时间 开始和结束
      timeLimit: 0, //耗时（分钟)
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //设置选择今天以及今天之后的日//如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      parentRes: this.timeObj
    };
  },
  methods: {
    /**
     * 时间改变事件
     * @param {Date} val input框值
     */
    logTimeChange(val) {
      let _this = this;
      console.log(val);
      console.log(_this.parentRes);
      if (_this.logTime == null) {
        _this.timeLimit = 0;
      } else {
        let date1 = new Date(_this.logTime[0]); //转格式
        let date2 = new Date(_this.logTime[1]); //转格式
        var dates = date2.getTime() - date1.getTime(); //计算
        _this.timeLimit = dates / (60 * 1000); //赋值
      }

      //timeChange 定义在父组件on监听子组件传过去的值
      // 第二参数val是子组件要传给父组件的值
      val[2] = _this.timeLimit;
      _this.$emit("timeChange", val); //把开始时间和结束时间传给父级组件
    }
    // espTime() {
    //   let _this = this;
    //   _this.timeSelectFrom.logTime = "";
    //   _this.timeSelectFrom.timeLimit = 0;
    // },
    /**
     * 把父组件传过来的时间格式转成子组件时间格式
     * **/
    // changeInfo() {
    //   var _this = this;
    //   _this.timeSelectFrom.timeLimit = _this.parentRes3.escape;
    //   _this.parentRes3.begin = _this.parentRes3.begin.replace(/T/g, " ");
    //   _this.parentRes3.begin = _this.parentRes3.begin.replace(/-/g, "/");
    //   _this.parentRes3.end = _this.parentRes3.end.replace(/T/g, " ");
    //   _this.parentRes3.end = _this.parentRes3.end.replace(/-/g, "/");
    //   _this.$set(this.timeSelectFrom, "logTime", [
    //     _this.parentRes3.begin,
    //     _this.parentRes3.end
    //   ]);
    // }
  }
};
</script>
<style lang="less" scoped>
</style>
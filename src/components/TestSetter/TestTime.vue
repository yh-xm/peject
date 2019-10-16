<template>
  <div id="testTime">
    <el-date-picker
      ref="txtTime"
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
  name: "TestTime",
  model: {
    prop: "parentTimes", //班级对象，使用v-model，给这个属性赋值
    event: "timeChange" //触发事件，名称可自定义，作用：触发这个事件，将事件的值传递给prop属性
  },
  props: {
    //组件的属性,在父组件里，可以使用v-bind赋值，如果在model有定义使用v-model赋值
    parentTimes: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      logTime: [], //下拉框绑定的时间
      timeLimit: 0, //耗时
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //设置选择今天以及今天之后的日//如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    };
  },
  watch: {
    "parentTimes": function(value, old) {
      var _this = this ;
      console.log(value)
      if(value.length==0){
       _this.logTime=[];
       _this.timeLimit=0;
      }else{
        _this.logTime = value.slice(0,2)
        this.timeLimit = value[2]
      }
       
    }
  },
  methods: {
    /**
     * 选项框改变事件，改变之后传给v-model绑定的对象
     */
    logTimeChange(v) {
      var _this = this;
      if (_this.logTime == null) {
        _this.timeLimit = 0;
      } else {
        let date1 = new Date(_this.logTime[0]); //转格式
        let date2 = new Date(_this.logTime[1]); //转格式
        _this.timeLimit = (date2.getTime() - date1.getTime()) / (60 * 1000); //计算
      }
      v.push(_this.timeLimit);
      console.log(v);

      _this.$emit("timeChange", v);
    }
  },
  created(){
    this.logTime =this.parentTimes.slice(0,2);
    console.log(this.logTime)
    this.timeLimit = this.parentTimes[2]
  }
};
</script>
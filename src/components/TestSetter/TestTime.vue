<template>
  <div id="testTime">
    <!-- {{parentRes3}} -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- :title="parentRes3" -->
      <el-form-item label="考试时间" prop="seleClassId" size="small">
        <el-date-picker
        value-format="yyyy/MM/dd HH:mm:ss"
          v-model="ruleForm.logTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="logTimeChange"
          size="small"
        ></el-date-picker>
        <el-button type="danger" size="small" disabled plain>用时：{{ruleForm.timeLimit}} 分钟</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props:{
    parentRes3:Object,
    required:true
  },
  data() {
    return {
      ruleForm: {
        logTime: [], //表单时间 开始和结束 
        timeLimit: 0 //耗时（分钟）
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; ////设置选择今天以及今天之后的日//如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      // arrTime:{//传给父级组件
      //   times:[],
      //   limit:0,
      // },
      
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
      if(_this.ruleForm.logTime == null){
        _this.ruleForm.timeLimit = 0;
      }else{
        let date1 = new Date(_this.ruleForm.logTime[0]);//转格式
        let date2 = new Date(_this.ruleForm.logTime[1]);//转格式
        var dates = date2.getTime() - date1.getTime();//计算
        _this.ruleForm.timeLimit = dates/(60 * 1000);//赋值
      }
      //childByValue 定义在父组件on监听子组件传过去的值
      //第二参数val是子组件要传给父组件的值
      // val.a=_this.ruleForm.timeLimit;
      _this.$emit("childByValue3",val);//把开始时间和结束时间传给父级组件
    }
  },
  updated(){
    let _this = this;
    // console.log(this.parentRes3);
    // if(_this.required != true){
      // _this.ruleForm.tpId = _this.parentRes3;
    // }
    // this.ruleForm.timeLimit = _this.parentRes3[0];
    // console.log(_this.parentRes3);
  }
};
</script>
<style lang="less" scoped>
</style>
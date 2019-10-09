<!-- 

js
    引用  import CTTBox from "@/components/TestSetter/CTTBOx"
    注册  components: {"c-t-t-box": CTTBox}
template 

      <c-t-t-box v-model="son" :oindex="seed" :oname="nemuId"></c-t-t-box>

      父组件自定义一个数组,接收子组件传给父组件的值
      seed 用于父组件传值给子组件 传递当前值 {Object} 类型
      seed = {
        index:row.id //获取的新id赋值给原id，
      }
 --> 
<template>
  <div id="cctbox">
    <!-- 试卷 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="试卷">
        <el-select v-model="form.tpId" placeholder="请选择试卷" size="small" @change="testChange">
          <el-option
            v-for="item in options"
            :key="item.tpId"
            :label="item.tpTitle"
            :value="item.tpId"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 班级 -->

      <el-form-item label="班级">
        <el-select v-model="form.classId" placeholder="请选择班级" size="small" @change="classChange">
          <el-option
            v-for="item in options2"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 时间 -->
      <el-form-item label="考试时间">
        <el-date-picker
          v-model="form.logEnd"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          size="small"
          value-format="yyyy/MM/dd HH:mm"
          @change="logTimeChange"
        ></el-date-picker>
        <el-button type="danger" plain disabled size="small">用时：{{form.timeLimit}} 分钟</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  model: {
    event: "cusChange",//input自定义事件
  },
  data() {
    return {
      options: [], //试卷下拉框数组
      options2: [], //班级下拉框数组
      arr: {
        t: "",
        c: "",
        m: []
      }, //子传父
      form: {
        tpId: "", //试卷Id
        classId: "", //班级Id
        logEnd: [], //时间
        timeLimit: 0 //用时
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //设置选择今天以及今天之后的日
        }
      }
    };
  },
  methods: {
    /**
     * 获取所有试卷
     * 可复用
     *
     * */

    getAllTestPaper() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/TestPaper/GetAllTestPaper").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          // console.log(res.data);
          _this.options = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    /**
     * 获取所有班级信息
     * 可复用
     *
     * */

    getAllClass() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/Class/GetAllClass").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          // console.log(res);
          _this.options2 = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },

    /**
     * 获取试卷下拉框的值
     *
     * */

    testChange(val) {
      // console.log(val);
      let _this = this;
      _this.arr.t = val;
      _this.$emit("cusChange", _this.arr);
    },
    /**
     * 获取班级下拉框的值
     *
     * */

    classChange(val) {
      // console.log(val);
      let _this = this;
      _this.arr.c = val;
      _this.$emit("cusChange", _this.arr);
    },

    /**
     * 时间改变事件
     * @param {Object} val input框内容
     *
     */
    logTimeChange(val) {
      let _this = this;
      _this.form.logEnd = val;
      // 计算耗时
      // Math.abs()取绝对值
      if (_this.form.logEnd == null) {
        _this.form.timeLimit = 0;
      } else {
        var data1 = new Date(_this.form.logEnd[0]);
        var data2 = new Date(_this.form.logEnd[1]);
        var long = data2.getTime() - data1.getTime();
        _this.form.timeLimit = long / (60 * 1000);
      }
      _this.arr.m = _this.form.logEnd;
      _this.$emit("cusChange", _this.arr);
    }
  },
  created() {
    let _this = this;
    _this.getAllTestPaper();
    _this.getAllClass();
  }
};
</script>
<style lang="less" scoped>
#cctbox {
  .el-select {
    width: 100%;
  }
}
</style>
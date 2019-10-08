<template>
  <div id="cctbox">
    <!-- 试卷 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="试卷">
        <el-select v-model="form.tpId" placeholder="请选择试卷" size="small">
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
        <el-select v-model="form.classId" placeholder="请选择班级" size="small">
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
          @change="logTimeChange"
        ></el-date-picker>
        <el-button type="danger" size="small" disabled plain>用时：{{from.timeLimit}} 分钟</el-button>
      </el-form-item>

      <!-- <el-form-item label="考试时间" prop="logEnd" size="small"> -->
      <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
      <!-- <el-date-picker
          v-model="ruleForm.logEnd"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          size="small"
          @change="logTimeChange"
        ></el-date-picker>
        <el-button type="danger" size="small" disabled plain>用时：{{ruleForm.timeLimit}} 分钟</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [], //试卷下拉框数组
      options2: [], //班级下拉框数组
      form: {
        tpId: "", //试卷Id
        classId: "", //班级Id
        logEnd: [] //时间
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //设置选择今天以及今天之后的日
        }
      }

      // logEnd: [], //初始化始终时间值
      //   ruleForm: {
      //     //表单数据
      //     tpId: "", //试卷
      //     classId: "", //班级下拉框绑定值
      //     timeLimit: 0, //初始化 用时
      //     logEnd: [] //初始化始终时间值
      //   },
      //   rules: {
      //     //表单验证
      //     tpId: [{ required: true, message: "请选择试卷", trigger: "change" }],
      //     classId: [{ required: true, message: "请选择班级", trigger: "change" }],
      //     logEnd: [{ required: true, message: "请选择时间", trigger: "change" }]
      //   },
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
          console.log(res.data);
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
          //   console.log(res);
          _this.options2 = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },

    /**
     * 时间改变事件
     * @param {Object} val input框内容
     *
     */
    logTimeChange(val) {
      let _this = this;
      _this.ruleForm.logEnd = val;
      console.log(_this.ruleForm.logEnd);
      // Math.abs()取绝对值
      if (
        _this.ruleForm.logEnd == null ||
        _this.ruleForm.logEnd == undefined ||
        _this.ruleForm.logEnd == {}
      ) {
        _this.ruleForm.timeLimit = 0;
      } else {
        _this.ruleForm.timeLimit = parseInt(
          Math.abs(_this.ruleForm.logEnd[1] - _this.ruleForm.logEnd[0]) /
            1000 /
            60
        );
      }

      // _this.timeLimit = parseInt(Math.abs(_this.ruleForm.logEnd[1] - _this.ruleForm.logEnd[0]) / 1000 / 60);

      // console.log(_this.timeLimit)
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
  /deep/.el-form-item__content {
    margin-left: 0 !important;

    .el-select {
      width: 86%;
    }
  }
}
</style>
<template>
  <div id="PaperInfo">
    <!-- 表单 -->
    <div class="from">
      <!-- 填写试卷名称 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <!-- 选择课程名称 -->
      <course-frame v-model="lovingVue" class="dropBlock"></course-frame>
        <!-- 进行下一步操作 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import CourseFrame from '@/components/CourseFrame.vue'
export default {
   components:{CourseFrame},
  data() {
    return {
      ruleForm: {
        name: "", //试卷名称
        region: "" //获取下拉选中的课程Id
      },
      rules: {
        name: [
          { required: true, message: "请输入试卷名称", trigger: "blur" }, //对应验证信息
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择课程名称", trigger: "change" } //对应验证信息
        ]
      },
      lovingVue:[]
    };
  },
  methods: {
    /**
     * 添加试卷
     *  {Number} userId 识别用户Id
     * @param {object} formName 点击当前表单
     * 
     */
    submitForm(formName) {
      var _this = this;
      var userId = sessionStorage.userId; //当前老师的唯一标识符
      _this.$refs[formName].validate(valid => {
        var tpCourseId = _this.lovingVue[0].courseId //获取下拉选中的课程Id
        var name = _this.$refs[formName].model.name; //试卷名称
        if (valid) {
          _this.axios
            .post(`/api/TestPaper/MakeTestPaper?uid=${userId}`, {
              //对应接口传递信息
              tpTitle: name, //要添加的试卷名称
              tpCourseId: tpCourseId //选中的课程Id
            })
            .then(res => {
              if (res.data.message == "添加成功") {
                _this.$parent.$parent.active = 1; //下一步操作
                sessionStorage.testPaperId = res.data.data.testPaperId; //临时存储试卷Id
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
#PaperInfo {
  display: flex;
  .from {
    width: 50%;
    margin: auto;
    .el-select {
      display: block;
    }
 
  }
  .dropBlock{
   /deep/ .el-select {
     width: 100%;
    }
  }
}
</style>
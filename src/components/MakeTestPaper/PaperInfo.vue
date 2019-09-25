<template>
  <div id="PaperInfo">
    <div class="from">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="课程名称" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择课程">
            <el-option
              v-for="item in ruleForm.options"
              :key="item.courseName"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        myoptions: [],
        region: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入试卷名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择课程名称", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var uid = sessionStorage.uid;
      this.$refs[formName].validate(valid => {
        var tpCourseId = this.$refs[formName].model.region;
        var name = this.$refs[formName].model.name;
        if (valid) {
          this.axios
            .post(`/api/TestPaper/MakeTestPaper?uid=${uid}`, {
              tpTitle: name,
              tpCourseId: tpCourseId
            })
            .then(res => {
              if (res.data.message == "添加成功") {
                this.$router.push({ name: "TestInfo" });
                this.$parent.$parent.active = 1;
                sessionStorage.testPaperId = res.data.data.testPaperId;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.axios.get(`/api/Class/GetAllCourse`).then(res => {
      this.ruleForm.options = res.data;
      console.log(this.ruleForm.options);
    });
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
    /deep/ .el-select__caret {
      margin-top: 19px;
    }
  }
}
</style>
<template>
  <div id="CourseFrame">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="专业课程" prop="keChenId">
        <el-select v-model="ruleForm.keChenId" placeholder="请选择" @visible-change=a(ruleForm.keChenId)>
          <el-option
            v-for="(inte,index) in course"
            :key="index"
            :label="inte.courseName"
            :value="inte.courseId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
    model:{
        prop:"checked",
        event:"update"
    },
    props:{
        checked:Array,
        update:String
    },

  data(){
    return {
      course: [], //课程信息
      ruleForm: {
        //新增的参数
        name: "", //班级名
        keChenId: "", //课程编码
        usName: "" //老师编码
      },
      rules:{
        keChenId: [
          //表单验证课程
          { required: true, message: "请选择课程", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    
      a(a){
        var _this=this
          var fi=_this.course.filter(function(data){
          return data.courseId == _this.ruleForm.keChenId;
          })

        _this.$emit("update",fi)  
        console.log(a)
      },





    /**
     * 课程信息
     */
    usCourse() {
      var _this = this;
      _this.axios.get("/api/Class/GetAllCourse").then(function(data) {
        _this.course = data.data;
      });
    }
  },
  /**
   * 钩子函数创建后
   */
  created() {
    var _this = this;
    _this.usCourse();
  }
};
</script>
<style lang="less" scoped>
</style>
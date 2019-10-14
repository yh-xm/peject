<!--
课程下拉框

  引用  import CourseFrame from '@/components/CourseFrame.vue'
   注册    components:{CourseFrame},
     当标签使用       <course-frame  v-model="bothWay"  :oname="nemuId" class="selectOptions"></course-frame>
locingVue 是对象类型 接收子组件的值

         _this.bothWay={
          courseId:row.tpCourseId, //把课程id 赋值给子组件
          courseName:row.courseName //名字也赋值
        }
      }; 
:oname="nemuId" 是用于给下拉框的名字 的宽度 后面要加像素单位px
-->
<template>
  <div id="CourseFrame">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="oname"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('tableName.tc')" prop="keChenId">
        <el-select v-model="ruleForm.keChenId" placeholder="请选择" @change="tranSmit">
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
         prop:'bothWay',
          event:'update'
    },
  props: {
    bothWay:Object,
    oname: String //父组件传过来的  用于标题名的宽度
  },
  data() {
    return {
      course: [], //课程信息
      ruleForm: {
        keChenId: "" //课程编码
      },
      rules: {
        keChenId: [  
          { required: true, message: "请选择课程", trigger: "change" } //表单验证课程
        ]
      },
    };
  },
  methods: {
    /**
     * 改变事件
     * @param {object} price 改变事件当前选中的下标
     */
    tranSmit(price) {
      var _this = this;
      _this.ruleForm.keChenId = price;
       var singular = _this.course.find(keCen => keCen.courseId == price); //数组find（）查找
      var copyCourse=JSON.parse(JSON.stringify(singular))
      _this.$emit("update",copyCourse);
    },
    /**
     * 课程信息加首次赋值id
     */
    usCourse() {
      var _this = this;
      _this.axios.get("/api/Class/GetAllCourse").then(function(data) {
        _this.course = data.data;
        _this.$nextTick(()=>{
      _this.ruleForm.keChenId =_this.bothWay.courseId; //首次赋值id
        })
      });
    },
  },
  watch:{
"bothWay.courseId":function(id){
  var _this= this
 _this.ruleForm.keChenId =id
}
  },
  /**
   * 钩子函数创建后
   */
  created() {
    var _this = this;
    _this.usCourse(); //调用方法
  },
};
</script>

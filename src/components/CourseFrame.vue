/** 
课程下拉框

  引用  import CourseFrame from '@/components/CourseFrame.vue'
   注册    components:{CourseFrame},
     当标签使用    <course-frame v-model="lovingVue" :oindex="seed" :oname="nemuId"></course-frame>
locingVue 是数组类型 接收子组件的值
seed 用于传递给子组件值 传递当前行的课程id Number 类型 
新增时 不需要 :oindex="seed"  都行
:oname="nemuId" 是用于给下拉框的名字 的宽度 后面要加像素单位px
*/
<template>
  <div id="CourseFrame">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="oname"
      class="demo-ruleForm"
    >
      <el-form-item label="专业课程" prop="keChenId">
        <el-select v-model="ruleForm.keChenId" placeholder="请选择" @change=tranSmit(ruleForm.keChenId) >
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
     
        event:"update"  //传递父组件的方法
    },
    props:{
        oindex:Number,// 父组件传过来的类型 用于编辑
        oname:String //父组件传过来的类型  用于标题名
    },
   
   

  data(){
    return {
      course: [], //课程信息
      ruleForm: {
        //新增的参数
        name: "", //班级名
        keChenId:"", //课程编码
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
          /**
           * 改变事件
           * @param {object} price 传递过来的id名
           */
      tranSmit(price){
        var _this=this
          var singular=_this.course.filter(function(data){//过滤
          return data.courseId == _this.ruleForm.keChenId;
          })
        _this.$emit("update",singular)  //传递到父组件 
       
      },
    
    /**
     * 课程信息加首次赋值id
     */
    usCourse() {
      var _this = this;
      _this.axios.get("/api/Class/GetAllCourse").then(function(data) {
        _this.course = data.data;

         _this.ruleForm.keChenId = _this.oindex //首次赋值id
          var singular=_this.course.filter(function(data){//过滤
          return data.courseId ==_this.oindex;
          })
        _this.$emit("update",singular) //传递到父组件 

      });
    },
  }, 

  watch:{
    /**
     * 监听传过来的数
     * @param {Number} n 父组件传过来id
     */
    oindex:function(n){
      var _this = this;
      _this.ruleForm.keChenId = n; //赋值id
       var singular=_this.course.filter(function(data){ //过滤
         return data.courseId == n;
       })
        _this.$emit("update",singular)  //传递到父组件

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
<style lang="less" scoped>
</style>
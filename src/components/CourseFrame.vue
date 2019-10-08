/** 
课程下拉框

  引用  import CourseFrame from '@/components/CourseFrame.vue'
   注册    components:{CourseFrame},
     当标签使用    <course-frame v-model="lovingVue" :oindex="seed" :oname="nemuId"></course-frame>
locingVue 是数组类型 接收子组件的值
seed 用于传递给子组件值 传递当前行的课程id {Object} 类型 
seed = {
        index:row.classCourseId,//获取的课程编码赋值给原课程编码 就能默认选中
        flag:false
      }; 
:oname="nemuId" 是用于给下拉框的名字 的宽度 后面要加像素单位px
*/
<template>
  <div id="CourseFrame">
    
    <el-form
    :name="oindex"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="oname"
      class="demo-ruleForm"
    >
      <el-form-item label="专业课程" prop="keChenId">
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
  model: {
    event: "update" //传递父组件的方法
  },
  props: {
    oindex: {
       type: Object,
      default:function(){
        return{
          index:null,
          flag:false
        }
      } //默认为true
    }, // 父组件传过来的类型 用于编辑
    oname: String //父组件传过来的类型  用于标题名
  },

  data() {
    return {
      course: [], //课程信息
      ruleForm: {
        keChenId: "" //课程编码
      },
      rules: {
        keChenId: [
          //表单验证课程
          { required: true, message: "请选择课程", trigger: "change" }
        ]
      },
      flag: false //用于被掉用赋值
    };
  },

  methods: {
    /**
     * 改变事件
     * @param {object} price 改变事件当前选中的下标
     */
    tranSmit(price) {
      var _this = this;
      _this.flag = true;
      _this.ruleForm.keChenId = price;
      var singular = _this.course.filter(function(data) {
        //过滤
        return data.courseId == _this.ruleForm.keChenId;
      });
      _this.$emit("update", singular); //传递到父组件
    },

    /**
     * 课程信息加首次赋值id
     */
    usCourse() {
      var _this = this;
      _this.axios.get("/api/Class/GetAllCourse").then(function(data) {
        _this.course = data.data;
        _this.ruleForm.keChenId = _this.oindex; //首次赋值id

        var singular = _this.course.filter(function(data) {
          //过滤
          return data.courseId == _this.oindex;
        });
        _this.$emit("update", singular); //传递到父组件
      });
    },


  },

  /**
   * 钩子函数创建后
   */
  created() {
    var _this = this;
    _this.usCourse(); //调用方法
  },
  updated() {
    var _this = this;
    if (_this.flag != true) {
      //判断是否进入过改变事件
      if (_this.oindex == null) {
        //判断是否传过来的值为空
        return;
      }
      _this.ruleForm.keChenId = _this.oindex.index;
      var singular = _this.course.filter(function(data) {
        //过滤
        return data.courseId == _this.ruleForm.keChenId;
      });
      _this.$emit("update", singular); //传递到父组件
    } else {
      _this.flag = _this.oindex.flag;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
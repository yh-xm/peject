<!--
课程下拉框

  引用  import QuestionSectect from "@/components/QuestionSectect";
   注册    components:{QuestionSectect},
     当标签使用    
      <question-sectect 
              :select="false" 
              :defaultSelect="0"
              @changeOption="changeQuestionType" 
              @questionInit="questionInit" 
          />
select 需传入Boolean true 为下拉框 false 为单选按钮
defaultSelect  需传入Number 选中第几个 
@changeOption="changeQuestionType"  //更改了选中项
@questionInit="questionInit"  //返回题目类型

-->
<template>
  <div class="question-select">
    <div class="radio-group" v-if="!select">
      <span class="list-title">题目类型</span>
      <el-radio-group v-model="radio" @change="changeQuestionType">
        <el-radio
          v-for="(item,index) in pageInfo"
          :key="index"
          :label="index"
        >{{item.typeName}}</el-radio>
      </el-radio-group>
    </div>
    <div class="select-group" v-if="select">
      <span class="list-title">题目类型</span>
      <el-select v-model="value" clearable placeholder="请选择" @change="changeQuestionType">
        <el-option
          v-for="(item,index) in pageInfo"
          :key="item.value"
          :label="item.typeName"
          :value="index"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    select: {
      type: Boolean,
      default: true //默认为true
    },
    defaultSelect: {
      type: Number
    }
  },
  data() {
    return {
      pageInfo: [], //初始化试卷信息
      radio: "", //默认选中选择题
      value: "" //默认为空
    };
  },
  methods: {
    questionInit() {
      var _this = this;
      _this.axios.get(`/api/TestPaper/GetQuestionType`).then(res => {
        //接口初始化获取问题类型
        _this.pageInfo = res.data;
        for (let i in _this.pageInfo) {
          _this.pageInfo[i].bodys = [];
          _this.pageInfo[i].nowAdd = 0;
          _this.pageInfo[i].nowScroe = 0;
        }
         this.$emit("questionInit", _this.pageInfo);
         console.log(JSON.stringify(_this.pageInfo))
        if (_this.select == true) {
          _this.value = _this.defaultSelect
        } else {
          _this.radio = _this.defaultSelect
        }
      });
    },
    changeQuestionType(type) {
      this.$emit("changeOption", type);
    }
  },
  created() {
    var _this = this;
    _this.questionInit();
  }
};
</script>
<style  lang="less" scoped>
.question-select {
  .list-title {
    margin: 0px 25px;
  }
}
</style>
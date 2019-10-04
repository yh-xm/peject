
<template>
  <div class="question-select">
    <div class="radio-group" v-if="!select">
      <span class="list-title" >题目类型</span>
      <el-radio-group v-model="radio" @change="changeQuestionType">
        <el-radio
          v-for="(item,index) in pageInfo"
          :key="index"
          :label="item.typeName"
        >{{item.typeName}}</el-radio>
      </el-radio-group>
    </div>
    <div class="select-group" v-if="select">
        <span class="list-title" >题目类型</span>
      <el-select v-model="value" clearable placeholder="请选择" @change="changeQuestionType">
        <el-option
          v-for="item in pageInfo"
          :key="item.value"
          :label="item.label"
          :value="item.typeName"
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
      required: true
    }
  },
  data() {
    return {
      pageInfo: [],
      radio: 0,
      value: ""
    };
  },
  methods: {
    init() {
      var _this = this;
      _this.pageInfo = [
        { typeName: "选择题" },
        { typeName: "填空题" },
        { typeName: "问答题" }
      ];
      for (let i in _this.pageInfo) {
        _this.pageInfo[i].bodys = [];
        _this.pageInfo[i].nowAdd = 0;
        _this.pageInfo[i].nowScroe = 0;
      }
      // _this.axios.get(`/api/TestPaper/GetQuestionType`).then(res => {
      //   //接口初始化获取问题类型
      //   // _this.pageInfo = res.data;

      //   for (let i in _this.pageInfo) {
      //     _this.pageInfo[i].bodys = [];
      //     _this.pageInfo[i].nowAdd = 0;
      //     _this.pageInfo[i].nowScroe = 0;
      //   }
      // });
        this.$emit('init', _this.pageInfo)
    },
    changeQuestionType(type) {
      var index = 0;
      switch (type) {
        case "选择题":
            index = 0;
          break;
        case "填空题":
          index = 1;
          break;
        case "问答题":
          index = 2;
          break;
      }
      this.$emit('changeOption',index)
    }
  },
  created() {
    var _this = this;
    _this.init();
  }
};
</script>
<style  lang="less" scoped>
.question-select{
     .list-title {
          margin: 0px 25px;
  }
}
</style>
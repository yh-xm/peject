<!-- 试卷下拉框组件 

  显示视图： 在父级组件的 js部分写入 
    import TestDropDownBox from "@/components/TestSetter/TestDropDownBox"; //试卷下拉框

      export default{
        components: {
        TestDropDownBox,
  },
      }
  在父级组件的 template 部分写入
      <test-drop-down-box></test-drop-down-box>

      传值:直接在标签中用v-model绑定要传的值
      <test-drop-down-box v-model="testObj"></test-drop-down-box>
-->
<template>
  <!--  -->
  <div id="testDrownBox-testSetter">
    <el-select v-model="tpId" placeholder="请选择试卷" @change="setInfo" size="small">
      <el-option :key="0" label="请选择试卷" :value="0" disabled></el-option>
      <el-option v-for="item in options" :key="item.tpId" :label="item.tpTitle" :value="item.tpId"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  model: {
    prop: "testObj", //接受父级组件下发给子组件的值
    event: "testChange"
  },
  props: {
    required: true, //是否传值
    testObj: Number //声明父级组件传过来的值 它是啥样的 类型是啥样的 默认值啊
  },
  data() {
    return {
      tpId: "", //下拉框 绑定的值
      options: [], //下拉框数据
      parentRes: this.testObj //父级组件传给子组件的值
    };
  },
  //定义方法
  methods: {
    /**
     * 获取所有试卷
     * 可复用
     *
     * */
    getAllTestPaper() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/TestPaper/GetAllTestPaper").then(function(res) {
        //tableData等于回调函数返回的res（值）
        _this.options = res.data;
      });
    },
    /**
     *选择信息
     * */
    setInfo(v) {
      console.log(v);
      let _this = this;
      console.log(_this.parentRes);
      // testChange 是在父组件on监听的方法  第二个参数 v 是需要传的值
      _this.$emit("testChange", v);
    }
  },
  created() {
    let _this = this;
    _this.getAllTestPaper();
  }
};
</script>
<style lang="less" scoped>
#testDrownBox-testSetter {
  .el-select {
    width: 100%;
  }
}
</style>
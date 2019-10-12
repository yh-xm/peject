<template>
  <div id="testDrownBox-testSetter">
    <el-select
      filterable
      default-first-option
      v-model="tpId"
      placeholder="请选择试卷"
      @change="setInfo"
      size="small"
    >
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
    testObj: Object //声明父级组件传过来的值 它是啥样的 类型是啥样的 默认值啊
  },
  data() {
    return {
      tpId: "", //下拉框 绑定的值
      options: [] //下拉框数据
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
      _this.axios.get("/api/TestPaper/GetAllTestPaper").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
          // console.log(res.data);
          _this.options = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    /**
     *选择信息
     * */
    setInfo(v) {
      // childByValue 是在父组件on监听的方法
      //第二个参数 v 是需要传的值
      let _this = this;
      console.log(v);
      console.log(_this.tpId);
      // _this.$emit("childByValue", v);
      // _this.$emit("testChange",$event.target.tpId);
    }
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // }
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
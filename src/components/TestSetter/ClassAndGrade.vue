<template>
  <div id="testDrownBox-testSetter">
    <div class="seleBox">
      <div class="seleName">班级</div>
      <el-select v-model="classId" placeholder="请选择" size="small" @change="setClass">
        <el-option
          v-for="item in options"
          :key="item.classId"
          :label="item.className"
          :value="item.classId"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [], //下拉框数组
      classId: "" //下拉框绑定值
    };
  },
  //定义方法
  methods: {
    /**
     * 获取所有班级信息
     * 可复用
     *
     * */

    getAllClass() {
      // 发送get请求
      let _this = this; //保存this对象
      _this.axios.get("/api/Class/GetAllClass").then(
        function(res) {
          //tableData等于回调函数返回的res（值）
        //   console.log(res);
          _this.options = res.data;
        },
        function() {
          console.log("数据请求失败处理");
        }
      );
    },
    /**
     * 选择班级信息
     *
     * */
    setClass(val){
      // console.log(val)
     this.$emit("getGrade",val);


    }
  },
  created() {
    let _this = this;
    _this.getAllClass();
  }
};
</script>
<style lang="less" scoped>
#testDrownBox-testSetter {
  .seleBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .seleName {
      flex: none;
      text-align: right;
      margin-right: 15px;
      color: #606266;
      width: 70px;
      font-size: 13px;
      line-height: 30px;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
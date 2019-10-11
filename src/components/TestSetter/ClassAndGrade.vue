<template>
  <div id="testDrownBox-testSetter">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="班级" prop="classId" size="small">
        <el-select v-model="ruleForm.classId" placeholder="请选择班级" @change="setClass">
          <el-option
            v-for="item in options"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props:{
    parentRes2:Number,
    required:true
  },
  data() {
    
    return {
      ruleForm: {
        classId: "" //表单绑定的值
      },
      options: [] //下拉框数组
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
    setClass(v) {
      console.log(v);
      let _this = this;
      //childByValue2是父组件on监听子组件传过去的值
      //第二个参数 v 是子组件传到父组件的值 
      _this.$emit("childByValue2",v);
    }
  },
  created() {
    let _this = this;
    _this.getAllClass();
  },
  // updated(){
  //   let _this = this;
  //   // console.log(_this.parentRes2);
  //   _this.ruleForm.classId = _this.parentRes2;
  //   console.log(_this.ruleForm.classId)
  // }
};
</script>
<style lang="less" scoped>
#testDrownBox-testSetter {
  .el-select {
    width: 100%;
  }
}
</style>
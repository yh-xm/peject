<template>
  <div id="testDrownBox-testSetter">
    <el-form :model="classDropFrom" ref="classDropFrom" label-width="100px" class="demo-classDropFrom">
      <el-form-item label="班级" prop="classId" size="small">
        <el-select v-model="classDropFrom.classId" placeholder="请选择班级" @change="setClass">
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
  data() {
    
    return {
      classDropFrom: {
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
    },
/**
 * 清空表单赋值
 * resetFields()是element的重置表单方法
 * ref 加在子组件上，用this.$refs.（ref值） 获取到的是组件实例，
 * 可以使用组件的所有方法
 * 在使用方法的时候直接this.$refs.（ref值）.方法（） 就可以使用了
 * 
 * */ 
    classFun(formName) {
      console.log(formName);
        this.$refs[formName].resetFields();
      }
  },
  created() {
    let _this = this;
    _this.getAllClass();
  },
};
</script>
<style lang="less" scoped>
#testDrownBox-testSetter {
  .el-select {
    width: 100%;
  }
}
</style>
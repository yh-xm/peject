<template>
  <div id="testDrownBox-testSetter">
    子组件:{{parentRes}}
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="试卷" prop="tpId" size="small">
        <el-select v-model="ruleForm.tpId" placeholder="请选择试卷" @change="setInfo" :title="parentRes">
          <el-option
            v-for="item in options"
            :key="item.tpId"
            :label="item.tpTitle"
            :value="item.tpId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">设置</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
export default {
  //接受父组件的值
  props:{
    parentRes:Number,
    required:true
  },
  data() {
    return {
      ruleForm: {
        tpId: "" //表单绑定的值
      },
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
      // console.log(v);
      let _this = this;
      _this.$emit('childByValue',v);
    }
  },
  created() {
    let _this = this;
    _this.getAllTestPaper();
  },
  updated(){
    let _this = this;
    console.log(this.parentRes);
    // if(_this.required != true){
      _this.ruleForm.tpId = _this.parentRes;
    // }
    
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
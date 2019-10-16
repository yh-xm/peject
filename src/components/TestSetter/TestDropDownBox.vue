<template>
  <div id="testDrownBox-testSetter">
    <el-select
      size="small"
      v-model="tpId"
      filterable
      placeholder="请选择"
      ref="txtTest"
      @change="setInfo"
    >
      <el-option :key="0" label="请选择试卷" :value="0" disabled></el-option>
      <el-option
        v-for="item in options"
        :key="item.tpId"
        :label="item.tpTitle"
        :value="item.tpId"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "TestDropDownBox",
  model: {
    prop: "testSele", //班级对象，使用v-model，给这个属性赋值
    event: "change" //触发事件，名称可自定义，作用：触发这个事件，将事件的值传递给prop属性
  },
  props: {
    //组件的属性,在父组件里，可以使用v-bind赋值，如果在model有定义使用v-model赋值
    testSele: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      options: [], //所有试卷
      tpId: undefined, //试卷编号
    };
  },
  watch: {
    //监听tpId的变化，从而改变当前选项
    "testSele.tpId": function(value, old) {
      this.tpId = value;
    }
  },
  methods: {
    getTset() {
      var _this = this;
      _this.$get("/api/TestPaper/GetAllTestPaper").then(res => {
        _this.options = res.map(value => {
          return {
            tpId: value.tpId,
            tpTitle: value.tpTitle
          };
        });
        //等待绑定的数据渲染后，重新改变当前选中的值
        _this.$nextTick(() => {
          //使用v-model传进来的值，表示当前选中的项
          _this.tpId = _this.testSele.tpId;
        });
      });
    },
    /**
     * 选项框改变事件，改变之后传给v-model绑定的对象
     */
    setInfo() {
      var _this = this;
      
      var testChild = _this.options.find(p => p.tpId == _this.tpId);
      if (!testChild) {
        testChild = { testChild: 0, tpTitle: "请选择课程" };
      } else {
        //深度拷贝副本,目的防止被外界改变
        testChild = JSON.parse(JSON.stringify(testChild));
      }
      _this.$emit("change",testChild);
    }
  },
  created() {
    this.getTset();
  }
};
</script>
<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>
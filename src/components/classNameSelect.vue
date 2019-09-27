<template>
  <div>
    <el-select v-model="className" @change="getClassName(options,className)" placeholder="请选择" >
      <el-option
        v-for="item in options"
        :key="item.classId"
        :value="item.className">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    name: 'sltopn',
    data() {
      return {
        options:[],
        className:"",
      }
    },
    methods: {
      
    },
    props: {
      
    },
    methods:{
      public(){
        var _this = this;
      _this.axios.get("api/Class/GetAllClass").then(r => {
      _this.options = r.data;
      _this.className=r.data[0].className
      // console.log(r.data)
        });
      },
      getClassName(res,name){
        // console.log(res+name)
      }
      //初始话下拉框的值
      //远程请求回来的数据
     /* this.$fetch(this.url)
        .then((response) => {
          this.options=this._dataTransform(response);
        })*/
  },
  created(){
    this.public()
  }
  }
</script>
<style lang="less" scoped>
/deep/.el-table_1_column_5,
/deep/.el-table_1_column_1,
/deep/.el-table_1_column_6,
/deep/.el-table_1_column_8 {
  text-align: center;
}
</style>
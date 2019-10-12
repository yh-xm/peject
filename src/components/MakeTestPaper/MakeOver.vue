<!--
表格组件

  引用 import MakeOver 
  from "@/components/MakeTestPaper/MakeOver"; 
 注册    components:{MakeOver},
-->
<template>
  <div id="MakeOver">
    <div class="content-make">
      <div class="table-content">
        {{title}}
        <table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <th>科目</th>
            <th>总分</th>
            <th>选择题</th>
            <th>填空题</th>
            <th>问答题</th>
          </tr>
          <tr>
            <td>{{tpCourseName}}</td>
            <td>
              <el-tag type="danger" effect="dark" size="small">{{sumSoce}}`</el-tag>
            </td>
            <td>
              <el-tag type="danger" effect="dark" size="small">{{pageInfo[0].nowScroe}}`</el-tag>
            </td>
            <td>
              <el-tag type="danger" effect="dark" size="small">{{pageInfo[1].nowScroe}}`</el-tag>
            </td>
            <td>
              <el-tag type="danger" effect="dark" size="small">{{pageInfo[2].nowScroe}}`</el-tag>
            </td>
          </tr>
          <tr><td colspan="5"><slot name="preActive" ></slot></td></tr>
        </table>
      </div>
     
    </div>
  </div>
</template>
<script>
export default {
  props: {
    //组件的属性,在父组件里，可以使用v-bind赋值，如果在model有定义使用v-model赋值
    AllPageInfo: {
      required: true,
      type: Array
    },
    testInfo: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      title: "", //测试科目
      pageInfo:[],
      tpCourseName:""
    };
  },
  computed: {
    /**
     * 计算总分
     * {Array} pageInfo 试卷信息
     * {Number} nowScroe 每种题目类型总分
     * @return {Number}  sum 所有题目类型总分
     */
    sumSoce() {
      var _this = this;
      var sum = 0;
    sum=_this.pageInfo.reduce((prev,cur)=>{return prev + cur.nowScroe},0)
      return sum ;
    }
  },
  methods: {
    getPageInfo() {
      var that = this;
      that.title = that.testInfo.tpTitle
      that.tpCourseName =  that.testInfo.tpCourseName
      that.pageInfo = that.AllPageInfo
    }
  },
  created() {
    //获取试卷信息
    this.getPageInfo()
  }
};
</script>
<style lang="less" scoped>
#MakeOver {
  text-align: center;
  .content-make {

    margin: 0px auto;
    .title {
      display: block;
      margin-top: 50px;
      margin-bottom: 20px;
    }

     .table-content {
    width: 90%;
    margin: 30px auto;
    text-align: center;
    table {
      width: 80%;
      height: 200px;
      margin: 5px auto;
      border: 1px solid #ccc;
    }
  }
  }
}
</style>
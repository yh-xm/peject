<template>
  <div id="MultipleChoice">
    <div class="Mult-Content">
      <el-form
        :model="AddMultipleChoice"
        ref="AddMultipleChoice"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="title"
          label="题干"
          :rules="[
      { required: true, message: '请输入题干', trigger: 'blur' }
    ]"
        >
          <el-input type="textarea" v-model="AddMultipleChoice.title" :rows="1"></el-input>
        </el-form-item>

        <el-form-item
          v-for="(domain, index) in AddMultipleChoice.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-checkbox-group
            v-model="AddMultipleChoice.checked"
            :min="0"
            :max="2"
            @change="change"
          >
            <el-checkbox :label="domain.options" :key="index"></el-checkbox>
          </el-checkbox-group>

          <el-input v-model="domain.value"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click.prevent="removeDomain(domain)"
          ></el-button>
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="AddMultipleChoice.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('AddMultipleChoice')">重置</el-button>
          <el-button type="info" round @click="addDomain">新增选项</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('AddMultipleChoice')"
          >保存题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      AddMultipleChoice: {
        //表单
        checked: [], //选中的多选按钮
        onum: 2, //默认分数
        nowAdd: 4, //默认添加个数
        domains: [
          
        ], //选项
        optionsActive: ["A、", "B、", "C、", "D、", "E、"], //对应字母
        title: "" //题目
      }
    };
  },
  methods: {
    /**
     * 重置表单
     * @param {object} formName 点击当前表单对象
     *
     */
    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields();
    },
    /**
     * 删除选项
     * @param {object} item 点击当前的选项对象
     */
    removeDomain(item) {
      var _this = this;
      var index = _this.AddMultipleChoice.domains.indexOf(item);
      if (_this.AddMultipleChoice.domains.length > 2) {
        //选项个数大于2才执行删除
        if (index !== -1) {
          _this.AddMultipleChoice.domains.splice(index, 1); //删除选项
          _this.AddMultipleChoice.nowAdd--; //选项个数减少
          for (let i in _this.AddMultipleChoice.domains) {
            _this.AddMultipleChoice.domains[i].options =
              _this.AddMultipleChoice.optionsActive[i];
            //重定义选项
          }
        }
      }
    },
    /**
     * 添加选项
     *
     */
    addDomain() {
      if (this.AddMultipleChoice.nowAdd < 5) {
        //选项个数小于5执行添加
        this.AddMultipleChoice.nowAdd++;
        this.AddMultipleChoice.domains.push({
          value: "",
          options: this.AddMultipleChoice.optionsActive[
            this.AddMultipleChoice.nowAdd - 1
          ]
        });
      }
    },
    /**
     * 提交表单，添加题目
     * @param {object} formName 点击当前表单对象
     *  {Array} AddMultipleChoice.checked 当前选中的选项数组
     *  {Array} this.$refs[formName].model.domains 当前的选项数组
     */ 
    submitForm(formName) {
      //提交表单
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          var tpqPaperId = sessionStorage.testPaperId;
          var tpqScore = _this.$refs[formName].model.onum;
          var title = _this.$refs[formName].model.title;
          var arrs = [];
          for (const key in _this.$refs[formName].model.domains) {
            if (
              _this.$refs[formName].model.domains[key].options ==
                _this.AddMultipleChoice.checked[        //判断选中项
                  _this.AddMultipleChoice.checked.length - 1  
                ] ||
              _this.$refs[formName].model.domains[key].options ==
                _this.AddMultipleChoice.checked[0]
            ) {
              arrs.push({
                cqOption: _this.$refs[formName].model.domains[key].value,
                cqIsRight: true  //选中为true
              });
            } else {
              arrs.push({
                cqOption: _this.$refs[formName].model.domains[key].value,
                cqIsRight: false //没选中为fasle
              });
            }
          }
          _this.axios
            .post(`/api/TestPaper/AddQuestionToTestPaper`, {
              tpqPaperId: tpqPaperId, //试卷主键编号
              tpqScore: tpqScore, //分值
              tpqQuestion: {
                questionTitle: title, //题目的标题
                questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
                chooseQuestion: arrs
              }
            })
            .then(res => {
              if (res.data.message == "添加成功") {
                _this.$parent.$parent.pageInfo[0].bodys.push(res.data.data); //改变父组件的问答题的试卷信息
                _this.$parent.$parent.pageInfo[0].nowAdd += 1; //改变父组件的问答题的问题个数
                _this.$parent.$parent.pageInfo[0].nowScroe += parseInt(
                  res.data.data.tpqScore
                ); //改变父组件的问答题的分数
                _this.$parent.$parent.pageInfo = [
                  ..._this.$parent.$parent.pageInfo
                ]; //解构渲染
                _this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                _this.init();
                _this.resetForm('AddMultipleChoice')
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
     /**
     * 初始化表单
     *  {Array} AddMultipleChoice.checked 当前选中的选项数组
     *  {Array} this.$refs[formName].model.domains 当前的选项数组
     */ 
    init(){
      var _this = this;
      _this.AddMultipleChoice.checked=[];
         _this.AddMultipleChoice.domains=[];
      for(let i=0;i<4;i++){
         _this.AddMultipleChoice.domains.push({
           value:"",
           options:_this.AddMultipleChoice.optionsActive[i]
         })
      }
     
    },
        /**
     * 多选改变监听
     * @param {Array} v 点击当前选中多选
     *
     */
    change(v) {
          var _this = this;
      //多选变化
      _this.AddMultipleChoice.checked = v;
      _this.AddMultipleChoice.checked = [..._this.AddMultipleChoice.checked];
    }
  },
  created() {
    this.init(); //初始化选项
  }
};
</script>
<style lang="less" scoped>
#MultipleChoice {
  display: flex;
  margin-top: 20px;
  .Mult-Content {
    width: 95%;
    margin: auto;
    .el-form-item {
      /deep/ .el-form-item__content {
        display: flex;
        margin-left: 40px !important;
        /deep/ .el-input {
          margin-right: auto;
          margin-right: 12px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
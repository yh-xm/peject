<!--
添加选择题组件

  引用 import AddMultipleChoice 
  from "@/components/MakeTestPaper/SetPageInfo/AddMultipleChoice"; //添加选择题组件

   注册    components:{AddMultipleChoice},
     当标签使用    
          <add-multiple-choice 
          @addMultipleChoice="addQuestion" 添加题目时触发的事件
           />
-->
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

        <el-form-item v-for="(domain, index) in AddMultipleChoice.domains" :key="domain.key">
          <el-checkbox-group v-model="AddMultipleChoice.checked" :min="0" :max="2" @change="change">
            <el-checkbox :label="domain.options" :key="index" :checked="domain.cqIsRight"></el-checkbox>
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
        domains: [], //选项
        optionsActive: ["A、", "B、", "C、", "D、", "E、", "F、"], //对应字母
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
      var _this = this;
      if (
        _this.AddMultipleChoice.domains.length <
        _this.AddMultipleChoice.optionsActive.length
      ) {
        _this.AddMultipleChoice.domains.push({
          value: "",
          options:
            _this.AddMultipleChoice.optionsActive[
              _this.AddMultipleChoice.domains.length
            ]
        });
      } else {
        _this.$msg(_this, -1, "不能添加选项了！");
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
      _this.$nextTick(function() {
        _this.$refs[formName].validate(valid => {
          console.log(_this.$refs[formName].model.domains);
          if (valid) {
            var tpqPaperId = sessionStorage.testPaperId; //获取试卷ID
            var tpqScore = _this.$refs[formName].model.onum; //获取表单的分数
            var title = _this.$refs[formName].model.title; //获取题目
            var arrs = [];
            var newAddMultipleChoice = _this.$refs[formName].model.domains.map(
              v => {
                if (
                  v.options ==
                    _this.AddMultipleChoice.checked[ //判断选中项 是不是多选中的其中之一
                      _this.AddMultipleChoice.checked.length - 1
                    ] ||
                  v.options == _this.AddMultipleChoice.checked[0]
                ) {
                  return {
                    cqOption: v.value, //选项的值
                    cqIsRight: true //选中为true
                  };
                } else {
                  return {
                    cqOption: v.value, //选项的值
                    cqIsRight: false //没选中为fasle
                  };
                }
              }
            );

            _this.axios
              .post(`/api/TestPaper/AddQuestionToTestPaper`, {
                tpqPaperId: tpqPaperId, //试卷主键编号
                tpqScore: tpqScore, //分值
                tpqQuestion: {
                  questionTitle: title, //题目的标题
                  questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
                  chooseQuestion: newAddMultipleChoice
                }
              })
              .then(res => {
                if (res.data.message == "添加成功") {
                  var data = {
                    bodys: res.data.data,
                    questionTypeId: 1
                  };
                  _this.$emit("addMultipleChoice", data); //通知父组件
                  _this.$msg(_this, 1, "添加成功!");
                  _this.init(); //初始化
                  _this.resetForm("AddMultipleChoice");
                } else {
                  _this.$msg(_this, -1, res.data.message);
                }
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    /**
     * 初始化表单
     *  {Array} AddMultipleChoice.checked 当前选中的选项数组
     *  {Array} this.$refs[formName].model.domains 当前的选项数组
     */
    init() {
      var _this = this;
      _this.AddMultipleChoice.checked = []; //初始化多选
      _this.AddMultipleChoice.domains = [];
      for (let i = 0; i < 4; i++) {
        //初始化4个选项
        _this.AddMultipleChoice.domains.push({
          value: "",
          options: _this.AddMultipleChoice.optionsActive[i],
          cqIsRight: false
        });
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
    var _this = this;
    _this.init(); //初始化选项
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
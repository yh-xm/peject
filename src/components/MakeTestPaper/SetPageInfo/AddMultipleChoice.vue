<!--
添加选择题组件

  引用 import AddMultipleChoice 
  from "@/components/MakeTestPaper/SetPageInfo/AddMultipleChoice"; //添加选择题组件

   注册    components:{addMultipleChoice},
     当标签使用    
          <add-multiple-choice 
          @addMultipleChoice="addQuestion" 添加题目时触发的事件
           />
-->
<template>
  <div id="MultipleChoice">
    <div class="mult-content">
      <el-form
        :model="addMultipleChoice"
        ref="addMultipleChoice"
        class="demo-dynamic"
      >
        <el-form-item
          prop="title"
          :label="$t('test.makep13')"
          :rules="[
      { required: true, message: '请输入题干', trigger: 'blur' }
    ]"
        >
          <el-input type="textarea" v-model="addMultipleChoice.title" :rows="1"></el-input>
        </el-form-item>

        <el-form-item v-for="(domain, index) in addMultipleChoice.domains" :key="domain.key">
          <el-checkbox-group v-model="addMultipleChoice.checked" :min="0" :max="2" @change="change">
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
        <el-form-item :label="$t('test.makep15')">
          <el-input-number v-model="addMultipleChoice.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('addMultipleChoice')">{{$t('btn.r')}}</el-button>
          <el-button type="info" round @click="addDomain">{{$t('btn.addjs')}}</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('addMultipleChoice')"
          >{{$t('btn.s')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addMultipleChoice: {
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
      var index = _this.addMultipleChoice.domains.indexOf(item);
      if (_this.addMultipleChoice.domains.length > 2) {
        //选项个数大于2才执行删除
        if (index !== -1) {
          _this.addMultipleChoice.domains.splice(index, 1); //删除选项
          _this.addMultipleChoice.nowAdd--; //选项个数减少
          for (let i in _this.addMultipleChoice.domains) {
            _this.addMultipleChoice.domains[i].options =
              _this.addMultipleChoice.optionsActive[i];
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
        _this.addMultipleChoice.domains.length <
        _this.addMultipleChoice.optionsActive.length
      ) {
        _this.addMultipleChoice.domains.push({
          value: "",
          options:
            _this.addMultipleChoice.optionsActive[
              _this.addMultipleChoice.domains.length
            ]
        });
      }
    },
    /**
     * 提交表单，添加题目
     * @param {object} formName 点击当前表单对象
     *  {Array} addMultipleChoice.checked 当前选中的选项数组
     *  {Array} this.$refs[formName].model.domains 当前的选项数组
     */
    submitForm(formName) {
      //提交表单
      var _this = this;
      _this.$nextTick(function() {
        _this.$refs[formName].validate(valid => {
          var hasValue=0;
         _this.$refs[formName].model.domains.map(v=>{
            if(v.value!=""){
              return hasValue++;
            }else{
              return null;
            }
          })
          if (hasValue== _this.$refs[formName].model.domains.length&&_this.addMultipleChoice.checked.length!=0) {
            var tpqPaperId = sessionStorage.testPaperId; //获取试卷ID
            var tpqScore = _this.$refs[formName].model.onum; //获取表单的分数
            var title = _this.$refs[formName].model.title; //获取题目
            var newaddMultipleChoice = _this.$refs[formName].model.domains.map(
              v => {
                if (
                  v.options ==
                    _this.addMultipleChoice.checked[ //判断选中项 是不是多选中的其中之一
                      _this.addMultipleChoice.checked.length - 1
                    ] ||
                  v.options == _this.addMultipleChoice.checked[0]
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

            _this.$post(`/api/TestPaper/AddQuestionToTestPaper`, {
                tpqPaperId: tpqPaperId, //试卷主键编号
                tpqScore: tpqScore, //分值
                tpqQuestion: {
                  questionTitle: title, //题目的标题
                  questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
                  chooseQuestion: newaddMultipleChoice
                }
              })
              .then(res => {
                if (res.message == "添加成功") {
                  var data = {
                    bodys: res.data,
                    questionTypeId: 1
                  };
                  _this.$emit("addMultipleChoice", data); //通知父组件
                      _this.$msg(_this, 1,_this.$t("mesTips.addSuccess"));
                  _this.init(); //初始化
                  _this.resetForm("addMultipleChoice");
                } else {
                  _this.$msg(_this,-1,_this.$t("mesTips.systemError"))
                }
              });
          } else {
 _this.$msg(_this,-1,_this.$t("mesTips.undefindData"))
            return false;
          }
        });
      });
    },
    /**
     * 初始化表单
     *  {Array} addMultipleChoice.checked 当前选中的选项数组
     *  {Array} this.$refs[formName].model.domains 当前的选项数组
     */
    init() {
      var _this = this;
      _this.addMultipleChoice.checked = []; //初始化多选
      _this.addMultipleChoice.domains = [];
      for (let i = 0; i < 4; i++) {
        //初始化4个选项
        _this.addMultipleChoice.domains.push({
          value: "",
          options: _this.addMultipleChoice.optionsActive[i],
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
      _this.addMultipleChoice.checked = v;
      _this.addMultipleChoice.checked = [..._this.addMultipleChoice.checked];
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
  .mult-content {
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
        .el-input-number__decrease{
          left: 15px;
        }
        .el-input-number__increase{
          left: 150px;
        }
      }
    }
  }
}
</style>
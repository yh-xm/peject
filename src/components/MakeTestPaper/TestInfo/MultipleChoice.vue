<template>
  <div id="MultipleChoice">
    <div class="Mult-Content">
      <el-form
        :model="dynamicValidateFormThird"
        ref="dynamicValidateFormThird"
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
          <el-input type="textarea" v-model="dynamicValidateFormThird.title" :rows="1"></el-input>
        </el-form-item>

        <el-form-item
          v-for="(domain, index) in dynamicValidateFormThird.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-checkbox-group
            v-model="dynamicValidateFormThird.checked"
            :min="0"
            :max="2"
            @change="fnchange"
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
          <el-input-number v-model="dynamicValidateFormThird.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('dynamicValidateFormThird')">重置</el-button>
          <el-button type="info" round @click="addDomain">新增选项</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('dynamicValidateFormThird')"
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
      dynamicValidateFormThird: {
        //表单
        checked: [], //选中的多选按钮
        onum: 2, //默认分数
        nowAdd: 4, //默认添加个数
        domains: [], //选项
        optionsActive: ["A、", "B、", "C、", "D、", "E、"], //对应字母
        title: "" //题目
      }
    };
  },
  methods: {
    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      //删除选项
      var index = this.dynamicValidateFormThird.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateFormThird.domains.splice(index, 1); //删除选项
        this.dynamicValidateFormThird.nowAdd--; //选项个数减少
        for (let i in this.dynamicValidateFormThird.domains) {
          this.dynamicValidateFormThird.domains[
            i
          ].options = this.dynamicValidateFormThird.optionsActive[i];
          //选中
        }
      }
    },
    addDomain() {
      //添加选项
      if (this.dynamicValidateFormThird.nowAdd < 5) {
        this.dynamicValidateFormThird.nowAdd++;
        this.dynamicValidateFormThird.domains.push({
          value: "",
          options: this.dynamicValidateFormThird.optionsActive[
            this.dynamicValidateFormThird.nowAdd - 1
          ]
        });
      }
    },
    fninit() {
      //重置
      var arr = [
        {
          value: "",
          options: "A、"
        },
        {
          value: "",
          options: "B、"
        },
        {
          value: "",
          options: "C、"
        },
        {
          value: "",
          options: "D、"
        }
      ];
      this.dynamicValidateFormThird.domains = arr;
      this.dynamicValidateFormThird.checked = [];
      this.dynamicValidateFormThird.nowAdd = 4;
      this.dynamicValidateFormThird.title = "";
    },
    submitForm(formName) {
      //提交表单
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var tpqPaperId = sessionStorage.testPaperId;
          var tpqScore = this.$refs[formName].model.onum;
          var title = this.$refs[formName].model.title;
          var arrs = [];
          for (const key in this.$refs[formName].model.domains) {
            if (
              this.$refs[formName].model.domains[key].options ==
                this.dynamicValidateFormThird.checked[
                  this.dynamicValidateFormThird.checked.length - 1
                ] ||
              this.$refs[formName].model.domains[key].options ==
                this.dynamicValidateFormThird.checked[0]
            ) {
              arrs.push({
                cqOption: this.$refs[formName].model.domains[key].value,
                cqIsRight: true
              });
            } else {
              arrs.push({
                cqOption: this.$refs[formName].model.domains[key].value,
                cqIsRight: false
              });
            }
          }
          this.axios
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
                res.data.data.tpqQuestion.tpqId = res.data.data.tpqId; //传递题目Id
                res.data.data.tpqQuestion.score = parseInt(  //传递题目分数
                  _this.dynamicValidateFormThird.onum
                );
              
                _this.$parent.pageInfo[0].bodys.push(res.data.data.tpqQuestion);  //题目信息
                _this.$parent.pageInfo[0].nowAdd =
                  parseInt(_this.$parent.pageInfo[0].nowAdd) + 1;//题目个数
                _this.$parent.pageInfo[0].nowScroe =
                  parseInt(_this.$parent.pageInfo[0].nowScroe) +
                  parseInt(_this.dynamicValidateFormThird.onum);
                _this.$parent.pageInfo = [..._this.$parent.pageInfo];//题目分数
                _this.fninit();
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fnchange(v) {
      //多选变化
      this.dynamicValidateFormThird.checked = v;
      this.dynamicValidateFormThird.checked = [
        ...this.dynamicValidateFormThird.checked
      ];
    }
  },
  created() {
    this.fninit();
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
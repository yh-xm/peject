<template>
  <div id="MultipleChoice">
    <div class="Mult-Content">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
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
          <el-input type="textarea" v-model="dynamicValidateForm.title" :rows="1"></el-input>
        </el-form-item>

        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-checkbox-group
            v-model="dynamicValidateForm.checked"
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
          <el-input-number v-model="dynamicValidateForm.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('dynamicValidateForm')">重置</el-button>
          <el-button type="info" round @click="addDomain">新增选项</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('dynamicValidateForm')"
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
      dynamicValidateForm: {
        checked: [],
        onum: 2,
        nowAdd: 4,
        domains: [],
        optionsActive: ["A、", "B、", "C、", "D、", "E、"],
        title: ""
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
        this.dynamicValidateForm.nowAdd--;
        for (let i in this.dynamicValidateForm.domains) {
          this.dynamicValidateForm.domains[
            i
          ].options = this.dynamicValidateForm.optionsActive[i];
        }
      }
    },
    addDomain() {
      if (this.dynamicValidateForm.nowAdd < 5) {
        this.dynamicValidateForm.nowAdd++;
        this.dynamicValidateForm.domains.push({
          value: "",
          options: this.dynamicValidateForm.optionsActive[
            this.dynamicValidateForm.nowAdd - 1
          ]
        });
      }
    },
    fninit() {
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
      this.dynamicValidateForm.domains = arr;
      this.dynamicValidateForm.checked = [];
      this.dynamicValidateForm.nowAdd = 4;
      this.dynamicValidateForm.title = "";
      // this.resetForm("dynamicValidateForm");
    },
    submitForm(formName) {
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
              this.dynamicValidateForm.checked[this.dynamicValidateForm.checked.length-1]
              ||    this.$refs[formName].model.domains[key].options ==
              this.dynamicValidateForm.checked[0]
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
              console.log(res);
              if (res.data.message == "添加成功") {
                _this.$parent.pageInfo[0].bodys.push(res.data.data.tpqQuestion);
                _this.$parent.pageInfo[0].nowAdd =
                  parseInt(_this.$parent.pageInfo[0].nowAdd) + 1;
                _this.$parent.pageInfo[0].nowScroe =
                  parseInt(_this.$parent.pageInfo[0].nowScroe) +
                  parseInt(_this.dynamicValidateForm.onum);
                _this.$parent.pageInfo = [..._this.$parent.pageInfo];
                _this.fninit();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fnchange(v) {
      this.dynamicValidateForm.checked = v;
      this.dynamicValidateForm.checked = [...this.dynamicValidateForm.checked];
      console.log(v);
    }
  },
  created() {
    this.fninit();
  }
};
</script>
<style lang="less" scoped>
#MultipleChoice {
  border: blue solid 1px;
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
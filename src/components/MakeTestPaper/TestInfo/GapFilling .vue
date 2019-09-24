<template>
  <div id="GapFilling">
    <div class="gapContent">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="题干">
          <el-button round icon="el-icon-document-checked" @click="addDomain" size="small">插入填空</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            v-model="dynamicValidateForm.title"
            :rows="1"
            id="textarea"
            @input="fnchangeTextarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-tag type="danger" effect="dark" size="mini">{{index+1}}</el-tag>

          <el-input v-model="domain.value" :placeholder="'请输入第'+(index+1)+'个空的答案'"></el-input>
          <el-input-number v-model="domain.num" :min="1" :max="10" :key="index"></el-input-number>
        </el-form-item>
        <el-form-item label="题目预览">
          <el-row v-for="(item,index) in dynamicValidateForm.title" :key="index">
            <span v-if="item!='＿'">{{item}}{{index}}</span>

            <el-input v-if="item=='＿'" :key="index"></el-input>
            <!-- <span>({{dynamicValidateForm.domains[index].num}})</span> -->
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button round @click="resetForm('dynamicValidateForm')" size="small">重置</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('dynamicValidateForm')"
            size="small"
          >新增题目</el-button>
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
        domains: [],
        title: ""
      },
      IndexArr: []
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        num: "2"
      });
      var index = this.getCursortPosition(document.getElementById("textarea"));
      this.dynamicValidateForm.title = this.dynamicValidateForm.title.split("");
      this.dynamicValidateForm.title.splice(index, 0, "＿");
      this.dynamicValidateForm.title = this.dynamicValidateForm.title.join("");
    },
    getCursortPosition(element) {
      var CaretPos = 0;
      if (document.selection) {
        //支持IE
        element.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart("character", -element.value.length);
        CaretPos = Sel.text.length;
      } else if (element.selectionStart || element.selectionStart == "0")
        //支持firefox
        CaretPos = element.selectionStart;
      return CaretPos;
    },
    fnchangeTextarea(e) {
      var textArr = this.dynamicValidateForm.title.split("");
      var nowline = 0;
      for (let i in textArr) {
        if (textArr[i] == "＿") {
          nowline++;
        }
      }
      this.dynamicValidateForm.domains = [];
      for (let i = 0; i < nowline; i++) {
        this.dynamicValidateForm.domains.push({
          value: "",
          num: "2"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
#GapFilling {
  border: blue solid 1px;
  display: flex;
  margin-top: 20px;
  .gapContent {
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
        .el-input__inner {
          border: none;
          border-bottom: 1px solid #ccc;
          border-radius: 0;
        }
        .el-input-number {
          border: 1px solid #ccc;
          border-radius: 8px;
          .el-input__inner {
            border-bottom: none;
            padding-left: 40px;
            padding-right: 64px;
          }
        }
      }
      .el-tag {
        border-radius: 50%;
        margin-top: 12px;
      }
    }
  }
}
</style>
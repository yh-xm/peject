<!--
添加问答题组件

  引用 import addEssayQuestion 
  from "@/components/MakeTestPaper/SetPageInfo/AddEssayQuestion"; //添加选择题组件

   注册    components:{AddEssayQuestion},
     当标签使用    
          <add-essay-question
          @addEssayQuestion="addQuestion" 添加题目时触发的事件
           />
-->
<template>
  <div id="EssayQuestion">
    <div class="essat-content">
      <!-- 表单 -->
      <el-form
        :model="addEssayQuestion"
        ref="addEssayQuestion"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item prop="title" :label="$t('test.makep13')">
          <!-- 填写题目 -->
          <el-input type="textarea" v-model="addEssayQuestion.title" :rows="1"></el-input>
        </el-form-item>
        <!-- 参考答案 -->
        <el-form-item :label="$t('test.makep14')">
          <editor v-model="addEssayQuestion.value" ref="editor" />

        </el-form-item>
        <!-- 分值 -->
        <el-form-item :label="$t('test.makep15')">
          <el-input-number v-model="addEssayQuestion.onum" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <!-- 重置 -->
          <el-button round @click="resetForm('addEssayQuestion')">{{$t('btn.r')}}</el-button>
          <!-- 新增题目 -->
          <el-button
            type="primary"
            round
            icon="el-icon-document-checked"
            @click="submitForm('addEssayQuestion')"
          >{{$t('btn.s')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Editor from "./TextEditor";
export default {
  components: {
    Editor
  },
  data() {
    return {
      addEssayQuestion: {
        onum: 5, //默认分数
        value: "", //答案
        title: "" //题目
      }
    };
  },
  methods: {
    /**
     * 重置表单
     * @param {object} formName 当前表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 新增题目
     *  {Number} userId 识别用户Id
     * @param {object} formName 点击当前表单
     *
     */
    submitForm(formName) {
      var _this = this;
      var tpqPaperId = sessionStorage.testPaperId;
      var aqAnswer = _this.$refs[formName].model.value;
      var tpqScore = _this.$refs[formName].model.onum;
      var title = _this.$refs[formName].model.title;
      if ((title != "") & (aqAnswer != "")) {
        _this
          .$post(`/api/TestPaper/AddQuestionToTestPaper`, {
            tpqPaperId: tpqPaperId, //试卷主键编号
            tpqScore: tpqScore, //分值
            tpqQuestion: {
              questionTitle: title, //题目的标题
              questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
              answerQuestion: {
                aqAnswer: aqAnswer //问答题的答案
              }
            }
          })
          .then(res => {
            if (res.message == "添加成功") {
              var data = {
                bodys: res.data,
                questionTypeId: 3
              };
              _this.$emit("addEssayQuestion", data);
              _this.$msg(_this, 1, _this.$t("mesTips.addSuccess"));
              _this.resetForm("addEssayQuestion"); //重置表单
              _this.addEssayQuestion.value = "";
              _this.$refs.editor.content = "";
            } else {
              _this.$msg(_this, -1, _this.$t("mesTips.systemError"));
            }
          });
      } else {
        _this.$msg(_this, -1, _this.$t("mesTips.undefindData"));
      }
    }
  }
};
</script>
<style lang="less" scoped>
#EssayQuestion {
  text-align: left;
}
</style>
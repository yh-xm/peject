<!--
维护选择题组件

  引用  import SetChooseQuestion from 
  "@/components/MakeTestPaper/SetPageInfo/SetPageQusetion/SetChooseQuestion"; 
   注册    components:{SetChooseQuestion},
     当标签使用    
 :AddChooseQuestionList="items" 传入题目信息
:nowIndex="indexs" 传入题号
@setQuestion="setQuestion" 进行维护时触发的方法
 @changeScore="changeScore" 修改分数时触发的方法
-->


<template>
  <div class="MultipleChoice">
    <div class="Mult-Content">
      <!-- 题目编号 -->
      <div class="option-title">{{nowIndex+1}}、</div>
      <div class="option-content">
        <el-form
          :model="nowOption.tpqQuestion"
          ref="dynamicValidateFormfive"
          label-width="100px"
          class="demo-dynamic"
        >
          <!-- 题目 -->
          <el-form-item prop="title">
            <el-input
              type="textarea"
              v-model="nowOption.tpqQuestion.questionTitle"
              :rows="1"
              :disabled="odisabled"
              v-show="!odisabled"
            ></el-input>
            <span v-show="odisabled">
              {{nowOption.tpqQuestion.questionTitle}}
              <el-input-number
                size="small"
                v-model="nowOption.tpqScore"
                :min="1"
                :max="50"
                @change="changeScore"
              ></el-input-number>
            </span>
          </el-form-item>

          <el-form-item
            v-for="(domain, index) in nowOption.tpqQuestion.chooseQuestion"
            :key="domain.key"
          >
            <el-checkbox-group v-model="checked" :min="0" :max="2" @change="checkboxChange">
              {{domain}}
              <el-checkbox
                :label="optionsActive[index]"
                :checked="domain.cqIsRight"
                :key="index"
                :disabled="odisabled"
              ></el-checkbox>
            </el-checkbox-group>

            <el-input v-model="domain.cqOption" :disabled="odisabled"></el-input>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click.prevent="removeOption(index)"
              v-show="oshow"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click.prevent="compile">编辑</el-button>
            <el-row v-show="oshow">
              <el-button round @click.prevent="cancel" size="small">取消</el-button>
              <el-button round @click.prevent="addOption" size="small">新增选项</el-button>
              <el-button type="primary" plain @click.prevent="saveOption" size="small">保存修改</el-button>
              <el-button type="danger" plain @click.prevent="removePageInfoItem" size="small">删除题目</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      odisabled: true, //禁用选项
      oshow: false, //显示
      optionsActive: ["A、", "B、", "C、", "D、", "E、","F、"], //对应字母
      checked: [], //多选信息
      oldOption: [], //克隆题目信息
      nowOption: [], //当前题目信息
      tpqScore: 0 //题目分数
    };
  },
  props: {
    AddChooseQuestionList: Object, //父组件传递的题目信息
    nowIndex: Number //题目编号
  },
  methods: {
    /**
     * 编辑表单
     */
    compile() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
    },
    /**
     * 取消操作
     */
    cancel() {
      var _this = this;
      _this.odisabled = !_this.odisabled;
      _this.oshow = !_this.oshow;
      _this.nowOption = JSON.parse(JSON.stringify(_this.oldOption)); //恢复原来的数据
      _this.checked = [];
      for (let key in _this.nowOption.tpqQuestion.chooseQuestion) {
        //全部不选中
        if (_this.oldOption.tpqQuestion.chooseQuestion[key].cqIsRight == true) {
          //恢复选中的选项
          _this.checked.push(_this.optionsActive[key]);
        }
      }
    },
    /**
     * 添加选项
     */
    addOption() {
      var _this = this;
      if (
        _this.nowOption.tpqQuestion.chooseQuestion.length <
        _this.optionsActive.length //少于固定的选项数组长度
      ) {
        _this.nowOption.tpqQuestion.chooseQuestion.push({
          cqId: 0,
          cqIsRight: false,
          cqOption: ""
        });
      }else{
         _this.$msg(_this, -1, "不能再添加选项了！");
      }
    },
    /**
     * 保存修改
     */
    saveOption() {
      var nowOption = this.nowOption;
      var _this = this;
      var value = _this.AddChooseQuestionList.tpqId;//获取题目Id
      _this.axios
        .post(`/api/TestPaper/ModifyQuestion?paperQuestionId=` + value, {
          //—修改选择题
          questionId: nowOption.tpqQuestion.questionId, //题目Id
          questionTitle: nowOption.tpqQuestion.questionTitle, //题目
          questionTypeId: nowOption.tpqQuestion.questionTypeId, //题目类型
          chooseQuestion: nowOption.tpqQuestion.chooseQuestion
        })
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption));
            _this.odisabled = !_this.odisabled; //成功禁用
            _this.oshow = !_this.oshow;
            _this.$msg(_this, 1, res.data.message);
          } else {
            _this.$msg(_this, -1, res.data.message);
          }
        });
    },
    /**
     * 删除选项
     *
     * @param {object} index 当前选项下标
     */
    removeOption(index) {
      this.nowOption.tpqQuestion.chooseQuestion.splice(index, 1);
    },
    /**
     * 删除题目
     *
     *
     */
    removePageInfoItem() {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId=${_this.AddChooseQuestionList.tpqId}` //删除题目
        )
        .then(res => {
          console.log(res);
          if (res.data.message == "删除成功") {
            var data = {
              index: _this.nowIndex, //题号
              questionTypeId: 1, //题目类型
              tpqScore: _this.AddChooseQuestionList.tpqScore //题目分数
            };
            _this.$msg(_this,1, res.data.message)
            _this.$emit("setQuestion", data); //改变父组件的分数
          }else{
                _this.$msg(_this,-1, res.data.message)
              }
        });
    },
    /**
     * 改变多选
     * @param {Array} item 当前选中的多选数组
     *
     */
    checkboxChange(item) {
      var _this =this;
      var arr = [];
      for (const key in _this.optionsActive) {
        if (
          _this.optionsActive[key] == item[0] ||  //多选的2个选项
          _this.optionsActive[key] == item[1]
        ) {
          arr.push(key); 
        }
      }
      for (let key in _this.nowOption.tpqQuestion.chooseQuestion) {
        //全部不选中
        _this.nowOption.tpqQuestion.chooseQuestion[key].cqIsRight = false;
      }
      for (let i = 0; i < arr.length; i++) {
        //选中当前选中的
        _this.nowOption.tpqQuestion.chooseQuestion[arr[i]].cqIsRight = true;
      }
    },
    /**
     * 修改题目分数
     */
    changeScore(v) {
      var _this = this;
      _this.axios
        .post(
          `/api/TestPaper/ModifyScore`,
          {
            tpqId: _this.nowOption.tpqId, //主键编号
            tpqScore: v //要修改的分值
          } //修改题目分值
        )
        .then(res => {
          if (res.data.message == "修改成功") {
            _this.oldOption = JSON.parse(JSON.stringify(_this.nowOption));
            var data = {
              index: 0, //题目所在下标
              fqsScore: v, //分数
              fqIndex: _this.nowIndex //题号
            };
            _this.$msg(_this, 1, "修改成功!");
            _this.$emit("changeScore", data);
          }else{
                _this.$msg(_this,-1, res.data.message)
              }
        });
    },
    /**
     * 初始化
     */
    init() {
      var _this = this;
      _this.oldOption = JSON.parse(JSON.stringify(_this.AddChooseQuestionList)); //克隆信息
      _this.nowOption = _this.AddChooseQuestionList;
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.MultipleChoice {
  display: flex;
  margin-top: 20px;
  .Mult-Content {
    width: 95%;
    margin: auto;
    display: flex;
    .option-content {
      width: 80%;
      .el-form-item {
        /deep/ .el-form-item__content {
          width: 80%;
          display: flex;
          margin-left: 40px !important;
          /deep/ .el-input {
            outline: none;
          }
          /deep/ .el-button {
            border-radius: 20px;
          }
          .el-row {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
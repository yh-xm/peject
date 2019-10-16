  <!--用户角色-->
<template>
  <div id="RoleManage">
    <div slot="header" class="clearfix">
      <el-button icon="el-icon-circle-plus" type="primary" @click="addUsers"> {{$t('btn.addjs')}}</el-button>
      <el-checkbox v-model="checked" @change="canDrag">{{$t("tableName.drag")}}</el-checkbox>
    </div>
    <div class="text item">
      <el-table :data="tableData" stripe style="width: 100%" row-key="userTypeId">
        <el-table-column type="index" width="180"></el-table-column>
        <!-- <el-table-column prop="userTypeId" label="#" width="180"></el-table-column> -->
        <el-table-column prop="userTypeTypeName" :label="$t('tableName.tjs')" width="180"></el-table-column>
        <el-table-column :label="$t('tableName.tm')">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.c')}}</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.disable"
              @click="handleDelete(scope.$index, scope.row)"
              v-has
            >{{$t('btn.d')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  data() {
    return {
      tableData: [],
      rootDepart:"",//用于销毁排序
      checked: true//控制拖拽按钮
    };
  },
  methods: {
    
    apply() {
      //获取所有用
      this.axios.get("api/UserType/GetUserRoles").then(res => {
        // this.axios.get("api/Test/GetTest").then(res => {
        this.tableData = res.data;
      });
    },
    handleEdit(index, row) {
      //修改信息
      var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "Modification";
        var fText2 = "Cancel";
      }else{
         var fText = "修改";
        var fText2 = "取消"; 
      }
      this.$prompt(this.$t('tableName.tjs'), this.$t('tableName.role'), {
        confirmButtonText:fText,
        cancelButtonText:fText2,
        inputPattern: /\S/,
        inputValue: row.userTypeTypeName, //输入框原值
        inputErrorMessage: "内容不能为空"
      })
        .then(({ value }) => {
          this.axios
            .post("/api/UserType/ModifyUserRole", null, {
              params: {
                userRoleName: value,
                id: row.userTypeId
              }
            })
            .then(res => {
              let code = res.data.code; //返回代码
              if (code == 1) {
                this.apply(); //更新后重新渲染
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              }
              if (code == -1) {
                this.$message.error("系统异常");
              }
              if (code == -2) {
                this.$message.error("参数错误");
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
    },
    handleDelete(index, row) {
      //删除信息
           var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "Confirm";
        var fText2 = "Cancel";
        var flag ="Hint"
        var title = "This operation will permanently delete the data. Do you want to continue?"
      }else{
         var fText = "确定";
        var fText2 = "取消";
        var flag ="提示"
        var title = "此操作将永久删除该数据, 是否继续?"
      }
      this.$confirm(title, flag, {
        confirmButtonText: fText,
        cancelButtonText: fText2,
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/api/UserType/RemoveUserRole", null, {
              params: {
                userRoleId: row.userTypeId
              }
            })
            .then(res => {
              let code = res.data.code; //返回代码
              if (code == 1) {
                this.tableData.splice(index, 1);
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log(index);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addUsers() {
       var lang = localStorage.locale;
      if(lang=="en"){
        var fText = "Add";
        var fText2 = "Cancel";
      }else{
         var fText = "添加";
        var fText2 = "取消"; 
      }
      this.$prompt(this.$t("tableName.addnewusers"), this.$t("tableName.userInformation"), {
        confirmButtonText: fText,
        cancelButtonText:fText,
        inputPattern: /\S/,
        inputErrorMessage: "内容不能为空"
      })
        .then(({ value }) => {
          this.axios
            .post("/api/UserType/AddUserRole", null, {
              params: {
                userRoleName: value
              }
            })
            .then(res => {
              let code = res.data.code; //返回代码
              let data = res.data.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                this.tableData.push(data);
                this.$message({
                  message: "增加成功",
                  type: "success"
                });
              }
              if (code == -1) {
                this.$message.error("系统异常");
              }
              if (code == -2) {
                this.$message.error("参数错误");
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消增加"
          });
        });
    },
    /**
     * 控制拖拽
     * **/ 
    canDrag(evt){
      let _this = this;
      if (evt) {
        _this.rowDrop();  //如果为true时调用checkedsp()方法
      }else{
        _this.rootDepart.destroy() //如果为false就用destroy()销毁拖拽方法
      }

    },
    /**
     * 行拖拽
     *
     * ****/
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      _this.rootDepart = Sortable.create(tbody, {
          animation:300,
        onEnd({ newIndex, oldIndex }) {
          //拖拽结束后发生该事件
          _this.tableData.splice(
            newIndex,
            0,
            _this.tableData.splice(oldIndex, 1)[0]
          );
          var newArray = _this.tableData.slice(0);
          let newArr = newArray.map((value,i) => {
            return {
              userTypeSortNo: i++,
              userTypeId: value.userTypeId
            };
          });
          _this.axios
            .post("/api/UserType/OrderUserRoleNo", newArr)
            .then(function(res) {
              {
                if (res.data.code == 1) {
                  // _this.$msg(_this, 1, "移动成功！");
               _this.$msg(_this, 1, "移动成功！");

                } else if (res.data.code == 0) {
                  _this.$msg(_this, 0, "数据没有变化！");
                }
              }
            },() => {
               _this.$msg(_this, -1, "系统错误！");
            });
        }
      });
    }
  },
  created() {
    this.apply();
  },
  mounted() {
    this.rowDrop();
  }
};
</script>

<style lang="less" scoped>
.el-checkbox{
  margin-left: 50px;
}
</style>
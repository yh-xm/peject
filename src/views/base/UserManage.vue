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
      var _this= this
      //获取所有用
      _this.$get("api/UserType/GetUserRoles").then(res => {
        // _this.$get("api/Test/GetTest").then(res => {
        _this.tableData = res;
      });
    },
    handleEdit(index, row) {
      //修改信息
      var _this=this
      var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "Modification";
        var contentText2 = "Cancel";
      }else{
         var contentText = "修改";
        var contentText2 = "取消"; 
      }
      _this.$prompt(_this.$t('tableName.tjs'), _this.$t('tableName.role'), {
        confirmButtonText:fText,
        cancelButtonText:fText2,
        inputPattern: /\S/,
        inputValue: row.userTypeTypeName, //输入框原值
        inputErrorMessage: "内容不能为空"
      })
        .then(({ value }) => {
          _this.$post("/api/UserType/ModifyUserRole", null, {
              params: {
                userRoleName: value,
                id: row.userTypeId
              }
            })
            .then(res => {
              let code = res.code; //返回代码
              if (code == 1) {
                _this.apply(); //更新后重新渲染
                _this.$msg(_this,1,'修改成功') //成功提示
              }
              if (code == -1) {
                 _this.$msg(_this,0,'修改异常') 
              }
              if (code == -2) {
                 _this.$msg(_this,-1,'修改失败') 
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
           _this.$msg(_this,-1,'取消修改') 
        });
    },
    handleDelete(index, row) {
      //删除信息
      var _this=this
        var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "Confirm";
        var contentText2 = "Cancel";
        var flag ="Hint"
        var title = "This operation will permanently delete the data. Do you want to continue?"
      }else{
         var contentText = "确定";
        var contentText2 = "取消";
        var flag ="提示"
        var title = "此操作将永久删除该数据, 是否继续?"
      }
      _this.$confirm(title, flag, {
        confirmButtonText: fText,
        cancelButtonText: fText2,
        type: "warning"
      })
        .then(() => {
          _this.$post("/api/UserType/RemoveUserRole", null, {
              params: {
                userRoleId: row.userTypeId
              }
            })
            .then(res => {
              let code = res.code; //返回代码
              if (code == 1) {
                _this.tableData.splice(index, 1);
                  _this.$msg(_this,1,'删除成功') 
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log(index);
           _this.$msg(_this,-1,'取消删除') 
        });
    },
    addUsers() {
      var _this=this
       var lang = localStorage.locale;
      if(lang=="en"){
        var contentText = "Add";
        var contentText2 = "Cancel";
      }else{
         var contentText = "添加";
        var contentText2 = "取消"; 
      }
      _this.$prompt(_this.$t("tableName.addnewusers"), _this.$t("tableName.userInformation"), {
        confirmButtonText: fText,
        cancelButtonText:fText,
        inputPattern: /\S/,
        inputErrorMessage: "内容不能为空"
      })
        .then(({ value }) => {
          _this.$post("/api/UserType/AddUserRole", null, {
              params: {
                userRoleName: value
              }
            })
            .then(res => {
              let code = res.code; //返回代码
              let data = res.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                _this.tableData.push(data);
                _this.$msg(_this,1,'增加成功')
              }
              if (code == -1) {
                _this.$msg(_this,0,'系统异常');
              }
              if (code == -2) {
                 _this.$msg(_this,-1,'参数错误');
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
         _this.$msg(_this,-1,'取消增加');
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
          // console.log(_this.tableData);

          _this.tableData.splice(
            newIndex,
            0,
            _this.tableData.splice(oldIndex, 1)[0]
          );
          console.log(_this.tableData);
          var newArray = _this.tableData.slice(0);
          let newArr = newArray.map((value,i) => {
            return {
              userTypeSortNo: i++,
              userTypeId: value.userTypeId
            };
          });
          _this.$post("/api/UserType/OrderUserRoleNo", newArr)
            .then(function(res) {
              {
                if (res.code == 1) {
                  // _this.$msg(_this, 1, "移动成功！");
               _this.$msg(_this, 1, "移动成功！");

                } else if (res.code == 0) {
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
    var _this=this
    _this.apply();
  },
  mounted() {
    var _this=this
    _this.rowDrop();
  }
};
</script>

<style lang="less" scoped>
.el-checkbox{
  margin-left: 50px;
}
</style>
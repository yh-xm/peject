<template>
  <div id="RoleManage">
    <div slot="header" class="clearfix">
      <el-button icon="el-icon-circle-plus" type="primary" @click="addUsers"> {{$t('btn.addjs')}}</el-button>
    </div>
    <div class="text item">
      <el-table :data="tableData" stripe style="width: 100%">
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
export default {
  data() {
    return {
      tableData: []
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
      this.$prompt("角色名称", "修改角色信息", {
        confirmButtonText: "修改",
        cancelButtonText: "取消",
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
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
      this.$prompt("新增用户", "新增用户信息", {
        confirmButtonText: "添加",
        cancelButtonText: "取消",
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
    }
  },
  created() {
    this.apply();
  }
};
</script>

<style lang="less" scoped>
</style>
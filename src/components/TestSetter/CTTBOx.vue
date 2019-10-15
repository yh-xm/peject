<template>
  <div>
    <!-- <draggable v-model="tableData"> -->
    <el-table :data="tableData" row-key="userTypeId" stripe style="width: 100%">
      <el-table-column type="index" width="180"></el-table-column>
      <el-table-column prop="userTypeTypeName" label="角色名称" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger" :disabled="scope.row.disable">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- </draggable> -->
  </div>
</template>
<script>
import Sortable from "sortablejs";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      tableData: []
    };
  },
  components: {
    draggable
  },
  methods: {
    apply() {
      //获取所有用
      this.axios.get("api/UserType/GetUserRoles").then(res => {
        this.tableData = res.data;
      });
    },
    /**
     * 行拖拽
     *
     */

    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
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
                  _this.$msg(_this, 1, "移动成功！");
                } else if (res.data.code == 0) {
                  _this.$msg(_this, 0, "数据没有变化！");
                }
              }
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
<style scoped>
</style>
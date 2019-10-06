<template>
  <div id="testTime">
    <div class="testTime">
      <div class="testTime-name">考试时间</div>
      <div class="timeTable">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
        ></el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
    };
  }
};
</script>

<style lang="less" scoped>
#testTime {
  .testTime {
    display: flex;
    justify-content: space-between;
    text-align: left;
    margin: 30px auto;
    .testTime-name {
      flex: none;
      text-align: right;
      margin-right: 15px;
      color: #606266;
      line-height: 40px;
      width: 70px;
    }
    .timeTable {
      text-align: left;
      width: 100%;
    }
  }
}
</style>
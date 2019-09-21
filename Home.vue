<template>
  <div id="Home">
    <el-container  style="height:100%;">
      <!-- 侧边栏 -->
      <el-aside :style="{width:owidth+'px'}">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="asdImage">
                <img src="../../public/favicon.gif" />
              </div>
              <span>智学无忧教育</span>
            </div>
          </el-col>
        </el-row>
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          :collapse="isCollapse"
          collapse-transition
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#D1C239"
          style="height:100%;"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">在线测试</span>
            </template>
            <el-menu-item
              v-for="(item,index) in test"
              :key="index"
              :index="item.url"
              @click="addTab(item.name,item.url)"
            >{{item.name}}</el-menu-item>
          </el-submenu>
          <el-submenu index="2"> 
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">基础数据</span>
            </template>
            <el-menu-item
              v-for="(item,index) in base"
              :key="index"
              :index="item.url"
              @click="addTab(item.name,item.url)"
            >{{item.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!-- 侧边栏 结束-->



      <el-container>
        <!-- 顶部导航栏 -->
        <el-header style="text-align: right; font-size: 12px">
          <el-button
            type="primary"
            :icon="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"
            @click="fnisCollapse"
          ></el-button>
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="benToUrl"
          >
            <el-tab-pane
              v-for="(item,index) in editableTabs"
              :key="index"
              :label="item.title"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
     <div class="header-right">
            <el-dropdown>
            <i class="el-icon-s-custom" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>退出</span>
          <el-avatar size="medium" :src="circleUrl"></el-avatar>
     </div>
        </el-header>
<!-- 顶部导航栏 结束-->
        <el-main>
          <!-- 路由跳转 -->
          <router-view></router-view>
             <!-- 路由跳转结束 -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script>
import iconImage from "../../public/favicon.gif";
export default {
  data() {
    return {
      base: [
        //导航栏数据
        { name: "班级管理", url: "/ClassManage" },
        { name: "学生管理", url: "/StudentManage" },
        { name: "老师管理", url: "/TeacherManage" },
        { name: "修改密码", url: "/ModifyPassword" }
      ],
      test: [
        //导航栏数据
        { name: "老师出卷", url: "/MakeTestPaper" },
        { name: "试卷管理", url: "/TestPaperManage" },
        { name: "安排测试", url: "/TestSetter" },
        { name: "批阅试卷", url: "/ViewTestPaper" },
        { name: "测试成绩", url: "/TestResult" }
      ],
      circleUrl:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像

      editableTabsValue: "1", //tab标签默认首页
      editableTabs: [
        {
          title: "首页", //tab标签默认首页参数
          name: "1",
          url: "/"
        }
      ],
      tabIndex: 1, //tab标签默认首页下标
      isCollapse: false,  //是否折叠
      owidth: 190 // 侧边栏默认宽度
    };
  },
  methods: {
    addTab(targetName, ourl) { //添加标签卡
      var editableTabs = this.editableTabs;
      var flag = 0;
      for (let key in editableTabs) { // 查找相同标签
        if (editableTabs[key].title != targetName) {
          flag++;
        } else {
          flag = key;
          break;
        }
      }
      if (flag == editableTabs.length) { //没有相同标签
        let newTabName = ++this.tabIndex + "";
        editableTabs.push({ 
          title: targetName,
          name: newTabName,
          url: ourl
        });
        this.editableTabsValue = newTabName;
      } else {
        this.editableTabsValue = ++flag + ""; // 有相同的标签
      }
    },
    removeTab(targetName) { //删除标签卡
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.$router.push({ path : nextTab.url });//跳转路由
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName); //过滤改变当前tab标签数组
    },
    benToUrl(tab, event) { //点击跳转路由
      var ourl = this.editableTabs[tab.index].url;
      this.$router.push({ path : ourl }); //跳转路由
    },
    fnisCollapse() { //折叠侧边栏
      this.isCollapse = ! this.isCollapse; //是否折叠
      this.isCollapse ? (this.owidth = 64) : (this.owidth = 190); //切换宽度
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu {
  a {
    text-decoration: none;
  }
}
#Home {
  width: 100%;
  height: 100%;
  
  a {
    text-decoration: none;
  }

  /deep/.el-header {
    position: relative;
    background-color: white;
    color: #333;
    border-bottom: 1px solid #ccc;
    line-height: 60px;
    width: 100%;
    /deep/.el-avatar {
      position: relative;
      right: -10px;
      top: 10px;
    }
    /deep/.el-tabs {
      height: 30px;
      width: 70%;
      position: absolute;
      bottom: 0px;
      left: 5%;
      margin: 0 2%;
    }
    /deep/.el-tabs__nav {
      height: 40px;
      background-color: white;
    }
    /deep/.el-tabs__nav-scroll {
      height: 30px;
      // margin-top: 2%;
    }
    /deep/.el-tabs__item {
      top: -15px;
      font-size: 12px;
    }
    .el-tabs__nav .el-tabs__item:nth-child(1) span {
      display: none;
    }
    /deep/.is-active {
      border-bottom: 8px solid #409eff;
    }
    .el-button {
      width: 3%;
      height: 100%;
      background-color: #008181;
      font-size: 25px;
      padding-left: 0px;
      border-radius: 0px;
      outline: none;
      border: none;
      position: absolute;
      left: 0;
    }
    /deep/ .el-tabs__nav-next,
    /deep/ .el-tabs__nav-prev {
      margin-top: -5px;
    }
  }

  .el-aside {
        transition: all 0.3s;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 100%;
      min-height: 400px;
    }
    color: #333;
    font-size: 12px;
    height: 100%;
    overflow: hidden;
    .el-menu {
      background-color: #545c64;
      color: white;
    overflow-y: auto;
    overflow-x: hidden;
      /deep/ .el-submenu__title:hover {
        background-color: #545c64;
      }
      /deep/ .el-icon-menu {
        color: white;
      }
      /deep/ .el-submenu:hover {
        background-color: #545c64;
        color: white;
      }
    }
    /deep/ .el-menu-item {
      background-color: #545c64;
      color: white;
      height: 40px;
      max-width: 190px;
      min-width: 190px;
      line-height: 42px;
    }

    a {
      text-decoration: none;
    }
    .grid-content {
      height: 60px;
      .asdImage {
        border: 3px solid #008181;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 8px 14px;
        margin-right: 2px;
        float: left;
        img {
          width: 100%;
          height: inherit;
        }
      }
    }
    span {
      line-height: 60px;
    }
    .el-menu .is-active {
      background-color: #373737;
      color: #ffeb3a;
    }
    .el-submenu .is-active::after {
      content: "◆";
      color: white;
      font-size: 40px;
      position: absolute;
      right: 0;
      margin-right: -12px;
    }
    /deep/ .is-opened {
      background-color: #545c64 !important;
      color: white !important;
    }
  }
  .grid-content {
    background-color: #ffeb3a;
    color: #008181;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>
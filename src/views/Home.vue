<template>
  <div id="Home">
    <el-container style="height:100%;">
      <!-- 侧边栏 -->
      <el-aside width="200">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#D1C239"
          style="height:100%;"
          router
        >

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
  
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{$t('base.title')}}</span>
            </template>
            <el-menu-item
              v-for="(item,index) in test"
              :key="index"
              :index="item.url"
              @click="addTab(item.name,item.url)"
            >{{$t(item.name)}}</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{$t('test.title')}}</span>
            </template>
            <el-menu-item
              v-for="(item,index) in base"
              :key="index"
              :index="item.url"
              @click="addTab(item.name,item.url)"
            >{{$t(item.name)}}</el-menu-item>
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
           style="height: 30px;
      overflow: hidden;
      flex: 1 1 auto;
      margin: 30px 1% 0px 2%;
      "

          >
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="$t(item.title)"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <div
            class="header-right"
            style="display:flex;justify-content:space-around;padding-right:35px;min-width:150px;line-height:56px;"
          >
            <el-dropdown  @command="changeLocale">
              <span class="el-dropdown-link">
                {{langen}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="中文">中文</el-dropdown-item>
                <el-dropdown-item command="英语">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="getOut" style="font-size:16px;"><i class="el-icon-s-custom"></i>退出</span>
            <!-- <span style="margin-right: 15px">{{user.stuName}}</span>
             -->
            <el-avatar size="medium" :src="user.userHeader || circleUrl" fit="contain " style="margin-left:15px;margin-top:10px;"></el-avatar>
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
export default {
  data() {
    return {
      user: {},
      langen:"中文",
      base: [
        //导航栏数据测试
        { name:"base.r1", url: "/ClassManage" },
        { name: "base.r2", url: "/StudentManage" },
        { name: "base.r3", url: "/TeacherManage" },
         { name: "base.r5", url: "/UserManage" },
        { name: "base.r4", url: "/ModifyPassword" }
      ],
      test: [
        //导航栏数据
        { name: "test.r1", url: "/MakeTestPaper" },
        { name: "test.r2", url: "/TestPaperManage" },
        { name: "test.r3", url: "/TestSetter" },
        { name: "test.r4", url: "/ViewTestPaper" },
        { name: "test.r5", url: "/TestResult" }
      ],
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像

      editableTabsValue: "1", //tab标签默认首页
      editableTabs: [
        {
          title: "message.home", //tab标签默认首页参数
          name: "1",
          url: "/"
        }
      ],
      tabIndex: 1, //tab标签默认首页下标
      isCollapse: false, //是否折叠
      owidth: 190 // 侧边栏默认宽度
    };
  },
  methods: {
         /**
       * 添加标签卡
       * @param targetName {string} 标签名
       * @param ourl {string} 路径
       */
    addTab(targetName, ourl) {
      var _this = this;
      //添加标签卡
      var editableTabs = _this.editableTabs;
      var flag = 0;
      for (let key in editableTabs) {
        // 查找相同标签
        if (editableTabs[key].title != targetName) {
          flag++;
        } else {
          flag = key;
          break;
        }
      }
      if (flag == editableTabs.length) {
        //没有相同标签
        let newTabName = ++_this.tabIndex + "";
        editableTabs.push({
          title: targetName,
          name: newTabName,
          url: ourl
        });
        _this.editableTabsValue = newTabName;
      } else {
        _this.editableTabsValue = _this.editableTabs[flag].name; // 有相同的标签
      }
    },
       /**
       *  删除标签卡
       * @param targetName {string} 标签名
       */
    removeTab(targetName) {
     
var _this =this;
      let tabs = _this.editableTabs;
      let activeName = _this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              _this.$router.push({ path: nextTab.url }); //跳转路由
            }
          }
        });
      }
      _this.editableTabsValue = activeName;
     
      _this.editableTabs = tabs.filter(tab => tab.name !== targetName); //过滤改变当前tab标签数组
    },
      /**
       *  点击切换路径
       * @param tab {Object} 标签对象
       */
    benToUrl(tab) {
      var _this = this
      //点击跳转路由
      var ourl = _this.editableTabs[tab.index].url;
      _this.$router.push({ path: ourl }); //跳转路由
    },
        fnisCollapse() { //折叠侧边栏
        var _this = this
      _this.isCollapse = ! _this.isCollapse; //是否折叠
      _this.isCollapse ? (_this.owidth = 64) : (_this.owidth = 190); //切换宽度
    },
    /**
       *  切换语言
       * @param command {String} 语言种类
       */
changeLocale (command) {
  var _this =this;
  _this.langen == command ?_this.langen:_this.langen=command;
  // console.log(command)
  var lang;
      _this.langen=="中文"?lang='zh':lang='en'
      if(lang == 'zh'){
        localStorage.setItem('locale', 'zh')
        _this.$i18n.locale = localStorage.getItem('locale')

        _this.$msg(_this,1,"已经切换为中文！")
      } else if (lang == 'en') {
        localStorage.setItem('locale', 'en')
        _this.$i18n.locale = localStorage.getItem('locale')
       _this.$msg(_this,1," Switch to English!")
      }
    
},
init(){
  var _this = this;
    _this.user = eval("(" + sessionStorage.NowLoginUser + ")"); 
    if(localStorage.locale){
      localStorage.locale == "zh"?_this.langen="中文":_this.langen="English"
    }else{
      _this.langen="中文"
    }
}
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
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
    transition: 1s;
    display: flex;
    overflow: hidden;
    position: relative;
    padding: 0px;
    color: #333;
    border-bottom: 1px solid #ccc;
    width: 100%;


    .el-tabs__nav .el-tabs__item:nth-child(1) span {
      display: none;
    }
    .el-tabs__nav .el-tabs__item{
      top:-6px;
    }
    .el-tabs__nav .el-tabs__item.is-active{
      border-bottom: 8px solid #409eff;
    }
   
    .el-button {
      width:32px;
      height: 100%;
      background-color: #008181;
      font-size: 25px;
      padding-left: 0px;
      border-radius: 0px;
      outline: none;
      border: none;
    }
    /deep/ .el-tabs__nav-next,
    /deep/ .el-tabs__nav-prev {
      margin-top: -5px;
    }
    .el-dropdown-link {
      cursor: pointer;
      // color: #409EFF;
      margin-right: 20px;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
 
  }

  .el-aside {
    // transition: .1s;
    color: #333;
    font-size: 12px;
    height: 100%;
    // overflow: hidden;
    .el-menu {
      background-color: #545c64;
      color: white;
      overflow-y: auto;
      overflow-x: hidden;
      border: none;
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
         position: relative;
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
      background-color: #373737 !important;
      color: #ffeb3a;
    }
    .el-submenu .is-active:after {
      content: "◆";
      color: white;
      width: 24px;
      font-size: 40px;
      position: absolute;
      right: -12px;
      // margin-right: -12px;
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
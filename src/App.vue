<template>
  <div id="app">
    <router-view  v-if="isRouterAlive"/>
  </div>
</template>
<<<<<<< HEAD
<script>
  export default {
    name: 'App',
    data () {
      return {
        isRouterAlive: true
      }
    },
    // provide(){ //提供
    //   return {
    //     reload: this.reload
    //   }
    // },
    // methods: {
    //   reload(){
    //     this.isRouterAlive = false
    //     this.$nextTick( function () {
    //       this.isRouterAlive = true
    //     })
    //   }
    // }
  }
</script>

=======
>>>>>>> cy
<style lang="less">
* {
  margin: 0px;
  padding: 0px;
}
html,body,#app{
 height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

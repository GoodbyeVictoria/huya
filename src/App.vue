<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/img/icon.png"> -->
    <!-- <h2>Client side</h2> -->
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  
  // components: {
  //   HelloWorld
  // }
  created(){
    this.$router.push({name:'home'})
  }
}
</script>

<style lang="scss">
  @import "./assets/scss/common.scss";
  
  // body{
  //   background-color: antiquewhite;
  // }
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
  
//   // width:375px;
//   // height:601px;
//   // border:1px solid black;
// }
</style>



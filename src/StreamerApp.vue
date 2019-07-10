<template>
  <div id="streamerApp">
    <!-- <img alt="Vue logo" src="./assets/img/icon.png">
    <HelloWorld msg="Welcome to Your Vue.js Ext App"/> -->
    <!-- <h2>Streamer side</h2> -->
    <streamer-home></streamer-home>
  </div>
</template>

<script>
import streamerHome from './views/streamerHome.vue'

export default {
  name: 'streamerApp',
  components: {
    streamerHome
  }
}
</script>

<style lang="scss">
@import "./assets/scss/common.scss";



#streamerApp {
  font-family: 'Chinese Quote';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}
</style>


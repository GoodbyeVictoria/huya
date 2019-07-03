<template>
  <div id="streamerApp">
    <!-- <img alt="Vue logo" src="./assets/img/icon.png">
    <HelloWorld msg="Welcome to Your Vue.js Ext App"/> -->
    <h2>Streamer side</h2>
  </div>
</template>

<script>
import s_hello from './components/s_hello.vue'

export default {
  name: 'streamerApp',
  components: {
    s_hello
  }
}
</script>

<style lang=style lang="scss" scoped>
@import "./assets/scss/common.scss";
#streamerApp {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


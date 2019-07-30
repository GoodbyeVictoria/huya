<template>
  <div id="streamerApp">
    <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  created(){
    this.$router.push('/')
  }
}
</script>

<style lang="scss">
@import "./assets/scss/common.scss";
@import "./assets/animate.css";

#streamerApp {
  font-family: Microsoft YaHei,'Chinese Quote','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
  background-image: linear-gradient(315deg, #F9EADA 0%, #D2FCE3 100%);
  animation: hue 60s infinite linear;
  -webkit-animation: hue 60s infinite linear;
  text-shadow: 1px 0 1px black;
  
}

@keyframes hue {
    from {
        -webkit-filter: hue-rotate(0deg);
    }
    to {
        -webkit-filter: hue-rotate(360deg);
    }
}
</style>


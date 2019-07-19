<template>
    <div calss="home">
        
    </div>
</template>
<script>
export default {
    name:'home',
    
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";
@import "./../assets/animate.css";

body{
    @include flexCenter;
    background-color:#FFEDAC;
}
.intro.fade-enter{
    opacity: 0;
    // transform:translateX(-10px);
}
.fade-leave-to{
    //  opacity: 0;
    // transform:translateX(-10px);
    opacity: 0;
}
.fade-enter-active{
    transition:all 2s;
}
.fade-leave-active {
  transition: all 2s;
}

</style>



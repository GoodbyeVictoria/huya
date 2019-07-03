<template>
    <div calss="home">
        <board></board>
    </div>
</template>
<script>
import board from './../components/board'
export default {
    name:'home',
    components:{
        board
    }
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";

body{
    @include flexCenter;
    background-color:#FFEDAC;
}

</style>



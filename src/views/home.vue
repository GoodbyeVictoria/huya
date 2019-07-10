<template>
    <div calss="home">
        <button @click="show=!show" style="{cursor:pointer;border:1px solid black;position:relative;}">click</button>
        <transition name="fade-ani" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutRight">
            <div v-if="show" class="intro" key="p1">
                <div>欢迎使用弹幕tools~</div>
                <div>您可以通过创建模板，添加您想监听的弹幕关键字，填入你您回应的信息，</div>
                <div>弹幕tools就可以帮助您在直播界面回应弹幕哦~</div>
                <div>快来创建第一个模板来体验吧！</div>
                <div>创建模板</div>
                kkkkkk
            </div>
            
            <!-- 是能给个loading界面了 -->
            <!-- <div v-else>
                把storage里面的取出来
            </div> -->
        </transition>
        <!-- <board></board> -->
    </div>
</template>
<script>
import board from './../components/board'
export default {
    name:'home',
    data(){
        return{
            show:false
        }
    },
    methods:{
        change(){
            this.isEmpty=!this.isEmpty
        },
        
    },
    components:{
        board
    }
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



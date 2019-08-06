<template>
  <div id="streamerApp">
    <transition name="logo" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <div v-if="show" class="logo-wrapper" key="logo">
            <div class="heng"></div>
            <div class="shu"></div>
        </div>
        <div v-else class="full-page" key="page">
            <back></back>
            <transition
                name="change-page"
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutLeft"
                mode="out-in"
            >
                <router-view></router-view>
            </transition>
            <bottomBar></bottomBar>
        </div>
    </transition>
  </div>
</template>

<script>
import back from "./components/back";
import bottomBar from "./components/bottomBar";

export default {
    data(){
        return {
            show:true,
        }
    },
    created() {
        setTimeout(() => {
            this.show = false
            this.$router.push("/");
        }, 2000);
    },
    components:{
        back,bottomBar
    },
    methods:{
        
    }
};
</script>

<style lang="scss">
@import "./assets/scss/common.scss";
@import "./assets/animate.css";

#streamerApp {
    font-family: Microsoft YaHei, "Chinese Quote", "Avenir", Helvetica, Arial,
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    @include flexCenter;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(315deg, #f9eada 0%, #d2fce3 100%);
    animation: hue 60s infinite linear;
    -webkit-animation: hue 60s infinite linear;
    text-shadow: 1px 0 1px black;
    .logo-wrapper{
        @include flexCenter;
        @include flex-direction(column);
        position: relative;
        width: 168px;
        height: 118px;
        margin-top: -10%;
        background: #fafafa94;
        border-radius: 9px;
        border: 9px solid #fafafa;
        &::before{
            content: '';
            position: absolute;
            right: 100px;
            top: 108px;
            border-style: solid;
            border-width: 27px 16px 0px 20px;
            border-color: #fafafa transparent transparent transparent;
        }
        .shu{
            width: 13px;
            height: 56px;
            background-color: #4c8237d9;
        }
        .heng{
            width: 67px;
            height: 13px;
            background-color: #4c8237d9;
        }
    }
}

.full-page{
    width:100%;
    height:100%;
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


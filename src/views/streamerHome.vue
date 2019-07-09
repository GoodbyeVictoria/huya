<template>
    <div class="streamerHome">
        <transition name="fade" mode="out-in">
            <div v-if="isEmpty" class="intro">
                <div key="p1">欢迎使用弹幕tools~</div>
                <div key="p2">您可以通过创建模板，添加您想监听的弹幕关键字，填入你您回应的信息，</div>
                <div key="p3">弹幕tools就可以帮助您在直播界面回应弹幕哦~</div>
                <div key="p4">快来创建第一个模板来体验吧！</div>
                <div>创建模板</div>
            </div>
            <!-- 是能给个loading界面了 -->
            <div v-else>
                把storage里面的取出来
            </div>
        </transition>
        
        <div @click="change()" :style="{cursor:pointer}">click</div>
    </div>
</template>
<script>

export default {
    data(){
        return {
            isEmpty:''
        }
    },
    computed:{
        checkEmpty(){
            setTimeout(() => {
                return true
            }, 1000);
        }
    },
    methods:{
        change(){
            // this.isEmpty=!this.isEmpty
            console.log("2323");
            
        }
    },
    created(){
        hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                if(keys.length===0){
                    this.isEmpty=true
                }else{
                    this.isEmpty=false
                }
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
    },
    methods:{
        
    }
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";

body{
    @include flexCenter;
    background-color:#FFEDAC;
}
.intro{
    transition:all 1.0s ease;
    // display:none;
}
.fade-enter,.fade-leave-to{
    opacity: 0;
    transform:translateX(-10px)
}
.fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>



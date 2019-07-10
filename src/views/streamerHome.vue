<template>
    <div class="streamerHome">
        <!-- <div @click="show=!show" style="{cursor:pointer;border:1px solid black;position:relative;}">click</div> -->
        <div class="intro-wrapper">
            <transition-group name="fade-ani" tag="div" enter-active-class="animated fadeInDown"  leave-active-class="animated fadeOutRight">
                <div v-for="ele in intro_msg" :key="ele.id" :class="[introType,anim]" :style="delay[ele.id]" @transitionend="addAnim">
                    <!-- <div key="p1">欢迎使用弹幕tools~</div>
                    <div key="p2">您可以通过创建模板，添加您想监听的弹幕关键字，填入你您回应的信息，</div>
                    <div key="p3">弹幕tools就可以帮助您在直播界面回应弹幕哦~</div>
                    <div key="p4">快来创建第一个模板来体验吧！</div> -->
                    <!-- <div key="p5">创建模板</div> -->
                    {{ele.msg}}
                </div>
                
                <!-- 是loading界面 -->
                <!-- <div v-else>
                    把storage里面的取出来
                </div> -->
            </transition-group>
        </div>
        <div class="button">开 始 创 建</div>
        
    </div>
</template>
<script>

export default {
    data(){
        return {
            isEmpty:'',
            show:false,
            introType:'',
            anim:'',
            delay:[
                {"animation-delay": "0s"},
                {"animation-delay": "0.5s"},
                {"animation-delay": "1s"},
                {"animation-delay": "1.5s"},
                {"animation-delay": "2s"},
                {"animation-delay": "2.5s"}
            ],
            intro_msg:[],
            intro_msg_or:[
                {
                    msg:"欢迎使用弹幕tools",
                    id:0
                },
                {
                    msg:"您可以通过创建模板，",
                    id:1
                },
                {
                    msg:"添加您想监听的弹幕关键字，",
                    id:2
                },
                {
                    msg:"填入您想回应的信息，",
                    id:3
                },
                {
                    msg:"弹幕tools就可以帮助您在直播界面回应弹幕哦",
                    id:4
                },
                {
                    msg:"快来创建第一个模板来体验吧！",
                    id:5
                }
            ],
            
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
            this.isEmpty=!this.isEmpty
            console.log("2323");
        },
        addAnim(){
            console.log(999)
            this.anim='anim'
        },
    },
    mounted(){
        hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                if(keys.length===0){
                    this.intro_msg=this.intro_msg_or
                    this.introType='intro'
                }else{
                    this.isEmpty=false
                    this.introType='templates'
                }
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
    },
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";
@import "./../assets/animate.css";

.streamerHome{
    @include flexCenter;
    @include flex-direction(column);
    // @include justify-content(space-around);
    width: 100%;
    height: 100%;
    background-color: #FFEDAC;
    -webkit-animation: hue 60s infinite linear;
}
@keyframes hue {
    from {
        -webkit-filter: hue-rotate(0deg);
    }
    to {
        -webkit-filter: hue-rotate(360deg);
    }
}

.anim{
    animation:wobble 20s;
}
.intro-wrapper{
    line-height: 2.5;
    font-size: 18px;
    // font-weight: 600;
    height: 246px;
    margin-bottom: 50px;
}
.button{
    width: 183px;
    height: 52px;
    /* background-color: white; */
    text-align: center;
    padding: 13px;
    background-color: rgba(245, 34, 45, 0.2);
    box-shadow: 0px 1px 3px 3px #000000a3;
    border-radius: 19px;
    font-size: 19px;
}
// .intro{
//     transition:all 1.0s ease;
//     // display:none;
// }

</style>



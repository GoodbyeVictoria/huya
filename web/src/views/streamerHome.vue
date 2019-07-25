<template>
    <div class="streamerHome">
        <transition name="button-ani" enter-active-class="animatied zoomIn">
            <div v-if="!isEmpty">
                <div class="button" @click="goToList">查看模板列表</div>
            </div>
        </transition>
        <div v-if="isEmpty" class="intro-wrapper">
            <transition-group name="fade-ani" tag="div" enter-active-class="animated fadeInDown"  leave-active-class="animated fadeOutRight" @after-enter="addAnim">
                <div v-for="ele in intro_data" :key="ele.id" :class="[introType,anim]" :style="delay[ele.id]">
                    {{ele.msg}}
                </div>
            </transition-group>
        </div>
        <transition name="button-ani" enter-active-class="animatied zoomIn">
            <div v-show="show">
                <div class="button" @click="goToAdd">创 建 模 板</div>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    data(){
        return {
            isEmpty:true,
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
            intro_data:[],
            intro_msg:[
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
        
    },
    methods:{
        addAnim(el,done){
            el.style.animationDelay="0s"
            el.style.animation="upDown 3s infinite"
        },
        goToAdd(){
            this.$router.push('/add')
        },
        goToList(){
            this.$router.push('/list')
        },
    },
    mounted(){
        hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                if(keys.length===0){
                    this.show=true
                    this.intro_data=this.intro_msg
                    this.introType='intro'
                }else{
                    this.show=true
                    this.isEmpty=false
                    this.introType='templates'
                    //初始化lists放在这里
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
    font-family: Microsoft YaHei;
    width: 100%;
    height: 100%;
}

@keyframes twink {
    50%{
        box-shadow:0px 1px 13px 7px #000000a3;
    }
}
@keyframes upDown{
    50%{
        transform:translateY(5px);
    }
}
@keyframes grow{
    100%{
        transform:scale(1.1);
    }
}
.intro-wrapper{
    line-height: 2.5;
    font-size: 17px;
    height: 246px;
    margin-bottom: 50px;
    text-shadow: 1px 0 1px black;
}
.button{
    width: 183px;
    height: 52px;
    text-align: center;
    padding: 13px;
    background-color: rgba(245, 34, 45, 0.2);
    box-shadow: 0px 1px 13px 5px #000000a3;
    border-radius: 19px;
    font-size: 19px;
    text-shadow: 1px 0 1px rgba(0, 0, 0, 0.99);
    animation: twink 3s infinite;
    cursor:pointer;
    transform:scale(1.0);
    transition:all 1s;
    margin-bottom: 25px;
    margin-top: 25px;
}
.button:hover{
    transform:scale(1.07);
    transition:all 1s;
}

</style>



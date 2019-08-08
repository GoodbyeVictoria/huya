<template>
    <div class="streamerMain">
        <div class="preview">
            <div class="edit-zone">
                <div class="current-templates">
                    <a-row style="position:relative;">
                        <a-col :span="9">
                            <div> 当前模板：</div>
                        </a-col>
                        <template v-if="cur_temps.length === 0"><a-col :span="5">无</a-col></template>
                        <template v-else>
                            <transition-group name="title" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
                                <a-col :span="10" v-for="(el,index) in cur_temps" :key="el" v-show="index===currentIndex" style="position:absolute;left:37.5%;">
                                    <div>{{el}}</div>
                                </a-col>
                            </transition-group>
                        </template>
                    </a-row>
                </div>
                <div class="zone-size">
                    <a-row>
                        <a-col :span="6">
                            <label>宽度</label>
                        </a-col>
                        <a-col :span="16">
                            <a-slider :min="1" :max="10" :defaultValue="6.0" :step="0.1" @change="changeWidth" @afterChange="refreshZone" />
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6">
                            <label>高度</label>
                        </a-col>
                        <a-col :span="16">
                            <a-slider :min="1" :max="10" :defaultValue="6.0" :step="0.1" @change="changeHeight" @afterChange="refreshZone" />
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="10">
                            <label>模板停留时间</label>
                        </a-col>
                        <a-col :span="10">
                            <a-input-number :min="1" :max="20" v-model="duration" :defaultValue="8" :disabled="!isPreview" size="small" @change="changeDuration" /> 秒
                        </a-col>
                    </a-row>
                </div>
            </div>
            <div class="zone" id="zone" ref="zone" :style="{width:width + '%',height:height + '%',transform:leftOffset}">
                <div v-if="isPreview" class="content-pre">{{ default_temp }}</div>
                <div v-else>
                    <transition name="zone-tra" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight" @after-enter="afterEnter" mode="out-in">
                        <div class="content"  v-for="item in showlist(cur_lists,start,end)" :key="item.index">
                            {{ item.temp }}
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState,mapGetters,mapMutations } from 'vuex'


export default {
    data(){
        return{
            width:60,
            height:27.6,
            offsetX:-50,
            offsetY:-20,
            duration:8,
            default_temp:'预览区域',
            currentIndex:'',
            start:0,
            end:0,
            currentIndex:0,
            timer:''
        }
    },
    mounted(){
        // let isOn=false
         //获取模板数据，拼成要用的样子
         this.$nextTick(()=>{
             if(!this.isPreview&&this.cur_lists_length==0){
                 //监听模式并且第一次进来
                this.end = 1
                this.changeEnd({end:1})
                this.createZone()
             }else if(!this.isPreview&&this.cur_lists_length > 0){
                 //监听模式并且不是第一次进来
                this.start = this.start_s
                this.end = this.end_s
             }
             this.timer = setInterval(() => {
                 this.autoPlay()
             }, 3000);
             console.log(this.cur_lists_length,this.end)
         })
    },
    destroyed(){
        clearInterval(this.timer)
    },
    computed:{
        leftOffset(){
            return `translate(${this.offsetX}%,${this.offsetY}%)`
        },
        ...mapState([
            'boardExist',
            'cur_lists',
            'isPreview',
            'cur_temps'
        ]),
        ...mapState({
            start_s:'start',
            end_s:'end'
        }),
        ...mapGetters([
            'cur_lists_length',
            'cur_temps_length'
        ]),
        delay(){
            return this.duration * 1000
        },
    },
    components:{
    },
    methods:{
        ...mapMutations([
            'changeStart',
            'changeEnd'
        ]),
        autoPlay(){
            this.currentIndex = (this.currentIndex+1)%this.cur_temps.length
        },
        showlist(list,start,end){
            return this.cur_lists.slice(start,end)
        },
        afterEnter(){
            setTimeout(()=>{
                this.changeStart({start:this.start_s+1})
                this.changeEnd({end:this.end_s+1})
                this.start = (this.start+1)
                this.end = (this.end+1)
            },this.delay)
        },
        changeDuration(value){
            this.setDuration({duration:value})
        },
        createZone(item){
            //停止监听弹幕
            hyExt.stream.addZone(this.$refs.zone,{screenColor:'#e9f5ff'}).then(() => {
                hyExt.logger.info('创建白板成功')
            }).catch(err => {
                hyExt.logger.warn('创建白板失败', err)
            })
        },
        removeZone(callback){
            hyExt.stream.removeZone().then(() => {
                hyExt.logger.info('删除白板成功')
                callback()
            }).catch(err => {
                hyExt.logger.warn('删除白板失败', err)
            })
        },
        changeWidth(value){
            this.width = value*9.3
        },
        changeHeight(value){
            this.height = value*4.6
        },
        refreshZone(){
            if(this.boardExist){
                this.removeZone(this.createZone)
            }
        }
    }
}
</script>

<style lang="scss">
@import "./../assets/scss/partial/flex";

.streamerMain {
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
    .preview {
        position: fixed;
        width: 93%;
        height: 83%;
        top: 7%;
        box-shadow: 1px 1px 6px 1px #0000001f;
        .zone {
            position:fixed;
            background-color: #e9f5ff80;
            left:50%;
            top: 53%;
            padding: 10px;
            .content {
                position:relative;
                top: 46px;
            }
            .content-pre {
                position: relative;
                top: 40%;
            }
        }
        .edit-zone {
            padding: 0 0 5px 0;
            margin: 20px 0 34px 0;
            .zone-size {
                label {
                    display: inline-block;
                    padding: 7px;
                }
                .ant-input-number {
                    margin-top: 5px;
                    width:65px;
                }
            }
        }
    }
}
</style>



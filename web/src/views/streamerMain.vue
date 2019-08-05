<template>
    <div class="streamerMain">
        <div class="preview">
            <!-- <div class="current-templates">当前模板：
                <div class="current-wrapper">
                    <div class="title">无</div>
                    <div class="title">无</div>
                </div>
            </div> -->
            <div class="edit-zone">
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
                            <a-input-number :min="1" :max="20" v-model="duration" :defaultValue="8" :disabled="!isPreview" size="small" @change="setDuration" /> 秒
                        </a-col>
                    </a-row>
                </div>
            </div>
            <div class="zone" id="zone" ref="zone" :style="{width:width + '%',height:height + '%',transform:leftOffset}">
                <transition name="zone" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight">
                    <div class="content" v-show="isActive||isPreview">
                        {{current_template}}
                    </div>
                </transition>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapState,mapActions  } from 'vuex'


export default {
    data(){
        return{
            width:60,
            height:27.6,
            offsetX:-50,
            offsetY:-20,
            duration:8,
        }
    },
    created(){
        // let isOn=false
         //获取模板数据，拼成要用的样子
         this.$store.commit('setDuration',{duration:this.duration})
         if(!this.boardExist){
             this.createZone()
         }
        
    },
    computed:{
        leftOffset(){
            return `translate(${this.offsetX}%,${this.offsetY}%)`
        },
        ...mapState([
            'isActive',
            'isPreview',
            'current_template',
            'boardExist'
        ]),
    },
    components:{
    },
    methods:{
        setDuration(value){
            this.$store.commit('setDuration',{duration:this.duration})
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
            .content {
                position: relative;
                top: 40%;
            }
        }
        .current-templates{
            height: 16%;
            margin: 7px;
            .current-wrapper{
                @include flexCenter;
                .title{
                    height:90%;
                    width:40%;
                    background-color: #fafafa94;
                    box-shadow: 1px 1px 6px 1px #0000001f;
                    border-radius: 4px;
                    margin: 5px 0;
                }
            }
        }
        .edit-zone {
            padding: 0 0 5px 0;
            margin: 34px 0;
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



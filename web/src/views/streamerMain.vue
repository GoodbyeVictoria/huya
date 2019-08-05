<template>
    <div class="streamerMain">
        <div class="preview">
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
                            <a-input-number :min="1" :max="20" v-model="duration" :defaultValue="8" :disabled="!isPreview" size="small" /> 秒
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
            current_template:'预览区域',
            current_item:'',
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
        
    },
    computed:{
        leftOffset(){
            return `translate(${this.offsetX}%,${this.offsetY}%)`
        },
        ...mapState([
            'isActive',
            'isPreview',
        ]),
    },
    components:{
    },
    methods:{
        onChange(item){
            if(this.on_count>=1&&!item.checked){
                this.$message.warning('只能监听一个哦')
            }else{
                item.checked=!item.checked
                this.listen_count()
                if(item.checked){
                    this.startListen(item)
                }else{
                    this.stopListen()
                    //删掉白板
                }
            }
        },
        listen_count(){
            this.on_count = this.lists.reduce((acc,cur)=>{
                if(cur.checked){
                    acc++
                }
                return acc
            },0)
        },
        startListen(item){
            //其实可以不止监听关键词。。。
            this.current_template = item.value.template
            this.current_item = item
            item.disabled=true
            this.isPreview = false
            let keyWord=item.value.keyWord
            this.createZone(item)
            //刷新白板
            hyExt.context.onBarrageChange({
                content:keyWord
            }, barrageInfo => {
                console.log(barrageInfo)
                //显示白板文字
                //一段时间后文字消失
                //给一个设置文字消失的间隔
                this.isActive = true
                // this.stopListen()
                let delay = this.duration * 1000
                setTimeout(() => {
                    this.isActive = false
                }, delay);
                hyExt.logger.info('有新弹幕', barrageInfo)
            }).then(() => {
                item.disabled=false
                this.$message.success('开始监听', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        createZone(){
            //停止监听弹幕
            hyExt.stream.addZone(this.$refs.zone,{screenColor:'#e9f5ff'}).then(() => {
                hyExt.logger.info('创建白板成功')
            }).catch(err => {
                hyExt.logger.warn('创建白板失败', err)
            })
        },
        stopListen(){
            //取消某个关键词监听
            this.current_item = ''
            this.isPreview = true
            this.isActive = false
            this.$message.warning('监听已关闭')
            hyExt.context.offBarrageChange()
            this.removeZone()
        },
        removeZone(callback){
            hyExt.stream.removeZone().then(() => {
                hyExt.logger.info('删除白板成功')
                callback()
            }).catch(err => {
                hyExt.logger.warn('删除白板失败', err)
            })
        },
        goToUpdate(item){
            this.$store.commit('getItem',{item:item})
            this.$router.push(`/update/${item.key}`)
        },
        removeItem(item){
            let pos=this.lists.map(ele=>ele.key).indexOf(item.key)
            console.log(pos)
            this.lists.splice(pos,1)
            //removeItem
            hyExt.storage.removeItem(item.key).then(()=>{
                hyExt.logger.info('删除item成功')
            }).catch(err=>{
                hyExt.logger.warn('删除item失败', err)
            })
        },
        showLists(lists,start,end){
            return lists.slice(start,end)
        },
        changeWidth(value){
            this.width = value*9.3
        },
        changeHeight(value){
            this.height = value*4.6
        },
        refreshZone(){
            if(this.current_item){
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
        height: 63%;
        top: 27%;
        // background: #fafafa94;
        border-radius: 17px;
        box-shadow: 1px 1px 6px 1px #0000001f;
        .zone {
            position:fixed;
            background-color: #e9f5ff80;
            left:50%;
            top: 62%;
            .content {
                position: relative;
                top: 40%;
            }
        }
        .edit-zone {
            padding: 0 0 5px 0;
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



<template>
    <div class="streamerList">
        <div v-show="(lists.length <= 0) && !checkIsEmpty()" class="loading">
            <a-spin size="large"></a-spin>
        </div>
        <div class="list-wrapper" v-if="lists.length > 0">
            <transition-group name="list-tran" enter-active-class="animated fadeInUp fast" leave-active-class="animated fadeOutUp fast">
                <div :key="item.key" v-for="item in lists" class="item-wrapper" :class="{giftWrapper: item.value.isGift}">
                    <a-row>
                        <a-col :span="16"><div>{{item.value.title}}</div></a-col>
                        <a-col :span="6" :offset="2">
                            <div style="margin-bottom:4px;text-align:right;">
                                <a-switch :checked="item.checked" :disabled="item.disabled" @change='onChange(item)'  />
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24"><div>{{item.value.keyWord}}</div></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6">
                            <a-dropdown>
                                <a class="ant-dropdown-link" href="#">编辑</a>
                                <a-menu slot="overlay">
                                    <a-menu-item>
                                        <a href="javascript:;" @click="goToUpdate(item)">修改</a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a href="javascript:;" @click="removeItem(item)">删除</a>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </a-col>
                    </a-row>
                </div>
            </transition-group>
        </div>
        <div v-else class="attention">
            <div>
                目前还没有模板哦！
            </div>
            <div>
                快去点击创建模板吧！
            </div>
        </div>
    </div>
</template>

<script>
import { mapState,mapActions,mapMutations,mapGetters } from 'vuex'

export default {
    data(){
        return{
            count:0,
            stopDanmu:true,
            stopGift:true,
            isStopFinish:true,
        }
    },
    created(){
        let isOn=true
         //获取模板数据，拼成要用的样子
         //从vuex获取，每次更改状态要更新到vuex
         //vuex里数据为空则从缓存获取（说明是第一次）
        if(this.lists.length==0){
            //初始化
            this.getLists()
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.isStopFinish){
            next()
        }
    },
    computed:{
        on_count(){
            return this.lists.reduce((acc,cur)=>{
                        if(cur.checked&&!cur.value.isGift){
                            acc++
                        }
                        return acc
                    },0)
        },
        on_count_gift(){
            return this.lists.reduce((acc,cur)=>{
                        if(cur.checked&&cur.value.isGift){
                            acc++
                        }
                        return acc
                    },0)
        },
        ...mapState([
            'lists',
            'boardExist',
            'cur_lists'
        ]),
        ...mapGetters([
            'cur_lists_length',
            'last_item',
        ]),
    },
    components:{
    },
    methods:{
        ...mapMutations([
            'setBoardExist',
            'addCurLists',
            'cleanCurLists',
            'changePreview',
            'addCurTemps',
            'removeCurTemps',
        ]),
        ...mapActions([
            'getLists',
            'removeItem',
            'checkIsEmpty',
        ]),
        onChange(item){
            if(item.value.isGift){
                if(this.on_count_gift>=1&&!item.checked){
                    this.$message.warning('只能监听一个礼物模板哦')
                }else{
                    item.checked=!item.checked
                    if(item.checked){
                        console.log('jianting')
                        this.startListenGift(item)
                    }else{
                        this.stopListenGift(item)
                        //删掉白板
                    }
                }
            }else{
                if(this.on_count>=1&&!item.checked){
                    this.$message.warning('只能监听一个弹幕模板哦')
                }else{
                    item.checked=!item.checked
                    if(item.checked){
                        this.startListen(item)
                    }else{
                        this.stopListen(item)
                        //删掉白板
                    }
                }
            }
        },
        goToUpdate(item){
            this.$store.commit('getItem',{item:item})
            if(item.value.isGift){
                this.$router.push(`/updateGift/${item.key}`)
            }else{
                this.$router.push(`/update/${item.key}`)
            }
            
        },
        gotoMain(){
            this.$router.push(`/main`)
        },
        removeItem(item){
            this.removeItem(item)
        },
        startListen(item){
            item.disabled=true
            this.stopDanmu = false
            this.changePreview({isPreview: false})
            this.addCurTemps({title:item.value.title})
            let keyWord=item.value.keyWord
            hyExt.context.onBarrageChange({
                content:keyWord
            }, barrageInfo => {
                console.log(barrageInfo)
                this.count = Math.floor(Date.now() / 1000);
                //如果与上一个模板内容相同，则不插入
                let temp = item.value.template
                // if(!this.last_item||this.last_item.temp !== temp){
                //     console.log(this.last_item)
                //     this.addCurLists({index:this.count ,temp: temp})
                // }
                this.addCurLists({index:this.count ,temp: temp})
                hyExt.logger.info('有新弹幕', barrageInfo)  
            }).then(() => {
                item.disabled=false
                this.$nextTick(()=>{
                    this.gotoMain()
                })
                this.$message.success('监听已打开，请尽量保持白板页面', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        startListenGift(item){
            item.disabled=true
            this.stopGift = false
            this.changePreview({isPreview: false})
            this.addCurTemps({title:item.value.title})
            let keyWord=item.value.keyWord
            hyExt.context.onGiftChange({
                itemName: keyWord
            }, giftInfo => {
                hyExt.logger.info('有新礼物', giftInfo)
                this.count = Math.floor(Date.now() / 1000);
                let { sendNick, sendItemCount, sendItemComboHits, itemName } = giftInfo
                let template = ``
                if(sendItemComboHits == 0){
                    template = `感谢${sendNick}送的${sendItemCount}个${itemName}！${item.value.template}`
                }else{
                    template = `感谢${sendNick}送的${sendItemComboHits}组${itemName}！${item.value.template}`
                }
                //如果与上一个模板内容相同，则不插入
                // if(!this.last_item||this.last_item.temp !== template){
                //     console.log(this.last_item)
                //     this.addCurLists({index:this.count ,temp: template})
                // }
                this.addCurLists({index:this.count ,temp: template})
            }).then(() => {
                item.disabled=false
                //gotoMain
                this.$nextTick(()=>{
                    this.gotoMain()
                })
                this.$message.success('监听已打开，请尽量保持白板页面', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        //写在vuex的计算属性里
        stopListenGift(item){
            this.isStopFinish = false
            hyExt.context.offGiftChange().then(()=>{
                this.$message.warning('监听已关闭')
                this.cleanCurLists()
                this.removeCurTemps({title:item.value.title})
                this.stopGift = true
                console.log(this.stopDanmu+"danmu",this.stopGift+"liwu")
                if(this.stopGift && this.stopDanmu){
                    this.changePreview({isPreview: true})
                    this.removeZone()
                }
                this.$nextTick(()=>{
                    this.isStopFinish = true
                })
            })
            //不一定remove
        },
        stopListen(item){
            //取消某个关键词监听
            this.isStopFinish = false
            hyExt.context.offBarrageChange().then(()=>{
                this.$message.warning('监听已关闭')
                this.cleanCurLists()
                this.removeCurTemps({title:item.value.title})
                this.stopDanmu = true
                console.log(this.stopDanmu+"danmu",this.stopGift+"liwu")
                if(this.stopGift && this.stopDanmu){
                    this.changePreview({isPreview: true})
                    this.removeZone()
                }
                this.$nextTick(()=>{
                    this.isStopFinish = true
                })
            })
            //不一定remove
        },
        removeZone(){
            hyExt.stream.removeZone().then(() => {
                hyExt.logger.info('删除白板成功')
                this.setBoardExist({exist: false})
            }).catch(err => {
                hyExt.logger.warn('删除白板失败', err)
            })
        },
    }
}
</script>

<style lang="scss">
@import "./../assets/scss/partial/flex";

.streamerList{
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
    .list-wrapper{
        @include flexbox;
        @include justify-content();
        @include flex-direction(column);
        overflow-x: auto;
        width:100%;
        height: 85%;
        margin-top: -2%;
        font-size:17px;
        .ant-row{
            margin:-1px 0 -1px 0;
            padding:3px 0px;
            letter-spacing: 2px;
            div{
                background: transparent;
                border: 0;
            }
            &:nth-child(1){
                font-size:19px;
                letter-spacing: 3px;
                font-weight:500;
            }
            &:nth-child(2){
                font-size:15px
            }
            &:nth-child(3){
                font-size:15px
            }
        }
        .item-wrapper {
            text-align: left;
            width: 73%;
            height: 16%;
            margin: 4% auto;
            padding: 10px 17px;
            background: #fafafa94;
            border-radius: 17px;
            box-shadow: 1px 1px 6px 1px #0000001f;
            transform:scale(1.0);
            transition:all 0.2s;
            &:hover{
                transform:scale(1.04);
                transition:all 0.2s;
                cursor:pointer;
            }
        }
        .giftWrapper{
            background: rgba(151, 200, 246, 0.2);
        }
    }
    ::-webkit-scrollbar {
        background-color: #e8e8e8;
        width: 10px;
        background-clip: padding-box;
        border-radius: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #fafafae0;
        border-radius: 7px;
    }
}

.loading{
    position:fixed;
}
.action-active:hover{
    cursor:pointer;
    color:brown;
    text-decoration: underline;
}
.attention {
    @include flexCenter;
    @include flex-direction(column);
    width: 63%;
    height: 22%;
    background-color: #fafafa94;
    box-shadow: 1px 1px 6px 1px #0000001f;
    border-radius: 10px;
    div {
        margin: 5%;
        letter-spacing: 1px;
    }
}

</style>



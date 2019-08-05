<template>
    <div class="streamerList">
        <div v-show="lists.length <= 0" class="loading">
            <a-spin size="large"></a-spin>
        </div>
        <div class="list-wrapper">
            <transition-group name="list-tran" enter-active-class="animated fadeInUp fast" leave-active-class="animated fadeOutUp fast">
                <div :key="item.key" v-for="item in lists" class="item-wrapper">
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
    </div>
</template>

<script>
import { mapState,mapActions  } from 'vuex'

export default {
    data(){
        return{
            loading:'',
            back_path:'',
        }
    },
    created(){
        let isOn=true
         //获取模板数据，拼成要用的样子
         //从vuex获取，每次更改状态要更新到vuex
         //vuex里数据为空则从缓存获取（说明是第一次）
        // console.log(this.lists)
        if(this.lists.length==0){
            //初始化
            this.getLists()
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
            'cur_lists',
            'duration',
            'boardExit',
        ]),
    },
    components:{
    },
    methods:{
        ...mapActions([
            'getLists',
            'removeItem',
        ]),
        onChange(item){
            if(item.value.isGift){
                if(this.on_count_gift>=1&&!item.checked){
                    this.$message.warning('只能监听一个哦')
                }else{
                    item.checked=!item.checked
                    if(item.checked){
                        console.log('jianting')
                        this.startListenGift(item)
                    }else{
                        this.stopListen()
                        //删掉白板
                    }
                }
            }else{
                if(this.on_count>=1&&!item.checked){
                    this.$message.warning('只能监听一个哦')
                }else{
                    item.checked=!item.checked
                    if(item.checked){
                        // this.startListen(item)
                    }else{
                        // this.stopListen()
                        //删掉白板
                    }
                }
            }
        },
        goToUpdate(item){
            this.$store.commit('getItem',{item:item})
            this.$router.push(`/update/${item.key}`)
        },
        gotoMain(){
            this.$router.push(`/main`)
        },
        removeItem(item){
            this.removeItem(item)
        },
        startListen(item){
            this.cur_lists.push(item)
            this.current_template = item.value.template
            this.current_item = item
            item.disabled=true
            this.isPreview = false
            let keyWord=item.value.keyWord
            // this.createZone(item)
            //刷新白板
            hyExt.context.onBarrageChange({
                content:keyWord
            }, barrageInfo => {
                console.log(barrageInfo)
                //显示白板文字
                //一段时间后文字消失
                //给一个设置文字消失的间隔
                this.isActive = true
                let delay = this.duration * 1000
                setTimeout(() => {
                    this.isActive = false
                }, delay);
                hyExt.logger.info('有新弹幕', barrageInfo)
            }).then(() => {
                item.disabled=false
                //gotoMain
                this.gotoMain()
                this.$message.success('开始监听', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        startListenGift(item){
            this.cur_lists.push(item)
            this.current_template = item.value.template
            this.current_item = item
            item.disabled=true
            this.isPreview = false
            let keyWord=item.value.keyWord
            console.log(keyWord)
            hyExt.context.onGiftChange({
                itemName: keyWord
            }, giftInfo => {
                hyExt.logger.info('有新礼物', giftInfo)
                let { sendNick, sendItemCount, sendItemComboHits, itemName } = giftInfo
                let template = ``
                if(sendItemComboHits == 0){
                    template = `感谢${sendNick}送的${sendItemCount}个${itemName}！`
                }else{
                    template = `感谢${sendNick}送的${sendItemComboHits}组${itemName}！`
                }
                //同步到vuex
                console.log(giftInfo)
                this.isActive = true
                let delay = this.duration * 1000
                setTimeout(() => {
                    this.isActive = false
                }, delay);

            }).then(() => {
                item.disabled=false
                //gotoMain
                // this.gotoMain()
                this.$message.success('开始监听', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        stopListenGift(){
            this.current_item = ''
            this.isPreview = true
            this.isActive = false
            this.$message.warning('监听已关闭')
            hyExt.context.offGiftChange()
            // this.removeZone()
        },
        stopListen(){
            //取消某个关键词监听
            this.current_item = ''
            this.isPreview = true
            this.isActive = false
            this.$message.warning('监听已关闭')
            hyExt.context.offBarrageChange()
            // this.removeZone()
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
                font-size:21px;
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
            transition:all 0.5s;
            &:hover{
                transform:scale(1.04);
                transition:all 0.5s;
                cursor:pointer;
            }
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

</style>



<template>
    <div class="streamerList">
        <!-- <back :path="back_path" content="返回主页"></back> -->
        <div v-show="showloading()" class="loading">
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
                        <a-col :span="6"><div>{{item.value.keyWord}}</div></a-col>
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
import back from './../components/back'
import bottomBar from './../components/bottomBar'

export default {
    data(){
        return{
            lists:[],
            back_path:'',
            giftWrapper:''
        }
    },
    created(){
        this.showloading(true)
        // let isOn=false
        let isOn=true
         //获取模板数据，拼成要用的样子
        hyExt.storage.getKeys().then(keys=>{
            hyExt.logger.info('获取成功', keys)
            this.showloading(false)

            keys.forEach(ele=>{
                let obj={key:ele,checked:false,disabled:!isOn,show:false}
                hyExt.storage.getItem(ele).then(value => {
                    hyExt.logger.info('获取成功', value)
                    let data=JSON.parse(value)
                    obj.value=data
                    this.lists.push(obj)
                    
                }).catch(err => {
                    hyExt.logger.warn('获取失败', err)
                })
            })
            
            this.$store.commit('setLists',{lists:this.lists})
        }).catch(err=>{
            hyExt.logger.warn('获取失败', err)
        })
    },
    computed:{
        
    },
    components:{
        back,bottomBar
    },
    methods:{
        showloading(flag){
            this.loading = flag
            return this.loading
        },
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
        gotoStart(item){
            this.$router.push('/main')
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



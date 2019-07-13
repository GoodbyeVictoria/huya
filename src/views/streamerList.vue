<template>
    <div class="streamerList">
        <backHome></backHome>
        <div v-show="loading" class="loading">
            <a-spin size="large"></a-spin>
        </div>
        <div class="list-wrapper">
            <a-row>
                <a-col :span="8"><div>标题</div></a-col>
                <a-col :span="8"><div>关键字</div></a-col>
                <a-col :span="8"><div>off/on</div></a-col>
            </a-row>
            <transition-group name="list-tran" enter-active-class="animated fadeInRight faster">
                <template v-for="item in lists">
                    <a-row :key="item.key">
                        <a-col :span="8"><div>{{item.key}}</div></a-col>
                        <a-col :span="8"><div>{{item.value.keyWord}}</div></a-col>
                        <a-col :span="8">
                            <div>
                                <a-switch :checked="item.checked" :disabled="item.disabled" @change='onChange(item)' style="margin-bottom:2px" />
                            </div>
                            <div :id="item.key" class="zone">
                                {{item.value.template}}这是模板模板模板
                            </div>
                        </a-col>
                    </a-row>
                </template>
            </transition-group>
        </div>
    </div>
</template>

<script>
import backHome from './../components/backHome'

export default {
    data(){
        return{
            lists:[],
            on_count:0,
            loading:false,
        }
    },
    created(){
        //获取模板数据，拼成要用的样子
        this.loading=true
        hyExt.storage.getKeys().then(keys=>{
            hyExt.logger.info('获取成功', keys)
            keys.forEach(ele=>{
                let obj={key:ele,checked:false,disabled:false}
                hyExt.storage.getItem(ele).then(value => {
                    hyExt.logger.info('获取成功', value)
                    let data=JSON.parse(value)
                    obj.value=data
                    this.lists.push(obj)
                }).catch(err => {
                    hyExt.logger.warn('获取失败', err)
                })
            })
            this.loading=false
        }).catch(err=>{
            hyExt.logger.warn('获取失败', err)
        })
    },
    computed:{
    },
    components:{
        backHome
    },
    methods:{
        onChange(item){
            if(this.on_count>=5){
                this.$message.warning('监听个数不能超过5个哦');
            }else{
                //判断有没有开播
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
            item.disabled=true
            let keyWord=item.value.keyWord
            hyExt.context.onBarrageChange({
                content:keyWord
            }, barrageInfo => {
                console.log(barrageInfo)
                //创建白板
                this.createZone(item)
                hyExt.logger.info('有新弹幕', barrageInfo)
            }).then(() => {
                item.disabled=false
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
            
        },
        createZone(item){
            hyExt.stream.addZone(document.getElementById(item.key),{screenColor:"#FFEDAC"}).then(() => {
                hyExt.logger.info('创建白板成功')
            }).catch(err => {
                hyExt.logger.warn('创建白板失败', err)
            })
        },
        stopListen(){
            //取消某个关键词监听
            hyExt.context.offBarrageChange()
        }
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
}
.list-wrapper{
    width:95%;
    height:80%;
    font-size:17px;
    margin-top: 10px;
}
.streamerList .ant-row{
    border-top:1px solid rgb(95, 91, 91);
    border-bottom: 1px solid rgb(95, 91, 91);
    margin:-1px 0 -1px 0;
    div{
        background: transparent;
        border: 0;
    }
}
.zone{
    display:none;
    width:50px;
    height:50px;
}
.loading{
    position:fixed;
}

</style>



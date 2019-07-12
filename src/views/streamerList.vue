<template>
    <div class="streamerList">
        <backHome></backHome>
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
                                <a-switch :checked="item.checked" @change='onChange(item)' style="margin-bottom:2px" />
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
        }
    },
    created(){
        //获取模板数据，拼成要用的样子
        hyExt.storage.getKeys().then(keys=>{
            hyExt.logger.info('获取成功', keys)
            keys.forEach(ele=>{
                let obj={key:ele,checked:false}
                obj.key=ele
                hyExt.storage.getItem(ele).then(value => {
                    hyExt.logger.info('获取成功', value)
                    let data=JSON.parse(value)
                    obj.value=data
                    this.lists.push(obj)
                }).catch(err => {
                    hyExt.logger.warn('获取失败', err)
                })
            })
        }).catch(err=>{
            hyExt.logger.warn('获取失败', err)
        })
    },
    computed:{
        //计算监听的关键词个数，最多不超过5个
        
    },
    components:{
        backHome
    },
    methods:{
        onChange(item){
            
            if(this.on_count>=5){
                this.$message.warning('监听个数不能超过5个哦');
            }else{
                item.checked=!item.checked
                this.listen_count()
            }
            
            console.log(item);
            console.log(this.on_count)
        },
        listen_count(){
            this.on_count = this.lists.reduce((acc,cur)=>{
                if(cur.checked){
                    acc++
                }
                return acc
            },0)
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

</style>



<template>
    <div class="streamerList">
        <back :path="back_path" content="返回主页"></back>
        <div v-show="loading" class="loading">
            <a-spin size="large"></a-spin>
        </div>
        <div class="list-wrapper">
            <a-row>
                <a-col :span="6"><div>标题</div></a-col>
                <a-col :span="6"><div>关键字</div></a-col>
                <a-col :span="6"><div>操作</div></a-col>
                <a-col :span="6"><div>off/on</div></a-col>
            </a-row>
            <transition-group name="list-tran" enter-active-class="animated fadeInRight faster" leave-active-class="animated fadeOutLeft faster">
                <template v-for="item in showLists(lists,start,end)">
                    <a-row :key="item.key">
                        <a-col :span="6"><div>{{item.value.title}}</div></a-col>
                        <a-col :span="6"><div>{{item.value.keyWord}}</div></a-col>
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
                        <a-col :span="6">
                            <div>
                                <a-switch :checked="item.checked" :disabled="item.disabled" @change='onChange(item)' style="margin-bottom:2px" />
                            </div>
                        </a-col>
                    </a-row>
                </template>
            </transition-group>
        </div>
        <div class="pagination" v-show="!loading">
            <!-- 分页 -->
            <a-pagination simple v-model="cur_page" :pageSize="pageSize" :total=total @change="page_onChange" />
        </div>
        <div class="preview">
            <div class="zone" id="zone">
                {{current_item}}
            </div>
        </div>
        
    </div>
</template>

<script>
import back from './../components/back'

export default {
    data(){
        return{
            lists:[],
            on_count:0,
            loading:false,
            current_item:'预览区域',
            back_path:'',
            cur_page:1,
            pageSize:4,
            start:0,
            end:4,
        }
    },
    created(){
        this.loading=true
        let isOn=false
        //判断有没有开播
        //给一个重新刷新页面的按钮
        hyExt.context.getLiveInfo().then(liveInfo => {
            hyExt.logger.info('liveInfo', liveInfo)
            this.loading=false;
            if(liveInfo.isOn){
                isOn=true
            }
        }).catch(err => {
            hyExt.logger.warn('get liveInfo failed', err)
        })
         //获取模板数据，拼成要用的样子
        hyExt.storage.getKeys().then(keys=>{
            hyExt.logger.info('获取成功', keys)
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
            this.loading=false;
            this.$store.commit('setLists',{lists:this.lists})
        }).catch(err=>{
            hyExt.logger.warn('获取失败', err)
        })
    },
    computed:{
        show_lists(){
            return this.lists.slice(0,this.pageSize)
        },
        total(){
            return this.lists.length
        }
    },
    components:{
        back
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
            this.current_item=item.value.template
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
                this.$message.success('开始监听', 1)
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        },
        createZone(item){
            //停止监听弹幕
            this.stopListen()
            hyExt.stream.addZone(document.getElementById('zone')).then(() => {
                hyExt.logger.info('创建白板成功')
                setTimeout(() => {
                    //删除白板
                    //重新开始监听
                    this.removeZone()
                    this.startListen(item)
                }, 8000);
            }).catch(err => {
                hyExt.logger.warn('创建白板失败', err)
            })
        },
        stopListen(){
            //取消某个关键词监听
            this.$message.warning('监听已关闭')
            hyExt.context.offBarrageChange()
        },
        removeZone(){
            hyExt.stream.removeZone().then(() => {
                hyExt.logger.info('删除白板成功')
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
        page_onChange(page){
            this.start = (page-1) * this.pageSize
            this.end = this.start + this.pageSize
            this.showLists(this.lists,this.start,this.end)
        },
        addDelay(el){
            el.style.animationDelay = ".5s"
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
    padding:6px 0px;
    div{
        background: transparent;
        border: 0;
    }
}
.zone{
    position:fixed;
    width:60%;
    height:27%;
    margin:8px 14%;
    background-color: #e9f5ff80;
    padding:50px 0;
}
.loading{
    position:fixed;
}
.preview{
    position:fixed;
    border:1px dashed rgb(95, 91, 91);
    width:90%;
    height:30%;
    top:63%;
}
.action-active:hover{
    cursor:pointer;
    color:brown;
    text-decoration: underline;
}
.pagination{
    position:fixed;
    top:56%;
}

</style>



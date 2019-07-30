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
            <transition name="list-tran" enter-active-class="animated fadeInLeft fast" leave-active-class="animated fadeOutRight fast" mode="out-in">
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
            </transition>
        </div>
        <div class="pagination" v-show="!loading">
            <a-pagination simple size="small" v-model="cur_page" :pageSize="pageSize" :total=total @change="page_onChange" />
        </div>
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
import back from './../components/back'

export default {
    data(){
        return{
            lists:[],
            on_count:0,
            loading:false,
            current_template:'预览区域',
            current_item:'',
            back_path:'',
            cur_page:1,
            pageSize:1,
            start:0,
            end:1,
            width:60,
            height:27.6,
            offsetX:-50,
            isActive:false,
            isPreview:true,
            duration:8,
        }
    },
    created(){
        this.loading=true
        // let isOn=false
        let isOn=true
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
        },
        leftOffset(){
            return `translateX(${this.offsetX}%)`
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
        createZone(item){
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
        page_onChange(page){
            this.start = (page-1) * this.pageSize
            this.end = this.start + this.pageSize
            this.showLists(this.lists,this.start,this.end)
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

.streamerList{
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
    overflow-x: auto;
}
.list-wrapper{
    width:95%;
    height:80%;
    font-size:17px;
}
.list-wrapper .ant-row{
    border-top:1px solid rgb(95, 91, 91);
    border-bottom: 1px solid rgb(95, 91, 91);
    margin:-1px 0 -1px 0;
    padding:3px 0px;
    div{
        background: transparent;
        border: 0;
    }
}
.zone{
    position:fixed;
    background-color: #e9f5ff80;
    left:50%;
}
.loading{
    position:fixed;
}
.preview{
    position: fixed;
    border: 1px dashed #5f5b5b;
    width: 93%;
    height: 66%;
    top: 33%;
}
.action-active:hover{
    cursor:pointer;
    color:brown;
    text-decoration: underline;
}
.pagination{
    position:fixed;
    top:25%;
}
.zone-size label{
    display: inline-block;
    padding: 7px;
}
.edit-zone{
    padding: 0 0 5px 0;
    border-bottom: 1px dashed #5f5b5b;
}
.content{
    position: relative;
    top: 40%;
}
.zone-size .ant-input-number {
    margin-top: 5px;
    width:65px;
}
.pagination .ant-pagination {
    margin-top:-3px;
}

</style>



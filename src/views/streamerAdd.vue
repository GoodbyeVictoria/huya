<template>
    <div class="streamerMain">
        <div class="top"  @click="goBack">
            <a-icon type="left-circle" theme="twoTone" twoToneColor="#FFA591" />返回主页
        </div>
        <div v-if="title_valid">
            <a-alert message="Warning" type="warning" showIcon/>
        </div>
        <a-form :form="form" @submit="handleSubmit">
            <a-form-item 
                label="请输入模板标题" 
                :label-col="{ span: 4 }" 
                :wrapper-col="{ span: 8 }"
                :help="tips"
                >
                <a-input
                    placeholder="铭文1"
                    v-decorator="[
                    'title',
                    {rules: [{ required: true, message: '请输入模板标题！' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="请输入关键字" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                <a-input
                    placeholder="铭文"
                    v-decorator="[
                    'keyWord',
                    {rules: [{ required: true, message: '请输入关键字！' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="请输入模板内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                <a-textarea 
                    placeholder="88法穿" 
                    :autosize="{ minRows: 2, maxRows: 6 }" 
                    v-decorator="[
                    'template',
                    {rules: [{ required: true, message: '请输入模板内容！' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">
                    提交
                </a-button>
            </a-form-item>
        </a-form>
        <!-- <a-button ghost @click="startListen">开始监听</a-button>
        <a-button type="primary" @click="stopListen">停止监听</a-button> -->
        
        <div class="zone" id="zone" v-show=show>
            {{info}}
        </div>
    </div>
</template>

<script>


export default {
    data(){
        return {
            formLayout:'horizontal',
            form:this.$form.createForm(this),
            info:'88法穿',
            intervalId:'',
            show:false,
            tips:'模板标题必须唯一',
            title_valid:true
        }
    },
    computed:{
        
    },
    methods:{
        goBack(){
            this.$router.push('/')
        },

        validTitle(title){
            let result=false
            hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                keys.forEach(ele => {
                    if(ele===title){
                        this.tips="标题名称重复"
                        result= false
                    }
                })
                result=true
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
            return result
        },
        handleSubmit(e){
            e.preventDefault()
            let that=this
            this.form.validateFields((err,values)=>{
                that.titile_valid=this.validTitle(values.title)
                //验证样式
                console.log(that.titile_valid)
                if(!this.title_valid){
                    console.log(that.titile_valid)
                }else if(!err&&that.titile_valid){
                    console.log("values: "+JSON.stringify(values))
                    
                    //可能多个 后面处理
                    //最多设置5个
                    hyExt.storage.setItem(values.title, values.keyWord).then(() => {
                        hyExt.logger.info('设置成功', values.keyWord)
                        that.$router.push('/templates')
                    }).catch(err => {
                        hyExt.logger.warn('设置失败', err)
                    })
                }
            })
        },
        startListen(e){
            let keyWord=""
            hyExt.storage.getItem('01').then(value => {
                keyWord=value
                hyExt.logger.info('获取成功', keyWord)
                this.listenBarrage(keyWord)
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
            //监听弹幕
            //其实还要做判断keyword是不是空
            //还可以根据弹幕禁言 可能只是警告
            //有查房 可以提醒
            //就叫弹幕助手
            
            // hyExt.context.onBarrageChange({
            //     content: keyWord
            // }, barrageInfo => {
            //     hyExt.logger.info('有新弹幕', barrageInfo)
            // }).then((barrageInfo) => {
            //     hyExt.logger.info('监听成功')
            //     if(barrageInfo){
            //         console.log(barrageInfo.sendNick)
            //     }
            //     // hyExt.stream.addZone(document.getElementById('zone')).then(() => {
            //     //     hyExt.logger.info('创建白板成功')
            //     // }).catch(err => {
            //     //     hyExt.logger.warn('创建白板失败', err)
            //     // })
            // }).catch(err => {
            //     hyExt.logger.warn('监听失败', err)
            // })
            //创建白板
            // hyExt.stream.addZone(document.getElementById('zone')).then(() => {
            //     hyExt.logger.info('创建白板成功')
            // }).catch(err => {
            //     hyExt.logger.warn('创建白板失败', err)
            // })
            //删除白板
        },
        stopListen(){
            hyExt.context.offBarrageChange()
        },
        listenBarrage(value){
            console.log(111)
            hyExt.context.onBarrageChange({
                content:value
            }, barrageInfo => {
                console.log(222)
                console.log(barrageInfo)
                // this.show=true
                //创建白板
                hyExt.logger.info('有新弹幕', barrageInfo)
            }).then(() => {
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
        }
    }
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";

 .zone{
     position:fixed;
     width:50%;
     height:50%;
     border:2px solid rosybrown;
     text-align: center;
 }
 .streamerMain{
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
 }
 .top{
    font-size: 16px;
    position: fixed;
    top: 9px;
    left: 5px;
    cursor:pointer;
 }
.anticon{
    margin-right:3px;
    font-size:20px;
 }
</style>



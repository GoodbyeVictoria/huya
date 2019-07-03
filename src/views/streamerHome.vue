<template>
    <div class="streamerHome">
        <template>
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="请输入关键字" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
                    <a-input
                        v-decorator="[
                        'keyWord',
                        {rules: [{ required: true, message: '请输入关键字！' }]}
                        ]"
                    />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 10, offset: 1 }">
                    <a-button type="primary" html-type="submit">
                        Submit
                    </a-button>
                </a-form-item>
            </a-form>
            <a-button type="primary" @click="startListen">开始监听</a-button>
            <a-button type="primary" @click="stopListen">停止监听</a-button>
        </template>
        <div class="zone" id="zone">
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
        }
    },
    methods:{
        handleSubmit(e){
            e.preventDefault()
            this.form.validateFields((err,values)=>{
                if(!err){
                    console.log("values: "+JSON.stringify(values))
                    //可能多个 后面处理
                    //最多设置5个
                    hyExt.storage.setItem('01', values.keyWord).then(() => {
                        hyExt.logger.info('设置成功', values.keyWord)
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
                hyExt.logger.info('获取成功', value)
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
            //监听弹幕
            //其实还要做判断keyword是不是空
            //还可以根据弹幕禁言 可能只是警告
            //有查房 可以提醒
            //就叫弹幕助手
            hyExt.context.onBarrageChange({
                content: keyWord
            }, barrageInfo => {
                hyExt.logger.info('有新弹幕', barrageInfo)
                hyExt.stream.addZone(document.getElementById('zone')).then(() => {
                    hyExt.logger.info('创建白板成功')
                }).catch(err => {
                    hyExt.logger.warn('创建白板失败', err)
                })
            }).then(() => {
                hyExt.logger.info('监听成功')
            }).catch(err => {
                hyExt.logger.warn('监听失败', err)
            })
            //创建白板
            //删除白板
        },
        stopListen(){
            hyExt.context.offBarrageChange()
        }
    }
}
</script>
<style lang="scss" scoped>
 .zone{
     display:none;
     position:fixed;
     width:50%;
     height:50%;
     border:2px solid rosybrown;
     text-align: center;
 }
</style>



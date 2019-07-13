<template>
    <div class="streamerMain">
        <backHome></backHome>
        <div class="form-wrapper">
            <a-form :form="form" @submit="handleSubmit" class="form">
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
                        {rules: [{ required: true, message: '请输入模板标题' }]}
                        ]"
                    />
                </a-form-item>
                <a-form-item label="请输入关键字" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                    <a-input
                        placeholder="铭文"
                        v-decorator="[
                        'keyWord',
                        {rules: [{ required: true, message: '请输入关键字' }]}
                        ]"
                    />
                </a-form-item>
                <a-form-item label="请输入模板内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                    <a-textarea 
                        placeholder="88法穿" 
                        :autosize="{ minRows: 2, maxRows: 6 }" 
                        v-decorator="[
                        'template',
                        {rules: [{ required: true, message: '请输入模板内容' }]}
                        ]"
                    />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" :disabled="disabled" html-type="submit">
                        提交
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
import backHome from './../components/backHome'

export default {
    data(){
        return {
            formLayout:'horizontal',
            form:this.$form.createForm(this),
            tips:'模板标题必须唯一',
            title_valid:true,
            is_finish:false,
            disabled:false,
        }
    },
    components:{
        backHome
    },
    methods:{
        goBack(){
            this.$router.push('/')
        },
        validTitle(title,callBack){
            hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                this.title_valid=keys.every(ele=>{
                    return ele!==title
                })
                callBack()
                
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
        },
        handleSubmit(e){
            e.preventDefault()
            this.disabled=true
            // let value=this.form.getFieldValue('title')
            this.form.validateFields((err,values)=>{
                if(err){
                    this.disabled=false
                }else{
                    this.$message.loading('loading').then(()=>{
                        hyExt.storage.getKeys().then(keys => {
                            hyExt.logger.info('获取成功', keys)
                            this.title_valid=keys.every(ele=>{
                                return ele!==values.title
                            })
                            if(!this.title_valid){
                                this.$message.error('标题名称重复');
                                this.disabled=false
                            }else if(this.title_valid&&!err){
                                let value=JSON.stringify(values)
                                hyExt.storage.setItem(values.title, value).then(() => {
                                    hyExt.logger.info('设置成功', values.keyWord)
                                    this.is_finish=true
                                    this.disabled=false
                                    this.$message.success('添加成功', 1).then(this.goBack)
                                }).catch(err => {
                                    hyExt.logger.warn('设置失败', err)
                                })
                            }
                                    
                        }).catch(err => {
                            hyExt.logger.warn('获取失败', err)
                        })
                    })
                }
                //验证样式
            })
        },
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
.anticon{
    margin-right:3px;
    font-size:20px;
 }
 .alert{
     position:fixed;
     top:52px;
 }
</style>



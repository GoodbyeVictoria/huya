<template>
    <div class="streamerMain">
        <back :path="back_path" content="返回模板列表"></back>
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
                    <!-- <a-textarea 
                        :autosize="{ minRows: 2, maxRows: 6 }" 
                        v-decorator="['template',{rules: [{ required: true, message: '请输入模板内容' }]}]"
                    /> -->
                    <a-input
                        placeholder="88法穿"
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
import back from './../components/back'

export default {
    props:['item_key','item_title'],
    data(){
        return {
            formLayout:'horizontal',
            form:this.$form.createForm(this),
            tips:'模板标题必须唯一',
            title_valid:true,
            is_finish:false,
            disabled:false,
            template:'',
            cur_item:'',
            back_path:'list'
        }
    },
    components:{
        back
    },
    mounted(){
        this.cur_item=this.$store.state.cur_item
        this.form.setFieldsValue({...this.cur_item.value})
    },
    methods:{
        goBack(){
            //yonghistory
            this.$router.push(`/${this.back_path}`)
        },
        getList(err,values){
            this.api.request({method:'POST',service:'getList'}).then(result =>{
                if(result.code==0){
                    let data = result.data
                    this.title_valid=data.every(ele=>{
                        return ele.list_key!==values.title||values.title==this.item_title
                    })
                    if(!this.title_valid){
                        this.$message.error('与已有标题名称重复');
                        this.disabled=false
                    }else if(this.title_valid&&!err){
                        let value=JSON.stringify(values)
                        let questParams = {
                            service:'updateList',
                            params:{
                                id:this.item_key,
                                list_key:values.title,
                                list_value:value
                            }
                        }
                        this.updateList(questParams)
                    }
                }
            }).catch(err=>{
                console.log(err.message)
            })
        },
        updateList(questParams){
            this.api.request(questParams).then(()=>{
                this.is_finish=true
                this.disabled=false
                this.$message.success('修改成功', 1).then(this.goBack)
            }).catch(err=>{
                console.log(err.message)
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
                        this.getList(err,values)
                        // hyExt.storage.getKeys().then(keys => {
                        //     hyExt.logger.info('获取成功', keys)
                        //     this.title_valid=keys.every(ele=>{
                        //         return ele!==values.title||values.title==this.item_key
                        //     })
                        //     if(!this.title_valid){
                        //         this.$message.error('与已有标题名称重复');
                        //         this.disabled=false
                        //     }else if(this.title_valid&&!err){
                        //         let value=JSON.stringify(values)
                        //         hyExt.storage.setItem(this.item_key, value).then(() => {
                        //             hyExt.logger.info('设置成功', values.keyWord)
                        //             this.is_finish=true
                        //             this.disabled=false
                        //             this.$message.success('修改成功', 1).then(this.goBack)
                        //         }).catch(err => {
                        //             hyExt.logger.warn('设置失败', err)
                        //         })
                        //     }
                                    
                        // }).catch(err => {
                        //     hyExt.logger.warn('获取失败', err)
                        // })
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

 .streamerMain{
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
 }
.alert{
     position:fixed;
     top:52px;
 }
 .textarea{
    max-width: 100%;
    height: auto;
    vertical-align: bottom;
    transition: all 0.3s, height 0s;
    min-height: 32px;
 }
</style>



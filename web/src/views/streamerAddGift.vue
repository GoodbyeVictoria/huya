<template>
    <div class="streamerAddGift">
        <div class="form-wrapper">
            <a-form :form="form" @submit="handleSubmit" class="form">
                <a-form-item 
                    label="请输入模板标题" 
                    :label-col="{ span: 4 }" 
                    :wrapper-col="{ span: 8 }"
                    :help="tips"
                    >
                    <a-input
                        placeholder="虎粮"
                        v-decorator="[
                        'title',
                        {rules: [{ required: true, message: '请输入模板标题' }]}
                        ]"
                    />
                </a-form-item>
                <a-form-item label="请选择礼物" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                    <a-select
                        v-decorator="[
                            'keyWord',
                            { initialValue: '虎粮' },
                            {rules: [{ required: true, message: '请选择礼物' }]}
                        ]"
                        >
                        <a-select-option :value="gift" v-for="(gift,idx) in giftList" :key="idx">
                            {{gift}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="请输入模板内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }" :help="contentTips">
                    <a-input
                        placeholder="谢谢老板！老板大气！"
                        v-decorator="[
                        'template',
                        {rules: [{ required: false, message: '请输入模板内容' }]}
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

export default {
    data(){
        return {
            formLayout:'horizontal',
            form:this.$form.createForm(this),
            tips:'模板标题必须唯一',
            title_valid:true,
            is_finish:false,
            disabled:false,
            contentTips:'默认内容包含送礼人、礼物个数和礼物名称，模板内容自动拼接到默认内容后面，例如：感谢小虎牙送的10个虎粮！老板大气！',
            giftList:['虎粮','宝剑','荧光棒','血瓶','火锅','魔法书','钞票枪','虎牙一号','奖杯','高能预警','藏宝图','礼盒','星云战机','超时空战舰'],
        }
    },
    components:{
    },
    methods:{
        goBack(){
            this.$router.push('/')
        },
        handleSubmit(e){
            e.preventDefault()
            this.disabled=true
            // let value=this.form.getFieldValue('keyWord')
            // console.log(value)
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
                                let param = {
                                    isGift:true,
                                    ...values
                                }
                                let value=JSON.stringify(param)
                                hyExt.storage.setItem(values.title, value).then(() => {
                                    hyExt.logger.info('设置成功')
                                    this.$store.commit('addItem',{key:values.title,value:param})
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

 .streamerAddGift{
    @include flexCenter;
    @include flex-direction(column);
    width: 100%;
    height: 100%;
    .ant-btn-primary {
        width:33%;
        margin-top: 30px;
    }
    .textarea {
        max-width: 100%;
        height: auto;
        vertical-align: bottom;
        transition: all 0.3s, height 0s;
        min-height: 32px;
    }
    .form-wrapper {
        padding: 23px 28px 8px 28px;
        background-color: #fafafa99;
        border-radius: 10px;
        width: 90%;
        margin-top: -8%;
        .ant-row:first-child{
            margin-bottom:10px;
        }
    }
    
 }
 .alert{
     position:fixed;
     top:52px;
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
</style>



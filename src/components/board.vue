<template>
    <div class="container">
        <template>
            <a-textarea placeholder="Basic usage" :rows="4"/>
        </template>
    </div>
</template>
<script>

export default {
    // components:{
    //     Input
    // }
    created(){
        console.log(111)
        hyExt.context.onBarrageChange({
            content:"nini"
        }, barrageInfo => {
            console.log(222)
            console.log(barrageInfo)
            hyExt.logger.info('有新弹幕', barrageInfo)
        }).then((barrageInfo) => {
            hyExt.logger.info('监听成功')
        }).catch(err => {
            hyExt.logger.warn('监听失败', err)
        })
    }
    
}
</script>

<style lang="scss">
@import "./../assets/scss/partial/flex";
.container{
    width:26rem;
    height:26rem;
    font-size:16px;
    border:2px solid #E89BA3;
    border-radius: 2px;
}
</style>


<template>
    <div class="top"  @click="goBack">
        <a-icon type="left-circle" theme="twoTone" twoToneColor="#FFA591" />返回主页
    </div>
</template>

<script>
export default {
    methods:{
        goBack(){
            this.$router.push('/')
        }
    }
}
</script>
<style scoped>
.top{
    font-size: 16px;
    position: fixed;
    top: 9px;
    left: 5px;
    cursor:pointer;
 }
</style>



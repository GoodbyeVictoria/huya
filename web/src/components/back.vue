<template>
    <div class="top"  @click="goBack">
        <!-- <a-icon type="left" theme="twoTone" twoToneColor="#FFA591" />{{content}} -->
        <a-icon type="arrow-left" />
    </div>
</template>

<script>
export default {
    props:['path','content'],
    methods:{
        goBack(){
            this.$router.push(`/${this.path}`)
        }
    }
}
</script>
<style scoped>
.top{
    font-size: 17px;
    position: fixed;
    top: 11px;
    left: 8px;
    width: 14%;
    cursor: pointer;
    box-shadow: 1px 1px 6px 1px #0000001f;
    border-radius: 14px;
 }
</style>



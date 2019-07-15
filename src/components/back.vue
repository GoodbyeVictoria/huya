<template>
    <div class="top"  @click="goBack">
        <a-icon type="left-circle" theme="twoTone" twoToneColor="#FFA591" />{{content}}
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
    font-size: 16px;
    position: fixed;
    top: 9px;
    left: 5px;
    cursor:pointer;
 }
</style>



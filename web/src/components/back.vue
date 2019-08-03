<template>
    <div class="top"  @click="goBack">
        <a-icon type="arrow-left" />
    </div>
</template>

<script>
export default {
    methods:{
        goBack(){
            window.history.length > 1 ?
            this.$router.go(-1):
            this.$router.push('/')
        }
    }
}
</script>
<style scoped>
.top {
    font-size: 17px;
    position: fixed;
    top: 7px;
    left: 2px;
    width: 14%;
    cursor: pointer;
    border-radius: 14px;
 }
</style>



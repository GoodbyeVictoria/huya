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
<style scoped lang="scss">
.top {
    font-size: 17px;
    position: fixed;
    top: 7px;
    left: 2px;
    width: 14%;
    cursor: pointer;
    border-radius: 14px;
    transform: scale(1.0);
    transition: all 0.1s;
    &:hover {
        transform: scale(1.1);
        transition: all 0.1s;
    }
 }
</style>



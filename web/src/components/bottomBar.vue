<template>
    <div class="bottomBar">
        <a-row>
            <a-col :span=8 @click="goHome"><a-icon type="home" /></a-col>
            <a-col :span=8 @click="gotoList"><a-icon type="profile" /></a-col>
            <a-col :span=8 @click="gotoBoader"><a-icon type="border" /></a-col>
        </a-row>
    </div>
</template>

<script>
export default {
   data(){
       return {

       }
   },
   methods: {
       goHome(){
            this.$router.push('/')
       },
       gotoList(){
           this.$router.push('/list')
       },
       gotoBoader(){
           this.$router.push('/main')
       },

   }
}
</script>

<style lang="scss" scoped>
@import "./../assets/scss/partial/flex";

.bottomBar {
    @include flexCenter;
    position:fixed;
    width:100%;
    height:9%;
    top:91%;
    background-color: #fafafac2;
    .ant-row {
        width: 100%;
        height:100%;
        font-size: 20px;
        .ant-col-8 {
            height:100%;
            @include flexCenter;
            box-shadow: inset 0px 0px 0px 0px #ffffff;
            &:hover{
                cursor:pointer;
                box-shadow: 1px 1px 6px 1px #0000001f;
                transition:box-shadow 0.3s;
            }
        }
        
    }
}
</style>



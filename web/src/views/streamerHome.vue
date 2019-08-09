<template>
    <div class="streamerHome">
        <div class="button" @click="goToList">查看模板列表</div>
        <div class="button" @click="goToAdd">创建弹幕模板</div>
        <div class="button" @click="goToGift">创建礼物模板</div>
    </div>
</template>

<script>

export default {
    data(){
        return {
            
        }
    },
    computed:{
        
    },
    methods:{
        goToAdd(){
            this.$router.push('/add')
        },
        goToList(){
            this.$router.push('/list')
        },
        goToGift(){
            this.$router.push('/addGift')
        },
    },
}
</script>
<style lang="scss">
@import "./../assets/scss/partial/flex";
@import "./../assets/animate.css";

.streamerHome{
    @include flexCenter;
    @include flex-direction(column);
    font-family: Microsoft YaHei;
    width: 100%;
    height: 100%;
}

@keyframes twink {
    50%{
        box-shadow:0px 1px 13px 7px #0000001f;
    }
}
@keyframes upDown{
    50%{
        transform:translateY(5px);
    }
}
@keyframes grow{
    100%{
        transform:scale(1.1);
    }
}
.intro-wrapper{
    line-height: 2.5;
    font-size: 17px;
    height: 246px;
    margin-bottom: 50px;
    text-shadow: 1px 0 1px black;
}
.button{
    width: 183px;
    height: 52px;
    text-align: center;
    padding: 13px;
    background-color: #fafafa94;
    box-shadow: 1px 1px 6px 1px #0000001f;
    border-radius: 10px;
    font-size: 19px;
    text-shadow: 1px 0 1px rgba(0, 0, 0, 0.99);
    animation: twink 3s infinite;
    cursor:pointer;
    transform:scale(1.0);
    transition:all 1s;
    margin-bottom: 25px;
    margin-top: 25px;
    &:hover {
        transform:scale(1.07);
        transition:all 1s;
    }
}

</style>



<template>
  <div id="app">
    
  </div>
</template>

<script>


export default {
  created(){
    
    hyExt.onLoad(()=>{
        this.api.request().then(res=>{
            console.log(res)
        })
    })
    // this.getUserInfo()
  
      
 
  },
  methods:{
      // getUserInfo() {
      //           hyExt.context.getUserInfo()
      //               .then(userInfo => {
      //                   this.userInfo = userInfo;
      //                   console.log('用户信息', userInfo);
      //               })
      //       },
  }
  
}
</script>

<style lang="scss">
  @import "./assets/scss/common.scss";
  
</style>



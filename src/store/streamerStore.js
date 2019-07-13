import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        isEmpty:''
    },
    mutations:{
        changeEmpty(state,payload){
            state.isEmpty=payload
        }
    },
    actions:{
        checkEmpty({commit}){
            hyExt.storage.getKeys().then(keys => {
                hyExt.logger.info('获取成功', keys)
                if(keys.length===0){
                    commit('changeEmpty',true)
                    // state.isEmpty=true
                }else{
                    commit('changeEmpty',false)
                    // state.isEmpty=false
                }
            }).catch(err => {
                hyExt.logger.warn('获取失败', err)
            })
        }
    }
})

export default store
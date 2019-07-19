import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        isEmpty:'',
        lists:[],
        cur_item:''
    },
    getters:{
        lists_length:state=>state.lists.length
    },
    mutations:{
        changeEmpty(state,payload){
            state.isEmpty=payload
        },
        setLists(state,payload){
            state.lists=payload.lists
        },
        getItem(state,payload){
            let key=payload.item.key
            let pos=state.lists.map(ele=>ele.key).indexOf(key)
            state.cur_item=state.lists[pos]
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
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        lists:[],
        cur_item:'',
        isPreview:'',
        cur_lists:[],
        duration:'',
        isActive:false,
        isPreview:true,
        boardExit:false,
    },
    getters:{
        lists_length:state=>state.lists.length
    },
    mutations:{
        setLists(state,payload){
            state.lists=payload.lists
        },
        getLists(state,payload){
            state.lists.push(payload.obj)
        },
        setCurLists(state,payload){
            state.cur_lists=payload.cur_lists
        },
        getItem(state,payload){
            let key=payload.item.key
            let pos=state.lists.map(ele=>ele.key).indexOf(key)
            state.cur_item=state.lists[pos]
        },
        updateItemValue(state, payload){
            let key=payload.key
            let value = payload.value
            let pos=state.lists.map(ele=>ele.key).indexOf(key)
            state.lists[pos].value = value
        },
        addItem(state, payload){
            let obj={key:payload.key,checked:false,disabled:false,show:false}
            obj.value = payload.value
            state.lists.push(obj)
        },
        removeItem(state,payload){
            state.lists.splice(payload.pos,1)
        },
        setDuration(state,payload){
            state.duration = payload.duration
        }
    },
    actions:{
        getLists({ commit }){
            hyExt.storage.getKeys().then(keys=>{
                hyExt.logger.info('获取成功', keys)
                keys.forEach(ele=>{
                    let obj={key:ele,checked:false,disabled:false,show:false}
                    hyExt.storage.getItem(ele).then(value => {
                        hyExt.logger.info('获取成功', value)
                        let data=JSON.parse(value)
                        obj.value=data
                        commit('getLists',{obj:obj})
                    }).catch(err => {
                        hyExt.logger.warn('获取失败', err)
                    })
                })
                    this.loading=false;
            }).catch(err=>{
                hyExt.logger.warn('获取失败', err)
            })
        },
        removeItem({ commit },item){
            let pos=this.lists.map(ele=>ele.key).indexOf(item.key)
            console.log(pos)
            // this.lists.splice(pos,1)
            //removeItem
            hyExt.storage.removeItem(item.key).then(()=>{
                commit('removeItem',{pos:pos})
                hyExt.logger.info('删除item成功')
            }).catch(err=>{
                hyExt.logger.warn('删除item失败', err)
            })
        },
    }
})

export default store
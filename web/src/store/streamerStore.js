import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        lists:[],
        isEmpty:true,
        cur_item:'',
        isPreview:'',
        cur_lists:[],
        duration:'',
        isActive:false,
        isPreview:true,
        boardExist:false,
        current_template:'预览区域',
        isCurListEmpty:true,
    },
    getters:{
        lists_length:state=>state.lists.length,
        cur_lists_length:state=>state.cur_lists.length,
        isCurListEmpty:state=>{
            if(state.cur_lists.length == 0){
                return true
            }else {
                return false
            }
        },
    },
    mutations:{
        checkIsEmpty(state,payload){
            state.isEmpty = payload.isEmpty
        },
        setLists(state,payload){
            state.lists=payload.lists
        },
        getLists(state,payload){
            state.lists.push(payload.obj)
        },
        addCurLists(state,payload){
            state.cur_lists.push(payload.temp)
            console.log(state.cur_lists)
        },
        popCurLists(state){
            state.cur_lists.pop()
        },
        cleanCurLists(state){
            let length = state.cur_lists.length
            state.cur_lists.splice( 0, length )
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
        },
        setCurTemp(state,payload){
            console.log(payload.cur_temp)
            state.current_template = payload.cur_temp
        },
        changeActive(state,payload){
            state.isActive = payload.isActive
        },
        changePreview(state,payload){
            state.isPreview = payload.isPreview
        },
        setBoardExist(state,payload){
            state.boardExist = payload.exist
        },
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
        checkIsEmpty({ commit }){
            hyExt.storage.getKeys().then(keys => {
                let isEmpty = keys.length == 0 ? true : false
                commit('checkIsEmpty',{ isEmpty: isEmpty })
            })
        },
    }
})

export default store
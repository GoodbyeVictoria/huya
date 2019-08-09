import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        lists:[],
        isEmpty:true,
        cur_item:'',
        cur_lists:[],
        cur_temps:[],
        boardExist:false,
        isPreview:true,
        start:0,
        end:0,
        // current_template:'预览区域',
    },
    getters:{
        lists_length:state=>state.lists.length,
        cur_lists_length:state=>state.cur_lists.length,
        cur_temps_length:state=>state.cur_temps.length,
        last_item:(state,getters) => {
            if(getters.cur_lists_length > 0) {
                return state.cur_lists[getters.cur_lists_length - 1]
            }else {
                return null
            }
        },
    },
    mutations:{
        changeStart(state,payload){
            state.start = payload.start
        },
        changeEnd(state,payload){
            state.end = payload.end
        },
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
            state.cur_lists.push({...payload})
            console.log(state.cur_lists)
        },
        popCurLists(state){
            state.cur_lists.pop()
        },
        cleanCurLists(state){
            let length = state.cur_lists.length
            state.cur_lists.splice( 0, length )
            state.start = 0
            state.end = 0
        },
        addCurTemps(state,payload){
            state.cur_temps.push(payload.title)
        },
        removeCurTemps(state,payload){
            let {title} = payload
            let pos = state.cur_temps.indexOf(title)
            state.cur_temps.splice(pos,1)
        },
        cleanCurTemps(state){
            let length = state.cur_temps.length
            state.cur_temps.splice( 0, length )
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
        setBoardExist(state,payload){
            state.boardExist = payload.exist
        },
        changePreview(state,payload){
            state.isPreview = payload.isPreview
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
        checkIsEmpty({ commit }){
            hyExt.storage.getKeys().then(keys => {
                let isEmpty = keys.length == 0 ? true : false
                commit('checkIsEmpty',{ isEmpty: isEmpty })
            })
        },
    }
})

export default store
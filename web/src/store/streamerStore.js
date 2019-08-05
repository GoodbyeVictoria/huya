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
        boardExist:false,
        current_template:'预览区域',
    },
    getters:{
        lists_length:state=>state.lists.length,
        showTemplates:state=>{
            console.log(state.cur_lists)
            while(state.cur_lists.length>=1){
                let first = state.cur_lists[0]
                state.isActive = true
                state.current_template = first
                // this.setCurTemp({cur_temp: first})
                // this.changeActive({isActive: true})
                // this.isActive = true
                let delay = this.duration * 1000
                setTimeout(() => {
                    state.isActive = false
                    // this.changeActive({isActive: false})
                    // this.isActive = false
                    state.cur_lists.pop()
                }, delay);
            }
        }
    },
    mutations:{
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
    }
})

export default store
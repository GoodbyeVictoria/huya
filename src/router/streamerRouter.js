import Vue from 'vue'
import VueRouter from 'vue-router'
import streamerHome from './../views/streamerHome'
import streamerAdd from './../views/streamerAdd'
import streamerList from './../views/streamerList'

Vue.use(VueRouter)

const routes=[
    {
        path:'/',
        name:'streamerHome',
        component:streamerHome
    },
    {
        path:'/add',
        name:'add',
        component:streamerAdd
    },
    {
        path:'/list',
        name:'list',
        component:streamerList
    },
]

const router= new VueRouter({
    routes
})

export default router
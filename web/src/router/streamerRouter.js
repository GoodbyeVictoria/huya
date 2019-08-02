import Vue from 'vue'
import VueRouter from 'vue-router'
import streamerHome from './../views/streamerHome'
import streamerAdd from './../views/streamerAdd'
import streamerList from './../views/streamerList'
import streamerUpdate from './../views/streamerUpdate'
import streamerMain from './../views/streamerMain'
import streamerAddGift from './../views/streamerAddGift'

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
        path:'/addGift',
        name:'addGift',
        component:streamerAddGift
    },
    {
        path:'/list',
        name:'list',
        component:streamerList
    },
    {
        path:'/update/:item_key',
        name:'update',
        props:true,
        component:streamerUpdate
    },
    {
        path:'/main',
        name:'main',
        props:true,
        component:streamerMain
    },
]

const router= new VueRouter({
    routes
})

export default router
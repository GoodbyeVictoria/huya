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
        path:'/main',
        name:'main',
        component:streamerAdd
    },
    {
        path:'/templates',
        name:'templates',
        component:streamerList
    },
]

const router= new VueRouter({
    routes
})

export default router
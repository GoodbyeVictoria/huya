import Vue from 'vue'
import StreamerApp from './StreamerApp.vue'
import './lib/rem.js'
import {Form,Input,Button,Icon,Alert} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import streamerStore from './store/streamerStore'
import streameRouter from './router/streamerRouter'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(Icon)
Vue.use(Alert)

new Vue({
  store:streamerStore,
  router:streameRouter,
  render: h => h(StreamerApp),
}).$mount('#aroot')

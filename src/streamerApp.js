import Vue from 'vue'
import StreamerApp from './StreamerApp.vue'
import './lib/rem.js'
import {Form,Input,Button} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import streamerStore from './store/streamerStore.js'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)

new Vue({
  streamerStore,
  render: h => h(StreamerApp),
}).$mount('#aroot')

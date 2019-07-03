import Vue from 'vue'
import StreamerApp from './StreamerApp.vue'
import './lib/rem.js'
import {Form,Input,Button} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
hyExt.context.getSubscriberSummary().then(subscriberSummary => {
  hyExt.logger.info(subscriberSummary)   // 订阅了当前直播间的订阅者的信息
})
new Vue({
  render: h => h(StreamerApp),
}).$mount('#aroot')

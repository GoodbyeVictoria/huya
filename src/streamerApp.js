import Vue from 'vue'
import StreamerApp from './StreamerApp.vue'

Vue.config.productionTip = false
hyExt.context.getSubscriberSummary().then(subscriberSummary => {
  hyExt.logger.info(subscriberSummary)   // 订阅了当前直播间的订阅者的信息
})
new Vue({
  render: h => h(StreamerApp),
}).$mount('#aroot')

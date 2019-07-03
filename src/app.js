import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import api from './lib/api.js'
import {Input,Button} from 'ant-design-vue'
import './lib/rem.js'

Vue.config.productionTip = false
Vue.prototype.api=api

Vue.use(Input)
Vue.use(Button)

new Vue({ 
  router,
  store,
  render: h => h(App),
}).$mount('#root')

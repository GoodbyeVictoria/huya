import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import api from './lib/api.js'

Vue.config.productionTip = false
Vue.prototype.api=api

new Vue({ 
  router,
  store,
  render: h => h(App),
}).$mount('#root')

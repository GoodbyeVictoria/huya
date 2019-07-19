import Vue from 'vue'
import StreamerApp from './StreamerApp.vue'
import './lib/rem.js'
import {Form,Input,Button,Icon,Alert,message,Row,Col,Switch,Spin,Dropdown,Menu,Pagination} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import streamerStore from './store/streamerStore'
import streameRouter from './router/streamerRouter'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(Icon)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Spin)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Pagination)
message.config({
  top: `52px`,
  duration: 2,
  maxCount: 3,
});
Vue.prototype.$message = message;


new Vue({
  store:streamerStore,
  router:streameRouter,
  render: h => h(StreamerApp),
}).$mount('#aroot')

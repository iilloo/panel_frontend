import Vue from 'vue'
import App from './App.vue'
//引入vue-router

import router from './router'
import VueRouter from 'vue-router'
//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入vue-js-modal，模态框插件
import VModal from 'vue-js-modal'

//引入vue-web-terminal，终端插件
import Terminal from 'vue-web-terminal'
import 'vue-web-terminal/lib/theme/dark.css'

//引入全局事件总线的实例
import EventBus from './eventBus/event_bus'
//引入websocket插件
import VueNativeSock from 'vue-native-websocket'
import createWebSocketConfig from './utils/websocket'


//全局插件
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VModal)
Vue.use(Terminal)
//使用websocket插件，并配置一些参数
Vue.use(VueNativeSock,
  'ws://192.168.124.101:8888/ws',
  createWebSocketConfig())

// 关闭生产提示
Vue.config.productionTip = false



const vm = new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  beforeCreate() {
    Vue.prototype.$bus = EventBus; //安装全局事件总线
  },
  created() {
    this.$bus.$on('login', () => {
      this.$connect()
    })
  },
  sockets: {
    onopen() {
      console.log('websocket open')
      var msg = JSON.stringify({
        type: 'token',
        data: localStorage.getItem('token')
      })
      if (msg.data !== null) {
        this.sendMsg(msg)
      }
    },
    onmessage(event) {
      const data = JSON.parse(event.data)
      if (data.type === 'token') {
        localStorage.setItem('token', data.data)
      } else if (data.type === 'error') {
        console.log('websocket message', data.type, data.data)
      }
    },
    onerrer(error) {
      console.log('websocket error', error)
    },
    onclose() {
      console.log('websocket close')

      setTimeout(() => {
          this.$connect()
      }, 3000)
    },
  },
  methods: {
    sendMsg(msg) {
      for (let i = 0; i < 100; i++) {
        if (this.$socket && this.$socket.readyState === WebSocket.OPEN) {
          console.log('websocket ready')
          this.$socket.send(msg)
          break
        } else {
          console.log('websocket not ready')
        }
      }
    },
  },
  mounted() {
    console.log('mounted')
    console.log(this.$router.currentRoute.path )
    if (this.$router.currentRoute.path !== '/login') {
      this.$connect()
    }
  },
  beforeDestroy() {
    this.$disconnect()
  }
})
window.vm = vm
export default vm

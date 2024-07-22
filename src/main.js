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
import instance from './utils/axios'


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
  data: {
    reconnectID: null,
    loading: null,
  },
  beforeCreate() {
    Vue.prototype.$bus = EventBus; //安装全局事件总线
  },
  created() {
    //当成功登录时，调用$connect方法，连接websocket
    this.$bus.$on('login', this.loginHandler)
    // //当路由跳转时，先全屏显示loading，跳转结束后再关闭loading
    // this.$bus.$on('startLoading', () => {
    //   this.loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   });
    // })
    // this.$bus.$on('closeLoading', () => {
    //   this.loading.close();
    // })
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

      this.reconnectID = setTimeout(() => {
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
    loginHandler() {
      console.log('loginHandler')
      this.$connect()
    }
  },
  mounted() {
    console.log('mounted')
    // console.log(this.$router.currentRoute.path )
    const token = localStorage.getItem('token')
    if (token === null) {
      // this.$router.push('/login')
      return
    }
    instance.get('/checkToken').then(res => {
      console.log(res)
      if (res.code === 200) {
        console.log('token有效')
        this.$connect()
      } else {
        console.log('token无效')
        // this.$router.push('/login')
      }
    }).catch(err => {
      console.log(err)
    })
    // setTimeout(() => {
    //   console.log(this.$router.currentRoute.path )
    //   if (this.$router.currentRoute.path !== '/login') {
    //     this.$connect()
    //   }
    // }, 100)

  },
  beforeDestroy() {
    this.$disconnect()
    clearTimeout(this.reconnectID)
    this.$bus.$off('login', this.loginHandler)
  }
})
window.vm = vm
export default vm

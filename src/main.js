import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.$api = 'http://127.0.0.1:8000/api'
Vue.prototype.$urlFoto = 'http://127.0.0.1:8000/'

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

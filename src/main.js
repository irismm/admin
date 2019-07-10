import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import { beforeAppCreate, eventBus } from './bus'
import './directives'
import './filters'
import './icons'
import './styles/layout.scss'
import './components/HeaderTitle'

Vue.config.productionTip = false

const app = store._vm
eventBus(app)
Object.defineProperty(Vue, '$app', { get () { return app } })
Object.defineProperty(Vue.prototype, '$app', { get () { return app } })

beforeAppCreate()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

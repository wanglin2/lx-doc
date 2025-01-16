import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/style.less'
import './styles/theme.less'
import '@/assets/iconfont/iconfont.css'

if (!window.name) {
  window.name = 'lx-doc'
}

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')

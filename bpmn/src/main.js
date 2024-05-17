import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { pinia } from './store'
import router from './router'

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')

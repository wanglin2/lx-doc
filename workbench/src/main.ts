import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import './assets/iconfont/iconfont.css';
import { pinia } from './store';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')

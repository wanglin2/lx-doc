import { createApp, ref } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { pinia } from './store'
import router from './router'
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')



import { createApp } from '/node_modules/.vite/deps/vue.js?v=5f9697d5'
import App from '/src/App.vue'
import ElementPlus from '/node_modules/.vite/deps/element-plus.js?v=5f9697d5'
import '/node_modules/element-plus/dist/index.css'
import { pinia } from '/src/store.js'
import router from '/src/router.js?t=1649505859393'
import "/node_modules/@logicflow/core/dist/style/index.css";
import "/node_modules/@logicflow/extension/lib/style/index.css";

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')

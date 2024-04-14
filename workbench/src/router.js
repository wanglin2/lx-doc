import { createRouter, createWebHashHistory } from 'vue-router';
import Index from './pages/index/Index.vue';
import Workspace from './pages/workspace/Workspace.vue';

const routes = [
    { 
        name: 'Index',
        path: '/', 
        component: Index
    },
    {
        name: 'Workspace',
        path: '/workspace',
        component: Workspace
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
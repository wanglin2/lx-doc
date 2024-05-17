import { createRouter, createWebHashHistory } from 'vue-router';
import Approval from './pages/Approval/Index.vue';
import Bpmn from './pages/Bpmn/Index.vue';

const routes = [
    {
        path: '/',
        redirect: '/approval'
    },
    {
        name: 'Approval',
        path: '/approval',
        component: Approval
    },
    {
        name: 'Bpmn',
        path: '/bpmn/:id',
        component: Bpmn
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
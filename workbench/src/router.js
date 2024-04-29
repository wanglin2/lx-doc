import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/workspace'
  },
  {
    name: 'Workspace',
    path: '/workspace',
    component: () => import('@/pages/workspace/Index.vue')
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/login/Index.vue')
  },
  {
    name: 'Error',
    path: '/error',
    component: () => import('@/pages/Error/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

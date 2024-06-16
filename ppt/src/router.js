import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Edit',
    path: '/:id',
    component: () => import('@/views/Edit.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

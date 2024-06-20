import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Edit',
    path: '/:id',
    component: () => import('@/pages/edit/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/doc/'),
  routes
})

export default router

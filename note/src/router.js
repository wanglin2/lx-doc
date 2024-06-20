import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Edit',
    path: '/:id',
    component: () => import('@/pages/edit/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/note/'),
  routes
})

export default router

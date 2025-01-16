import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/workspace'
  },
  {
    name: 'Workspace',
    path: '/workspace',
    component: () => import('@/pages/workspace/Index.vue'),
    children: [
      {
        name: 'List',
        path: '',
        component: () => import('@/pages/workspace/List.vue')
      },
      {
        name: 'Collect',
        path: 'collect',
        component: () => import('@/pages/workspace/Collect.vue')
      },
      {
        name: 'Recycle',
        path: 'recycle',
        component: () => import('@/pages/workspace/Recycle.vue')
      },
      {
        name: 'Homepage',
        path: 'homepage',
        component: () => import('@/pages/workspace/Homepage.vue')
      },
      {
        name: 'Panorama',
        path: 'panorama',
        component: () => import('@/pages/workspace/Panorama.vue')
      },
      {
        name: 'Preview',
        path: 'preview/:type/:uid',
        component: () => import('@/pages/workspace/Preview.vue')
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/login/Index.vue')
  },
  {
    name: 'Error',
    path: '/error',
    component: () => import('@/pages/error/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

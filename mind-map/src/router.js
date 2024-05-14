import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/:id',
    name: 'Edit',
    component: () => import(`./pages/Edit/Index.vue`)
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/mind-map/',
  routes
})

export default router

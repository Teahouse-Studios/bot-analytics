import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  { path: '/', component: () => import('./components/MainLayout.vue') },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

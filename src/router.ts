import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  { path: '/', component: () => import('./components/MainLayout.vue') },
  { path: '/settings', component: () => import('./components/Settings.vue') },
  { path: '/racing', component: () => import('./components/Racing.vue') },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

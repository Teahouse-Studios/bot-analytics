import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from './components/MainLayout.vue'
import Settings from './components/Settings.vue'
import Racing from './components/Racing.vue'


const routes = [
  { path: '/', component: MainLayout },
  { path: '/settings', component: Settings },
  { path: '/racing', component: Racing },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

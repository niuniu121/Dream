import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OurServices from '../views/OurServices.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/services', name: 'services', component: OurServices },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router

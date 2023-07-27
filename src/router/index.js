import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/dashboard/:dirname/map',
      name: 'map',
      component: () => import('../views/MapView.vue')
    },
    {
      path: '/dashboard/:dirname',
      name: 'dir',
      component: () => import('../views/DirView.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicy.vue')
    }
  ]
})

export default router

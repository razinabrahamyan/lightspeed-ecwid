import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
  { path: '/category/:id', name: 'category', component: () => import('./views/CategoryView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('./views/ProductView.vue') },
  { path: '/cart', name: 'cart', component: () => import('./views/CartView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router



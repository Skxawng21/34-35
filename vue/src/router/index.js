import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Menu from '../views/Menu.vue'
import Shop from '../views/Shop.vue'
import Cart from '../views/Cart.vue'
import Search from '../views/Search.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/menu', component: Menu },
  { path: '/shop', component: Shop },
  { path: '/cart', component: Cart },
  { path: '/search', component: Search }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
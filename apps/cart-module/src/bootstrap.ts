import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Cart from './pages/Cart.vue'
import './style.scss'

// Wire up the global event listener for standalone dev mode too
import { cartStore } from './store/cart'

window.addEventListener('mfe:cart:add', (e) => {
  cartStore.add((e as CustomEvent).detail)
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Cart }],
})

createApp(App).use(router).mount('#app')

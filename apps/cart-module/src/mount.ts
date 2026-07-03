import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Cart from './pages/Cart.vue'
import { cartStore } from './store/cart'
import './style.css'

// Register global event listeners once at module load time.
// Survives Vue app unmount/remount — runs exactly once per session.
window.addEventListener('mfe:cart:add', (e) => {
  cartStore.add((e as CustomEvent).detail)
})

// Clear the cart when checkout completes — the checkout MFE fires this event
// after a successful order submission.
window.addEventListener('mfe:order:placed', () => {
  cartStore.clear()
})

export function mount(el: HTMLElement) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component: Cart }],
  })

  const app = createApp(App)
  app.provide('isEmbedded', true)
  app.use(router)
  app.mount(el)

  return { unmount: () => app.unmount() }
}

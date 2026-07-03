import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import ProductList from './pages/ProductList.vue'
import ProductDetail from './pages/ProductDetail.vue'
import './style.css'

/**
 * Mount the Product Catalog Vue app into any host-supplied DOM element.
 * Uses hash history so internal routes don't conflict with the shell's router.
 * Returns an unmount handle so the host can clean up on route changes.
 */
export function mount(el: HTMLElement) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', component: ProductList },
      { path: '/product/:id', component: ProductDetail },
    ],
  })

  const app = createApp(App)
  // Signal to App.vue that it is running inside a host shell
  app.provide('isEmbedded', true)
  app.use(router)
  app.mount(el)

  return { unmount: () => app.unmount() }
}

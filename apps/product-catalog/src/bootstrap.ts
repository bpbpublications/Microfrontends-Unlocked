import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ProductList from './pages/ProductList.vue'
import ProductDetail from './pages/ProductDetail.vue'
import './style.scss'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ProductList },
    { path: '/product/:id', component: ProductDetail },
  ],
})

// Standalone mode — isEmbedded not provided, header is shown
createApp(App).use(router).mount('#app')

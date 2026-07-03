<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from '../composables/useProducts'
import { Button } from '@shop/vue-ui'

const route = useRoute()
const router = useRouter()

const { product, loading, error, fetchById } = useProduct()

const productId = computed(() => Number(route.params['id']))

onMounted(() => fetchById(productId.value))

// Track cart count via cross-MFE events
const cartCount = ref(0)
const addedToCart = ref(false)

function onCartUpdated(e: Event) {
  cartCount.value = (e as CustomEvent<{ count: number }>).detail.count
}

onMounted(() => window.addEventListener('mfe:cart:updated', onCartUpdated))
onUnmounted(() => window.removeEventListener('mfe:cart:updated', onCartUpdated))

function addToCart() {
  if (!product.value) return
  // Dispatch cross-MFE event — the Cart module's mount.ts listens for this
  window.dispatchEvent(
    new CustomEvent('mfe:cart:add', {
      detail: {
        id: product.value.id,
        title: product.value.title,
        price: product.value.price,
        image: product.value.image,
      },
    }),
  )
  addedToCart.value = true
  setTimeout(() => (addedToCart.value = false), 1500)
}

function formatPrice(price: number) {
  return price.toFixed(2)
}

function filledStars(rate: number) {
  return Math.round(rate)
}

function capitalize(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}
</script>

<template>
  <div class="product-detail">
    <div class="product-detail__topbar">
      <button class="back-btn" @click="router.back()">← Back to Catalog</button>
      <div v-if="cartCount > 0" class="cart-indicator">
        🛒 {{ cartCount }} item{{ cartCount !== 1 ? 's' : '' }} in cart
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-detail" />

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <Button @click="fetchById(productId)">Retry</Button>
    </div>

    <!-- Product -->
    <div v-else-if="product" class="detail-card">
      <div class="detail-card__image-area">
        <img :src="product.image" :alt="product.title" class="detail-card__image" />
      </div>

      <div class="detail-card__content">
        <span class="detail-card__category">{{ capitalize(product.category) }}</span>
        <h1 class="detail-card__name">{{ product.title }}</h1>

        <div class="detail-card__rating">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= filledStars(product.rating.rate) }"
          >★</span>
          <span class="detail-card__reviews">
            {{ product.rating.rate.toFixed(1) }} · {{ product.rating.count }} reviews
          </span>
        </div>

        <p class="detail-card__price">${{ formatPrice(product.price) }}</p>

        <p class="detail-card__description">{{ product.description }}</p>

        <div class="detail-card__actions">
          <Button
            size="lg"
            :variant="addedToCart ? 'success' : 'primary'"
            @click="addToCart"
          >
            {{ addedToCart ? '✓ Added!' : 'Add to Cart' }}
          </Button>
          <p v-if="cartCount > 0" class="detail-card__cart-hint">
            You have {{ cartCount }} item{{ cartCount !== 1 ? 's' : '' }} in your cart.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-detail__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.cart-indicator {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 99px;
  padding: 0.25rem 0.85rem;
}

.skeleton-detail {
  height: 400px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #dc2626;
}

.detail-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
}

@media (max-width: 700px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
}

.detail-card__image-area {
  background: #f8fafc;
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  min-height: 320px;
}

.detail-card__image {
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
}

.detail-card__content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-card__category {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
}

.detail-card__name {
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.3;
  margin: 0;
}

.detail-card__rating {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.star {
  color: #d1d5db;
  font-size: 1.1rem;
}

.star.filled {
  color: #f59e0b;
}

.detail-card__reviews {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-left: 0.4rem;
}

.detail-card__price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
}

.detail-card__description {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin: 0;
}

.detail-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.detail-card__cart-hint {
  font-size: 0.82rem;
  color: var(--primary);
  font-weight: 500;
  margin: 0;
}

</style>

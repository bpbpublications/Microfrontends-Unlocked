<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '../types/product'
import { Button } from '@shop/vue-ui'

const props = defineProps<{ product: Product }>()
const router = useRouter()

const addedToCart = ref(false)

function viewDetail() {
  router.push(`/product/${props.product.id}`)
}

function addToCart() {
  window.dispatchEvent(
    new CustomEvent('mfe:cart:add', {
      detail: {
        id: props.product.id,
        title: props.product.title,
        price: props.product.price,
        image: props.product.image,
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
  <article class="product-card" @click="viewDetail">
    <div class="product-card__image-area">
      <img :src="product.image" :alt="product.title" class="product-card__image" />
    </div>
    <div class="product-card__body">
      <span class="product-card__category">{{ capitalize(product.category) }}</span>
      <h3 class="product-card__name">{{ product.title }}</h3>
      <div class="product-card__rating">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ filled: n <= filledStars(product.rating.rate) }"
        >★</span>
        <span class="product-card__reviews">
          {{ product.rating.rate.toFixed(1) }} ({{ product.rating.count }})
        </span>
      </div>
    </div>
    <div class="product-card__footer">
      <span class="product-card__price">${{ formatPrice(product.price) }}</span>
      <div class="product-card__actions">
        <Button size="sm" variant="outline" @click.stop="viewDetail">Details</Button>
        <Button
          size="sm"
          :variant="addedToCart ? 'success' : 'primary'"
          @click.stop="addToCart"
        >{{ addedToCart ? '✓' : 'Add' }}</Button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}

.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-card__image-area {
  background: #f8fafc;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.product-card__image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.product-card__body {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.product-card__category {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
}

.product-card__name {
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.star {
  color: #d1d5db;
  font-size: 0.95rem;
}

.star.filled {
  color: #f59e0b;
}

.product-card__reviews {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-left: 0.25rem;
}

.product-card__footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.product-card__price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary);
  flex-shrink: 0;
}

.product-card__actions {
  display: flex;
  gap: 0.4rem;
}
</style>

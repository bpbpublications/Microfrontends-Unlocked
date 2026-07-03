<script setup lang="ts">
import type { CartItem } from '../store/cart'
import { cartStore } from '../store/cart'

defineProps<{ item: CartItem }>()
</script>

<template>
  <div class="cart-item">
    <img :src="item.image" :alt="item.title" class="cart-item__image" />

    <div class="cart-item__details">
      <p class="cart-item__title">{{ item.title }}</p>
      <p class="cart-item__unit-price">${{ item.price.toFixed(2) }} each</p>
    </div>

    <div class="cart-item__controls">
      <button class="qty-btn" @click="cartStore.decrement(item.id)">−</button>
      <span class="qty-value">{{ item.quantity }}</span>
      <button class="qty-btn" @click="cartStore.increment(item.id)">+</button>
    </div>

    <p class="cart-item__subtotal">${{ (item.price * item.quantity).toFixed(2) }}</p>

    <button class="cart-item__remove" title="Remove" @click="cartStore.remove(item.id)">✕</button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.cart-item__image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
  background: #f8fafc;
  border-radius: 6px;
  padding: 4px;
}

.cart-item__details {
  flex: 1;
  min-width: 0;
}

.cart-item__title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item__unit-price {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.cart-item__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.qty-btn:hover {
  background: #f3f4f6;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.cart-item__subtotal {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  flex-shrink: 0;
  min-width: 70px;
  text-align: right;
}

.cart-item__remove {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.15s;
}

.cart-item__remove:hover {
  color: #dc2626;
}
</style>

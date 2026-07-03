<script setup lang="ts">
import { computed } from 'vue'
import CartItem from '../components/CartItem.vue'
import { cartStore } from '../store/cart'
import { Button } from '@shop/vue-ui'

const isEmpty = computed(() => cartStore.items.length === 0)

function proceedToCheckout() {
  window.dispatchEvent(
    new CustomEvent('mfe:navigate', { detail: { path: '/checkout' } }),
  )
}
</script>

<template>
  <div class="cart-page">
    <h1 class="cart-page__heading">Shopping Cart</h1>

    <!-- Empty state -->
    <div v-if="isEmpty" class="empty-cart">
      <p class="empty-cart__icon">🛒</p>
      <p class="empty-cart__message">Your cart is empty.</p>
      <p class="empty-cart__hint">Browse the <strong>Product Catalog</strong> and click "Add to Cart".</p>
    </div>

    <!-- Cart items + summary -->
    <div v-else class="cart-layout">
      <div class="cart-items">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
        />
      </div>

      <aside class="cart-summary">
        <h2 class="cart-summary__heading">Order Summary</h2>

        <div class="cart-summary__row">
          <span>Items ({{ cartStore.count }})</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <div class="cart-summary__row">
          <span>Shipping</span>
          <span class="free">Free</span>
        </div>

        <div class="cart-summary__divider" />

        <div class="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>

        <Button fullWidth @click="proceedToCheckout">Proceed to Checkout</Button>
        <Button fullWidth variant="secondary" @click="cartStore.clear()">Clear Cart</Button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cart-page__heading {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

/* Empty */
.empty-cart {
  text-align: center;
  padding: 5rem 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.empty-cart__icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.empty-cart__message {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.empty-cart__hint {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Layout */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 720px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Summary */
.cart-summary {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 1rem;
}

.cart-summary__heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.cart-summary__row--total {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
}

.cart-summary__divider {
  border-top: 1px solid var(--border);
  margin: 0.25rem 0;
}

.free {
  color: var(--success);
  font-weight: 600;
}

</style>

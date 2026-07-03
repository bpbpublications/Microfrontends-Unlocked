<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProducts, useCategories } from '../composables/useProducts'
import { Button } from '@shop/vue-ui'

const { products, loading, error, fetchAll } = useProducts()
const { categories, fetchCategories } = useCategories()

const search = ref('')
const selectedCategory = ref('All')

const allCategories = computed(() => ['All', ...categories.value])

const filtered = computed(() => {
  return products.value.filter((p) => {
    const matchesCategory =
      selectedCategory.value === 'All' || p.category === selectedCategory.value
    const matchesSearch = p.title.toLowerCase().includes(search.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

onMounted(() => {
  fetchAll()
  fetchCategories()
})
</script>

<template>
  <div class="product-list">
    <div class="product-list__toolbar">
      <div>
        <h1 class="product-list__heading">All Products</h1>
        <p class="product-list__count">
          <template v-if="!loading">{{ filtered.length }} items</template>
          <template v-else>Loading…</template>
        </p>
      </div>
      <div class="product-list__filters">
        <input
          v-model="search"
          class="search-input"
          type="search"
          placeholder="Search products…"
        />
        <div class="category-tabs">
          <button
            v-for="cat in allCategories"
            :key="cat"
            class="category-tab"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat === 'All' ? 'All' : cat.replace(/\b\w/g, c => c.toUpperCase()) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <Button @click="fetchAll">Retry</Button>
    </div>

    <!-- Results -->
    <div v-else-if="filtered.length > 0" class="product-grid">
      <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
    </div>

    <!-- Empty search -->
    <div v-else class="empty-state">
      <p>No products match your search.</p>
    </div>
  </div>
</template>

<style scoped>
.product-list__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.product-list__heading {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 0.15rem;
}

.product-list__count {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.product-list__filters {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

.search-input {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  width: 220px;
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--primary);
}

.category-tabs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.category-tab {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-muted);
}

.category-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

/* Skeleton loader */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.skeleton-card {
  height: 320px;
  border-radius: 10px;
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


.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}
</style>

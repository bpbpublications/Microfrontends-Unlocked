import { ref } from 'vue'
import type { Product } from '../types/product'

const BASE_URL = 'https://fakestoreapi.com'

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${BASE_URL}/products`)
      if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`)
      products.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchAll }
}

export function useProduct() {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    product.value = null
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`)
      if (!res.ok) throw new Error(`Product not found (${res.status})`)
      product.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { product, loading, error, fetchById }
}

export function useCategories() {
  const categories = ref<string[]>([])

  async function fetchCategories() {
    try {
      const res = await fetch(`${BASE_URL}/products/categories`)
      if (!res.ok) return
      categories.value = await res.json()
    } catch {
      // non-critical — the filter just won't populate
    }
  }

  return { categories, fetchCategories }
}

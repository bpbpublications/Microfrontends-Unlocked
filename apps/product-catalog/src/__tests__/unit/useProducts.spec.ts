import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProducts, useProduct, useCategories } from '../../composables/useProducts'

const mockProduct = {
  id: 1,
  title: 'Test Shirt',
  price: 29.99,
  description: 'A nice shirt',
  category: "men's clothing",
  image: 'https://example.com/shirt.jpg',
  rating: { rate: 4.2, count: 120 },
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useProducts', () => {
  it('starts with empty state', () => {
    const { products, loading, error } = useProducts()
    expect(products.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetches and stores products', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    }))

    const { products, loading, error, fetchAll } = useProducts()
    const promise = fetchAll()
    expect(loading.value).toBe(true)
    await promise
    expect(loading.value).toBe(false)
    expect(products.value).toHaveLength(1)
    expect(products.value[0].title).toBe('Test Shirt')
    expect(error.value).toBeNull()
  })

  it('sets error on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => [],
    }))

    const { error, fetchAll } = useProducts()
    await fetchAll()
    expect(error.value).toMatch('500')
  })

  it('sets error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { error, fetchAll } = useProducts()
    await fetchAll()
    expect(error.value).toBe('Network error')
  })
})

describe('useProduct', () => {
  it('starts with null product', () => {
    const { product, loading, error } = useProduct()
    expect(product.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetches a product by id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    }))

    const { product, fetchById } = useProduct()
    await fetchById(1)
    expect(product.value?.id).toBe(1)
    expect(product.value?.title).toBe('Test Shirt')
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/products/1'))
  })

  it('sets error when product not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }))

    const { error, fetchById } = useProduct()
    await fetchById(999)
    expect(error.value).toMatch('404')
  })

  it('resets product to null on each fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    }))
    const { product, fetchById } = useProduct()
    await fetchById(1)
    expect(product.value).not.toBeNull()

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
    await fetchById(2)
    expect(product.value).toBeNull()
  })
})

describe('useCategories', () => {
  it('starts with empty categories', () => {
    const { categories } = useCategories()
    expect(categories.value).toEqual([])
  })

  it('fetches category list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ["men's clothing", 'electronics', 'jewelery', "women's clothing"],
    }))

    const { categories, fetchCategories } = useCategories()
    await fetchCategories()
    expect(categories.value).toHaveLength(4)
    expect(categories.value).toContain('electronics')
  })

  it('silently ignores fetch failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { categories, fetchCategories } = useCategories()
    await expect(fetchCategories()).resolves.toBeUndefined()
    expect(categories.value).toEqual([])
  })
})

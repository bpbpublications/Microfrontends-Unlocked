import { describe, it, expect, beforeEach } from 'vitest'
import { cartStore } from '../../store/cart'

const product1 = { id: 1, title: 'T-Shirt', price: 19.99, image: 'a.jpg' }
const product2 = { id: 2, title: 'Jeans',   price: 49.99, image: 'b.jpg' }

beforeEach(() => {
  localStorage.clear()
  cartStore.clear()
})

describe('cartStore — add', () => {
  it('adds a new product with quantity 1', () => {
    cartStore.add(product1)
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(1)
  })

  it('increments quantity when the same product is added again', () => {
    cartStore.add(product1)
    cartStore.add(product1)
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(2)
  })

  it('keeps distinct products as separate items', () => {
    cartStore.add(product1)
    cartStore.add(product2)
    expect(cartStore.items).toHaveLength(2)
  })
})

describe('cartStore — count & total', () => {
  it('count reflects the sum of all quantities', () => {
    cartStore.add(product1)
    cartStore.add(product1)
    cartStore.add(product2)
    expect(cartStore.count).toBe(3)
  })

  it('total reflects price × quantity for each item', () => {
    cartStore.add(product1) // 19.99 × 1
    cartStore.add(product2) // 49.99 × 1
    expect(cartStore.total).toBeCloseTo(69.98)
  })

  it('count and total are 0 on an empty cart', () => {
    expect(cartStore.count).toBe(0)
    expect(cartStore.total).toBe(0)
  })
})

describe('cartStore — increment & decrement', () => {
  it('increment increases the item quantity by 1', () => {
    cartStore.add(product1)
    cartStore.increment(product1.id)
    expect(cartStore.items[0].quantity).toBe(2)
  })

  it('decrement decreases the item quantity by 1', () => {
    cartStore.add(product1)
    cartStore.add(product1)
    cartStore.decrement(product1.id)
    expect(cartStore.items[0].quantity).toBe(1)
  })

  it('decrement removes the item when quantity reaches 0', () => {
    cartStore.add(product1)
    cartStore.decrement(product1.id)
    expect(cartStore.items).toHaveLength(0)
  })

  it('increment on unknown id is a no-op', () => {
    cartStore.add(product1)
    cartStore.increment(999)
    expect(cartStore.items[0].quantity).toBe(1)
  })
})

describe('cartStore — remove & clear', () => {
  it('remove deletes the item by id', () => {
    cartStore.add(product1)
    cartStore.add(product2)
    cartStore.remove(product1.id)
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].id).toBe(product2.id)
  })

  it('clear empties the cart', () => {
    cartStore.add(product1)
    cartStore.add(product2)
    cartStore.clear()
    expect(cartStore.items).toHaveLength(0)
  })
})

describe('cartStore — localStorage persistence', () => {
  it('persists items to localStorage on add', () => {
    cartStore.add(product1)
    const stored = JSON.parse(localStorage.getItem('mfe_cart_items') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(product1.id)
  })

  it('updates localStorage on remove', () => {
    cartStore.add(product1)
    cartStore.add(product2)
    cartStore.remove(product1.id)
    const stored = JSON.parse(localStorage.getItem('mfe_cart_items') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(product2.id)
  })

  it('clears localStorage on clear()', () => {
    cartStore.add(product1)
    cartStore.clear()
    const stored = JSON.parse(localStorage.getItem('mfe_cart_items') || '[]')
    expect(stored).toHaveLength(0)
  })
})

describe('cartStore — mfe:cart:updated event', () => {
  it('broadcasts mfe:cart:updated with the total item count on add', () => {
    return new Promise<void>((resolve) => {
      window.addEventListener('mfe:cart:updated', (e) => {
        const count = (e as CustomEvent<{ count: number }>).detail.count
        expect(count).toBe(1)
        resolve()
      }, { once: true })
      cartStore.add(product1)
    })
  })

  it('broadcasts count 0 after clear()', () => {
    return new Promise<void>((resolve) => {
      cartStore.add(product1)
      window.addEventListener('mfe:cart:updated', (e) => {
        const count = (e as CustomEvent<{ count: number }>).detail.count
        expect(count).toBe(0)
        resolve()
      }, { once: true })
      cartStore.clear()
    })
  })
})

import { reactive } from 'vue'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

const STORAGE_KEY = 'mfe_cart_items'

function loadItems(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persist(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Module-level singleton — survives Vue app unmount/remount when the
// user navigates away from /cart and comes back.
const state = reactive({ items: loadItems() })

function broadcastUpdate() {
  const count = state.items.reduce((s, i) => s + i.quantity, 0)
  window.dispatchEvent(
    new CustomEvent('mfe:cart:updated', { detail: { count } }),
  )
}

// Broadcast stored count immediately so the shell header badge syncs on load.
broadcastUpdate()

export const cartStore = {
  get items(): CartItem[] {
    return state.items
  },

  get count(): number {
    return state.items.reduce((s, i) => s + i.quantity, 0)
  },

  get total(): number {
    return state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  },

  add(product: Omit<CartItem, 'quantity'>) {
    const existing = state.items.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      state.items.push({ ...product, quantity: 1 })
    }
    persist(state.items)
    broadcastUpdate()
  },

  increment(id: number) {
    const item = state.items.find((i) => i.id === id)
    if (item) {
      item.quantity++
      persist(state.items)
      broadcastUpdate()
    }
  },

  decrement(id: number) {
    const item = state.items.find((i) => i.id === id)
    if (!item) return
    if (item.quantity === 1) this.remove(id)
    else {
      item.quantity--
      persist(state.items)
      broadcastUpdate()
    }
  },

  remove(id: number) {
    const idx = state.items.findIndex((i) => i.id === id)
    if (idx > -1) {
      state.items.splice(idx, 1)
      persist(state.items)
      broadcastUpdate()
    }
  },

  clear() {
    state.items.splice(0)
    persist(state.items)
    broadcastUpdate()
  },
}

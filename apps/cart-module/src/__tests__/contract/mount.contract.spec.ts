import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cartStore } from '../../store/cart'
import { mount } from '../../mount'

vi.mock('../../style.css', () => ({}))

beforeEach(() => {
  localStorage.clear()
  cartStore.clear()
})

describe('cart-module MFE — event listener contract', () => {
  it('mfe:cart:add adds the product to the cart', () => {
    const detail = { id: 10, title: 'Hoodie', price: 59.99, image: 'h.jpg' }
    window.dispatchEvent(new CustomEvent('mfe:cart:add', { detail }))
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].id).toBe(10)
    expect(cartStore.items[0].quantity).toBe(1)
  })

  it('mfe:cart:add accumulates quantity on repeat dispatches', () => {
    const detail = { id: 10, title: 'Hoodie', price: 59.99, image: 'h.jpg' }
    window.dispatchEvent(new CustomEvent('mfe:cart:add', { detail }))
    window.dispatchEvent(new CustomEvent('mfe:cart:add', { detail }))
    expect(cartStore.items[0].quantity).toBe(2)
  })

  it('mfe:order:placed clears the cart', () => {
    cartStore.add({ id: 1, title: 'T-Shirt', price: 19.99, image: 'a.jpg' })
    window.dispatchEvent(new CustomEvent('mfe:order:placed'))
    expect(cartStore.items).toHaveLength(0)
  })
})

describe('cart-module MFE — mount contract', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })

  it('mount() accepts an HTMLElement and returns an unmount handle', () => {
    const handle = mount(el)
    expect(typeof handle.unmount).toBe('function')
    handle.unmount()
  })

  it('mount() renders content into the host element', () => {
    const handle = mount(el)
    expect(el.innerHTML).not.toBe('')
    handle.unmount()
  })

  it('unmount() empties the host element', () => {
    const handle = mount(el)
    handle.unmount()
    expect(el.innerHTML).toBe('')
  })
})

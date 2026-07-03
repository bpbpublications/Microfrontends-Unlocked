import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount as mountApp } from '../../mount'

// Stub the CSS import in mount.ts so jsdom doesn't choke
vi.mock('../../style.css', () => ({}))

describe('product-catalog MFE mount contract', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('mount() accepts an HTMLElement and returns an unmount handle', () => {
    const handle = mountApp(el)
    expect(handle).toBeDefined()
    expect(typeof handle.unmount).toBe('function')
    handle.unmount()
  })

  it('mount() renders content into the host element', () => {
    const handle = mountApp(el)
    expect(el.innerHTML).not.toBe('')
    handle.unmount()
  })

  it('unmount() empties the host element', () => {
    const handle = mountApp(el)
    handle.unmount()
    expect(el.innerHTML).toBe('')
  })

  it('mount() is idempotent — calling twice on separate elements does not throw', () => {
    const el2 = document.createElement('div')
    document.body.appendChild(el2)

    const h1 = mountApp(el)
    const h2 = mountApp(el2)

    h1.unmount()
    h2.unmount()
    document.body.removeChild(el2)
  })

  it('mfe:cart:add event detail shape matches the contract', () => {
    type CartAddDetail = { id: number; title: string; price: number; image: string }
    const detail: CartAddDetail = { id: 1, title: 'T-shirt', price: 9.99, image: 'img.jpg' }
    const event = new CustomEvent<CartAddDetail>('mfe:cart:add', { detail })

    expect(typeof event.detail.id).toBe('number')
    expect(typeof event.detail.title).toBe('string')
    expect(typeof event.detail.price).toBe('number')
    expect(typeof event.detail.image).toBe('string')
  })

  it('mfe:navigate event detail shape matches the contract', () => {
    type NavigateDetail = { path: string }
    const detail: NavigateDetail = { path: '/checkout' }
    const event = new CustomEvent<NavigateDetail>('mfe:navigate', { detail })

    expect(typeof event.detail.path).toBe('string')
  })
})

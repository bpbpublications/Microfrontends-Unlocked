import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../../components/ProductCard.vue'

const mockProduct = {
  id: 42,
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'Great backpack',
  category: 'men\'s clothing',
  image: 'https://example.com/pack.jpg',
  rating: { rate: 3.9, count: 120 },
}

const RouterLinkStub = { template: '<a><slot /></a>' }
const ButtonStub = { template: '<button><slot /></button>', props: ['size', 'variant'] }

function mountCard() {
  return mount(ProductCard, {
    props: { product: mockProduct },
    global: {
      stubs: {
        Button: ButtonStub,
        RouterLink: RouterLinkStub,
      },
      mocks: {
        $router: { push: vi.fn() },
      },
    },
  })
}

describe('ProductCard', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('renders the product title', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Fjallraven Backpack')
  })

  it('renders the formatted price', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('$109.95')
  })

  it('renders the category (capitalized)', () => {
    const wrapper = mountCard()
    // capitalize() uses \b\w which uppercases after apostrophes: "men's clothing" → "Men'S Clothing"
    expect(wrapper.text()).toContain("Men'S Clothing")
  })

  it('dispatches mfe:cart:add event with correct payload on Add click', async () => {
    const wrapper = mountCard()
    const listener = vi.fn()
    window.addEventListener('mfe:cart:add', listener)

    const buttons = wrapper.findAll('button')
    const addBtn = buttons[buttons.length - 1]
    await addBtn.trigger('click')

    expect(listener).toHaveBeenCalledOnce()
    const detail = (listener.mock.calls[0][0] as CustomEvent).detail
    expect(detail.id).toBe(42)
    expect(detail.title).toBe('Fjallraven Backpack')
    expect(detail.price).toBe(109.95)
    expect(detail.image).toBe('https://example.com/pack.jpg')

    window.removeEventListener('mfe:cart:add', listener)
  })

  it('shows filled stars equal to rounded rating', () => {
    const wrapper = mountCard()
    const filledStars = wrapper.findAll('.star.filled')
    expect(filledStars).toHaveLength(Math.round(mockProduct.rating.rate))
  })

  it('renders the product image with correct alt text', () => {
    const wrapper = mountCard()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockProduct.image)
    expect(img.attributes('alt')).toBe(mockProduct.title)
  })
})

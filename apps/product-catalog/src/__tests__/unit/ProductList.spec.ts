import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import ProductList from '../../pages/ProductList.vue'

const mockProducts = [
  { id: 1, title: 'Blue Jacket', price: 49.99, description: '', category: 'men\'s clothing', image: '', rating: { rate: 4.0, count: 10 } },
  { id: 2, title: 'Silver Ring',  price: 14.99, description: '', category: 'jewelery',        image: '', rating: { rate: 3.5, count: 5  } },
  { id: 3, title: 'Laptop Stand', price: 29.99, description: '', category: 'electronics',     image: '', rating: { rate: 4.8, count: 80 } },
]

vi.mock('../../composables/useProducts', () => ({
  useProducts: vi.fn(() => ({
    products: ref(mockProducts),
    loading: ref(false),
    error: ref(null),
    fetchAll: vi.fn(),
  })),
  useCategories: vi.fn(() => ({
    categories: ref(['men\'s clothing', 'jewelery', 'electronics']),
    fetchCategories: vi.fn(),
  })),
}))

const ProductCardStub = defineComponent({
  props: ['product'],
  template: '<div class="product-card-stub">{{ product.title }}</div>',
})

const ButtonStub = { template: '<button><slot /></button>' }

function mountList() {
  return mount(ProductList, {
    global: {
      stubs: {
        ProductCard: ProductCardStub,
        Button: ButtonStub,
      },
    },
  })
}

describe('ProductList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all products when no filter is applied', () => {
    const wrapper = mountList()
    const cards = wrapper.findAll('.product-card-stub')
    expect(cards).toHaveLength(3)
  })

  it('filters products by search term', async () => {
    const wrapper = mountList()
    const input = wrapper.find('input[type="search"]')
    await input.setValue('jacket')
    await flushPromises()
    const cards = wrapper.findAll('.product-card-stub')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Blue Jacket')
  })

  it('search is case-insensitive', async () => {
    const wrapper = mountList()
    const input = wrapper.find('input[type="search"]')
    await input.setValue('RING')
    await flushPromises()
    const cards = wrapper.findAll('.product-card-stub')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Silver Ring')
  })

  it('filters products by category', async () => {
    const wrapper = mountList()
    const categoryButtons = wrapper.findAll('.category-tab')
    const electronicsBtn = categoryButtons.find(b => b.text().toLowerCase().includes('electronics'))
    expect(electronicsBtn).toBeDefined()
    await electronicsBtn!.trigger('click')
    await flushPromises()
    const cards = wrapper.findAll('.product-card-stub')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Laptop Stand')
  })

  it('shows all products when All category is selected', async () => {
    const wrapper = mountList()
    const allBtn = wrapper.find('.category-tab')
    await allBtn.trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.product-card-stub')).toHaveLength(3)
  })

  it('shows empty-state when search matches nothing', async () => {
    const wrapper = mountList()
    const input = wrapper.find('input[type="search"]')
    await input.setValue('xxxxxxxxxx')
    await flushPromises()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.findAll('.product-card-stub')).toHaveLength(0)
  })

  it('displays the item count', () => {
    const wrapper = mountList()
    expect(wrapper.text()).toContain('3 items')
  })
})

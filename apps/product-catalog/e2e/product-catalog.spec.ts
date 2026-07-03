import { test, expect } from '@playwright/test'

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and displays product cards', async ({ page }) => {
    // Wait for the skeleton loaders to disappear and real cards to appear
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })
    const cards = page.locator('.product-card')
    await expect(cards).toHaveCount(20) // fakestoreapi returns 20 products
  })

  test('search filters the product list', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })

    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('jacket')

    const cards = page.locator('.product-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)
    expect(count).toBeLessThan(20)

    // Every visible card title should contain 'jacket' (case-insensitive)
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('.product-card__name').textContent()
      expect(title?.toLowerCase()).toContain('jacket')
    }
  })

  test('clearing the search restores all products', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })

    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('jacket')
    await expect(page.locator('.product-card')).not.toHaveCount(20)

    await searchInput.clear()
    await expect(page.locator('.product-card')).toHaveCount(20)
  })

  test('clicking a category tab filters products', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })
    const allCount = await page.locator('.product-card').count()

    await page.locator('.category-tab', { hasText: /electronics/i }).click()
    const filtered = page.locator('.product-card')
    const filteredCount = await filtered.count()
    expect(filteredCount).toBeGreaterThanOrEqual(1)
    expect(filteredCount).toBeLessThan(allCount)
  })

  test('clicking a product card navigates to the detail page', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })

    await page.locator('.product-card').first().click()

    // Detail page shows the back button and an Add to Cart button
    await expect(page.locator('.back-btn')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.detail-card__price')).toBeVisible()
  })

  test('back button returns to the product list', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 })
    await page.locator('.product-card').first().click()
    await expect(page.locator('.back-btn')).toBeVisible({ timeout: 10_000 })

    await page.locator('.back-btn').click()
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10_000 })
  })
})

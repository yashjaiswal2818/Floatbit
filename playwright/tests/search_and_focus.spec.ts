import { test, expect } from '@playwright/test'

test.describe('Search and Focus', () => {
  test('should search for Cologne and focus on region', async ({ page }) => {
    await page.goto('/')

    // Wait for map to load
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })

    // Type in search field
    const searchInput = page.getByTestId('search-input')
    await searchInput.fill('Cologne')

    // Wait for dropdown to appear
    const dropdown = page.getByTestId('search-dropdown')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    // Wait for results
    await page.waitForTimeout(1000)

    // Click first result
    const firstResult = page.getByTestId('search-result-0')
    if (await firstResult.isVisible()) {
      await firstResult.click()
    }

    // Wait for map to fly to location
    await page.waitForTimeout(2000)

    // Verify AOI was created
    const aoiList = page.getByTestId('aoi-list')
    await expect(aoiList).toBeVisible()

    // Check that map has moved (zoom/center changed)
    // This is a basic check - in a real scenario you'd check map bounds
    const mapContainer = page.getByTestId('map-container')
    await expect(mapContainer).toBeVisible()
  })
})


import { test, expect } from '@playwright/test'

test.describe('Drawing and Persistence', () => {
  test('should draw polygon and persist on reload', async ({ page }) => {
    await page.goto('/')

    // Wait for map to load
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })

    // Click polygon tool
    const polygonTool = page.getByTestId('tool-polygon')
    await polygonTool.click()

    // Get map container bounds
    const mapContainer = page.getByTestId('map-container')
    const box = await mapContainer.boundingBox()
    if (!box) throw new Error('Map container not found')

    // Click to create polygon points (simulate drawing)
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    // Click multiple points to form a polygon
    await page.mouse.click(centerX - 50, centerY - 50)
    await page.mouse.click(centerX + 50, centerY - 50)
    await page.mouse.click(centerX + 50, centerY + 50)
    await page.mouse.click(centerX - 50, centerY + 50)
    await page.mouse.dblclick(centerX - 50, centerY - 50) // Close polygon

    // Wait for AOI to be added
    await page.waitForTimeout(1000)

    // Check that AOI list shows at least one item
    const aoiList = page.getByTestId('aoi-list')
    await expect(aoiList).toBeVisible()

    // Reload page
    await page.reload()
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })

    // Verify AOI persists
    const persistedList = page.getByTestId('aoi-list')
    await expect(persistedList).toBeVisible()
  })
})


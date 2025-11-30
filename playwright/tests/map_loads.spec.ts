import { test, expect } from '@playwright/test'

test.describe('Map Loading', () => {
  test('should load map canvas and WMS tiles', async ({ page }) => {
    await page.goto('/')

    // Wait for map container to be visible
    const mapContainer = page.getByTestId('map-container')
    await expect(mapContainer).toBeVisible()

    // Wait for map to initialize (check for Leaflet classes)
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })

    // Check that WMS tile requests are made
    const wmsRequests = []
    page.on('request', (request) => {
      if (request.url().includes('wms.nrw.de')) {
        wmsRequests.push(request.url())
      }
    })

    // Wait a bit for tiles to load
    await page.waitForTimeout(2000)

    // Verify at least one WMS request was made
    expect(wmsRequests.length).toBeGreaterThan(0)
  })
})


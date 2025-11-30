import { describe, it, expect, beforeEach } from 'vitest'
import { saveToStorage, loadFromStorage } from '../storage'
import type { FeatureCollection } from 'geojson'

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should serialize and deserialize AOIs', () => {
    const features: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'test-1',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: {
            name: 'Test Area',
            visible: true,
          },
        },
      ],
    }

    saveToStorage(features)
    const loaded = loadFromStorage()

    expect(loaded).not.toBeNull()
    expect(loaded?.type).toBe('FeatureCollection')
    expect(loaded?.features).toHaveLength(1)
    expect(loaded?.features[0].id).toBe('test-1')
    expect(loaded?.features[0].properties?.name).toBe('Test Area')
  })

  it('should return null for invalid storage data', () => {
    localStorage.setItem('aoi-map-app-features', 'invalid json')
    const loaded = loadFromStorage()
    expect(loaded).toBeNull()
  })

  it('should return null when storage is empty', () => {
    const loaded = loadFromStorage()
    expect(loaded).toBeNull()
  })
})


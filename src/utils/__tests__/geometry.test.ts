import { describe, it, expect } from 'vitest'
import { calculatePolygonArea } from '../geometry'
import type { Feature, Polygon } from 'geojson'

describe('Geometry Utils', () => {
  it('should calculate area of simple polygon', () => {
    const polygon: Feature<Polygon> = {
      type: 'Feature',
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
      properties: {},
    }

    const area = calculatePolygonArea(polygon)
    expect(area).toBeGreaterThan(0)
    expect(typeof area).toBe('number')
  })

  it('should return 0 for non-polygon features', () => {
    const point: Feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {},
    }

    // @ts-expect-error - testing invalid input
    const area = calculatePolygonArea(point)
    expect(area).toBe(0)
  })
})


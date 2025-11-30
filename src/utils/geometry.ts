import type { Feature, Polygon } from 'geojson'
// @ts-expect-error - turf types issue
import { area } from '@turf/turf'

/**
 * Calculate the area of a polygon feature in square meters
 */
export function calculatePolygonArea(feature: Feature<Polygon>): number {
  if (feature.geometry.type !== 'Polygon') {
    return 0
  }
  return area(feature)
}

/**
 * Simplify polygon coordinates using turf
 */
export function simplifyPolygon(feature: Feature<Polygon>): Feature<Polygon> {
  // For now, return as-is. Can be enhanced with turf.simplify if needed
  return feature
}

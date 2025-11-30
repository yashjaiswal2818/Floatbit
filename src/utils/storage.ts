import type { FeatureCollection } from 'geojson'

const STORAGE_KEY = 'aoi-map-app-features'

export function saveToStorage(features: FeatureCollection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function loadFromStorage(): FeatureCollection | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as FeatureCollection
    // Validate structure
    if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
      return parsed
    }
    return null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

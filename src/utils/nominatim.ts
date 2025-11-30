export interface NominatimResult {
  place_id: number
  licence: string
  powered_by: string
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  geojson?: {
    type: string
    coordinates: number[][]
  }
}

export interface NominatimResponse {
  results: NominatimResult[]
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'

export async function searchNominatim(
  query: string,
  limit = 10
): Promise<NominatimResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: limit.toString(),
      addressdetails: '1',
      polygon_geojson: '1',
      extratags: '1',
    })

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'AOI-Map-App/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`)
    }

    const data = (await response.json()) as NominatimResult[]
    return data
  } catch (error) {
    console.error('Nominatim search error:', error)
    return []
  }
}

export function getBoundingBox(result: NominatimResult): [[number, number], [number, number]] {
  const [minLat, maxLat, minLon, maxLon] = result.boundingbox.map(parseFloat)
  return [
    [minLon, minLat],
    [maxLon, maxLat],
  ]
}


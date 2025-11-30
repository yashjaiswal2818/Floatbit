import { useState, useEffect, useRef } from 'react'
import { searchNominatim, getBoundingBox, type NominatimResult } from '../utils/nominatim'
import { useMapStore } from '../store/useMapStore'
import { debounce } from '../utils/debounce'
import type { Feature, Polygon } from 'geojson'

export function SearchField() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { map, addAoi, focusAoi } = useMapStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = debounce(async (searchQuery: unknown) => {
    const query = searchQuery as string
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchResults = await searchNominatim(query, 10)
    setResults(searchResults)
    setIsOpen(searchResults.length > 0)
    setSelectedIndex(-1)
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  const handleSelect = (result: NominatimResult) => {
    setQuery(result.display_name)
    setIsOpen(false)
    setResults([])

    if (!map) return

    const bbox = getBoundingBox(result)
    const leafletBounds: [[number, number], [number, number]] = [
      [bbox[0][1], bbox[0][0]],
      [bbox[1][1], bbox[1][0]],
    ]
    map.fitBounds(leafletBounds, {
      padding: [50, 50],
    })

    let feature: Feature<Polygon> | null = null

    if (result.geojson && result.geojson.type === 'Polygon' && Array.isArray(result.geojson.coordinates)) {
      const coords = result.geojson.coordinates
      let polygonCoords: number[][][]
      if (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && typeof coords[0][0][0] === 'number') {
        polygonCoords = coords as unknown as number[][][]
      } else {
        polygonCoords = []
      }
      
      if (polygonCoords.length > 0) {
        feature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: polygonCoords,
          },
          properties: {
            name: result.display_name,
            source: 'search',
          },
        }
      }
    }
    
    if (!feature) {
      const [min, max] = bbox
      feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [min[0], min[1]],
              [max[0], min[1]],
              [max[0], max[1]],
              [min[0], max[1]],
              [min[0], min[1]],
            ],
          ],
        },
        properties: {
          name: result.display_name,
          source: 'search',
        },
      }
    }

    if (feature) {
      addAoi(feature)
      if (feature.id) {
        focusAoi(feature.id as string)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" data-testid="search-field-container">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          placeholder="Search a city, town, region…"
          className="w-full h-11 pl-10 pr-4 border border-inputBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="search-input"
          aria-label="Search location"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-toolbarIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
          data-testid="search-dropdown"
          role="listbox"
        >
          {results.map((result, index) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-2 h-10 hover:bg-sidebar transition-colors ${
                index === selectedIndex ? 'bg-sidebar' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
              data-testid={`search-result-${index}`}
            >
              <div className="text-sm text-gray-900">{result.display_name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {result.type} • {result.class}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


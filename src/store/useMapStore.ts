import { create } from 'zustand'
import type { Map } from 'leaflet'
import L from 'leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import { saveToStorage as saveToStorageUtil, loadFromStorage } from '../utils/storage'

export type DrawMode =
  | 'none'
  | 'edit'
  | 'curve'
  | 'rectangle'
  | 'polygon'
  | 'erase'

export type MapViewMode = 'base' | 'vector'

interface MapState {
  map: Map | null
  drawMode: DrawMode
  aoiFeatures: FeatureCollection
  selectedAoiId: string | null
  wmsVisible: boolean
  mapViewMode: MapViewMode
  setMap: (map: Map | null) => void
  setDrawMode: (mode: DrawMode) => void
  addAoi: (feature: Feature) => void
  updateAoi: (id: string, feature: Feature) => void
  deleteAoi: (id: string) => void
  toggleVisibility: (id: string) => void
  focusAoi: (id: string) => void
  reorderAois: (fromIndex: number, toIndex: number) => void
  loadFromStorage: () => void
  saveToStorage: () => void
  setWmsVisible: (visible: boolean) => void
  setMapViewMode: (mode: MapViewMode) => void
  setSelectedAoiId: (id: string | null) => void
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null

const debouncedSave = (features: FeatureCollection) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(() => {
    saveToStorageUtil(features)
  }, 500)
}

export const useMapStore = create<MapState>((set, get) => ({
  map: null,
  drawMode: 'none',
  aoiFeatures: {
    type: 'FeatureCollection',
    features: [],
  },
  selectedAoiId: null,
  wmsVisible: true,
  mapViewMode: 'base',

  setMap: (map) => set({ map }),

  setDrawMode: (mode) => set({ drawMode: mode }),

  addAoi: (feature) => {
    const newFeature: Feature = {
      ...feature,
      id: feature.id || `aoi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      properties: {
        ...feature.properties,
        visible: feature.properties?.visible !== false,
        createdAt: Date.now(),
      },
    }
    set((state) => {
      const newState = {
        aoiFeatures: {
          ...state.aoiFeatures,
          features: [...state.aoiFeatures.features, newFeature],
        },
      }
      debouncedSave(newState.aoiFeatures)
      return newState
    })
  },

  updateAoi: (id, feature) => {
    set((state) => {
      const newState = {
        aoiFeatures: {
          ...state.aoiFeatures,
          features: state.aoiFeatures.features.map((f) =>
            f.id === id ? { ...feature, id, properties: { ...f.properties, ...feature.properties } } : f
          ),
        },
      }
      debouncedSave(newState.aoiFeatures)
      return newState
    })
  },

  deleteAoi: (id) => {
    set((state) => {
      const newState = {
        aoiFeatures: {
          ...state.aoiFeatures,
          features: state.aoiFeatures.features.filter((f) => f.id !== id),
        },
        selectedAoiId: state.selectedAoiId === id ? null : state.selectedAoiId,
      }
      debouncedSave(newState.aoiFeatures)
      return newState
    })
  },

  toggleVisibility: (id) => {
    set((state) => {
      const newState = {
        aoiFeatures: {
          ...state.aoiFeatures,
          features: state.aoiFeatures.features.map((f) =>
            f.id === id
              ? { ...f, properties: { ...f.properties, visible: !(f.properties?.visible !== false) } }
              : f
          ),
        },
      }
      debouncedSave(newState.aoiFeatures)
      return newState
    })
  },

  focusAoi: (id) => {
    const feature = get().aoiFeatures.features.find((f) => f.id === id)
    if (feature && feature.geometry.type === 'Polygon' && get().map) {
      const coordinates = feature.geometry.coordinates[0]
      const latLngs = coordinates.map((coord) => L.latLng(coord[1], coord[0]))
      const bounds = L.latLngBounds(latLngs)
      const mapInstance = get().map
      if (mapInstance) {
        mapInstance.fitBounds(bounds, {
          padding: [50, 50],
        })
      }
    }
    set({ selectedAoiId: id })
  },

  reorderAois: (fromIndex, toIndex) => {
    set((state) => {
      const features = [...state.aoiFeatures.features]
      const [removed] = features.splice(fromIndex, 1)
      features.splice(toIndex, 0, removed)
      const newState = {
        aoiFeatures: {
          ...state.aoiFeatures,
          features,
        },
      }
      debouncedSave(newState.aoiFeatures)
      return newState
    })
  },

  loadFromStorage: () => {
    const features = loadFromStorage()
    if (features && features.features.length > 0) {
      set({ aoiFeatures: features })
    }
  },

  saveToStorage: () => {
    saveToStorageUtil(get().aoiFeatures)
  },

  setWmsVisible: (visible) => set({ wmsVisible: visible }),

  setMapViewMode: (mode) => set({ mapViewMode: mode }),

  setSelectedAoiId: (id) => set({ selectedAoiId: id }),
}))

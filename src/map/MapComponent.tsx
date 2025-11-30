import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { useMapStore } from '../store/useMapStore'
import type { Feature } from 'geojson'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const nrwBounds: [[number, number], [number, number]] = [
  [50.3, 5.8],
  [52.5, 9.5],
]

function MapController() {
  const map = useMap()
  const drawRef = useRef<any>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())
  const {
    setMap,
    drawMode,
    aoiFeatures,
    addAoi,
    updateAoi,
    deleteAoi,
    setDrawMode,
  } = useMapStore()

  useEffect(() => {
    setMap(map)
    return () => {
      setMap(null)
    }
  }, [map, setMap])

  useEffect(() => {
    if (!map) return

    drawnItemsRef.current.addTo(map)

    const drawOptions: any = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: false,
        },
        rectangle: {
          showArea: false,
        },
        circle: false,
        marker: false,
        circlemarker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: false,
      },
      displayControlsDefault: false,
    }

    const aoiStyle: L.PathOptions = {
      color: '#E8D6A1',
      weight: 3,
      fillColor: 'transparent',
      fillOpacity: 0,
      dashArray: '10, 5',
      opacity: 1,
    }

    drawnItemsRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        layer.setStyle(aoiStyle)
      }
    })

    const drawControl = new (L.Control as any).Draw(drawOptions)
    
    if (drawControl && drawControl._container) {
      drawControl._container.style.display = 'none'
    }
    
    const originalDisableLayerEdit = (drawControl as any)._disableLayerEdit
    if (originalDisableLayerEdit) {
      (drawControl as any)._disableLayerEdit = function(layer: any) {
        try {
          if (layer && layer.editing && layer.editing.disable) {
            return originalDisableLayerEdit.call(this, layer)
          }
        } catch (e) {
          console.debug('Layer does not have edit handlers, skipping disable:', e)
        }
      }
    }
    
    map.addControl(drawControl)
    drawRef.current = drawControl
    
    setTimeout(() => {
      const drawContainer = document.querySelector('.leaflet-draw-toolbar')
      if (drawContainer) {
        ;(drawContainer as HTMLElement).style.display = 'none'
      }
    }, 100)

    const handleDrawCreated = (e: any) => {
      const { layer } = e
      const geoJson = layer.toGeoJSON() as Feature
      
      if (!geoJson.id) {
        geoJson.id = `aoi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        layer.setStyle({
          color: '#E8D6A1',
          weight: 3,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '10, 5',
          opacity: 1,
        })
      }

      addAoi(geoJson)
      drawnItemsRef.current.removeLayer(layer)
      setDrawMode('none')
    }

    const handleDrawEdited = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        const geoJson = layer.toGeoJSON() as Feature
        if (geoJson.id) {
          updateAoi(geoJson.id as string, geoJson)
        }
      })
    }

    const handleDrawDeleted = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        const geoJson = layer.toGeoJSON() as Feature
        if (geoJson.id) {
          deleteAoi(geoJson.id as string)
        }
      })
    }

    map.on((L as any).Draw.Event.CREATED, handleDrawCreated)
    map.on((L as any).Draw.Event.EDITED, handleDrawEdited)
    map.on((L as any).Draw.Event.DELETED, handleDrawDeleted)

    return () => {
      try {
        if (drawControl) {
          map.removeControl(drawControl)
        }
      } catch (e) {
        console.warn('Error removing draw control:', e)
      }
      
      map.off((L as any).Draw.Event.CREATED, handleDrawCreated)
      map.off((L as any).Draw.Event.EDITED, handleDrawEdited)
      map.off((L as any).Draw.Event.DELETED, handleDrawDeleted)
      
      try {
        drawnItemsRef.current.clearLayers()
      } catch (e) {
        console.warn('Error clearing layers:', e)
      }
    }
  }, [map, addAoi, updateAoi, deleteAoi, setDrawMode])

  useEffect(() => {
    if (!drawRef.current || !map) return

    if (drawMode === 'polygon') {
      const polygonDrawer = new (L as any).Draw.Polygon(map, {
        allowIntersection: false,
        showArea: false,
      })
      polygonDrawer.enable()
    } else if (drawMode === 'rectangle') {
      const rectangleDrawer = new (L as any).Draw.Rectangle(map, {
        showArea: false,
      })
      rectangleDrawer.enable()
    } else if (drawMode === 'none' || drawMode === 'edit') {
      if ((map as any)._drawToolbar) {
        ;(map as any)._drawToolbar.disable()
      }
    }
  }, [drawMode, map])

  useEffect(() => {
    if (!map) return

    const drawnItems = drawnItemsRef.current

    const currentLayerIds = new Set<string>()
    drawnItems.eachLayer((layer: any) => {
      const geoJson = layer.toGeoJSON() as Feature
      if (geoJson.id) {
        currentLayerIds.add(geoJson.id as string)
      }
    })

    drawnItems.eachLayer((layer: any) => {
      const geoJson = layer.toGeoJSON() as Feature
      if (geoJson.id && !aoiFeatures.features.find((f) => f.id === geoJson.id)) {
        try {
          drawnItems.removeLayer(layer)
        } catch (e) {
          console.warn('Error removing layer from feature group:', e)
          if (drawnItems.hasLayer(layer)) {
            drawnItems.removeLayer(layer)
          }
        }
      }
    })

    aoiFeatures.features.forEach((feature) => {
      if (feature.properties?.visible !== false) {
        const exists = currentLayerIds.has(feature.id as string)
        if (!exists) {
          try {
            const geoJsonLayer = L.geoJSON(feature as any, {
              style: {
                color: '#E8D6A1',
                weight: 3,
                fillColor: 'transparent',
                fillOpacity: 0,
                dashArray: '10, 5',
                opacity: 1,
              },
            })

            const layersToAdd: L.Layer[] = []
            geoJsonLayer.eachLayer((layer: any) => {
              if (feature.id) {
                (layer as any)._aoiId = feature.id
              }
              layersToAdd.push(layer)
            })

            layersToAdd.forEach((layer) => {
              drawnItems.addLayer(layer)
            })
          } catch (e) {
            console.error('Error adding feature to map:', e)
          }
        }
      } else {
        drawnItems.eachLayer((layer: any) => {
          const geoJson = layer.toGeoJSON() as Feature
          if (geoJson.id === feature.id) {
            try {
              drawnItems.removeLayer(layer)
            } catch (e) {
              console.warn('Error removing layer:', e)
            }
          }
        })
      }
    })
  }, [map, aoiFeatures])

  useMapEvents({
    click: (e) => {
      if (drawMode !== 'erase') return

      const clickedLayer = drawnItemsRef.current.getLayers().find((layer: any) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          if ('contains' in layer && typeof layer.contains === 'function') {
            return layer.contains(e.latlng)
          }
          return layer.getBounds().contains(e.latlng)
        }
        return false
      })

      if (clickedLayer) {
        const geoJson = (clickedLayer as any).toGeoJSON() as Feature
        if (geoJson.id) {
          deleteAoi(geoJson.id as string)
        }
      }
    },
  })

  return null
}

function LayerController() {
  const map = useMap()
  const { mapViewMode } = useMapStore()

  useEffect(() => {
  }, [map, mapViewMode])

  return null
}

function WMSLayer() {
  const map = useMap()

  useEffect(() => {
    const wmsLayer = L.tileLayer.wms('https://www.wms.nrw.de/geobasis/wms_nw_dop', {
      layers: 'WMS_NW_DOP',
      format: 'image/jpeg',
      transparent: false,
      version: '1.3.0',
      crs: L.CRS.EPSG3857,
      styles: '',
      attribution: '© <a href="https://www.wms.nrw.de/">Geobasis NRW</a>',
      tileSize: 256,
      maxZoom: 18,
      minZoom: 7,
      updateWhenZooming: false,
      updateWhenIdle: true,
    })

    wmsLayer.addTo(map)

    const ensureColorRendering = (e: any) => {
      const img = e.tile
      if (img && img.tagName === 'IMG') {
        img.style.setProperty('filter', 'none', 'important')
        img.style.setProperty('-webkit-filter', 'none', 'important')
        img.style.setProperty('-moz-filter', 'none', 'important')
        img.style.setProperty('-ms-filter', 'none', 'important')
        img.style.setProperty('image-rendering', 'auto', 'important')
      }
    }

    const handleTileError = (e: any) => {
      if (e.tile && e.tile.src) {
        const url = new URL(e.tile.src)
        console.debug('WMS tile loading:', url.searchParams.get('bbox'))
      }
    }

    wmsLayer.on('tileload', ensureColorRendering)
    wmsLayer.on('tileloadstart', ensureColorRendering)
    wmsLayer.on('tileerror', handleTileError)

    return () => {
      wmsLayer.off('tileload', ensureColorRendering)
      wmsLayer.off('tileloadstart', ensureColorRendering)
      wmsLayer.off('tileerror', handleTileError)
      if (map.hasLayer(wmsLayer)) {
        map.removeLayer(wmsLayer)
      }
    }
  }, [map])

  return null
}

export function MapComponent() {
  const mapViewMode = useMapStore((state) => state.mapViewMode)

  return (
    <MapContainer
      center={[51.0, 7.0]}
      zoom={8}
      minZoom={7}
      maxZoom={18}
      maxBounds={nrwBounds}
      maxBoundsViscosity={1.0}
      className="w-full h-full"
      data-testid="map-container"
    >
      {mapViewMode === 'base' && <WMSLayer />}

      {mapViewMode === 'vector' && (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      )}

      <MapController />
      <LayerController />
    </MapContainer>
  )
}

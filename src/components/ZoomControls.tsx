import { useMapStore } from '../store/useMapStore'

export function ZoomControls() {
  const { map } = useMapStore()

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  return (
    <div
      className="absolute bottom-6 left-6 flex flex-col gap-1 z-[1000]"
      data-testid="zoom-controls"
    >
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Zoom in"
        data-testid="zoom-in"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Zoom out"
        data-testid="zoom-out"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
    </div>
  )
}


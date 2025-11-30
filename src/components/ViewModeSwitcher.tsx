import { useMapStore } from '../store/useMapStore'

export function ViewModeSwitcher() {
  const { mapViewMode, setMapViewMode, setWmsVisible } = useMapStore()

  const handleModeChange = (mode: 'base' | 'vector') => {
    setMapViewMode(mode)
    setWmsVisible(mode === 'base')
  }

  return (
    <div
      className="absolute bottom-6 right-6 flex gap-1 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-1 z-[1000]"
      data-testid="view-mode-switcher"
    >
      <button
        onClick={() => handleModeChange('base')}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
          mapViewMode === 'base'
            ? 'bg-primary text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Base image view"
        data-testid="view-mode-base"
      >
        Base Image
      </button>
      <button
        onClick={() => handleModeChange('vector')}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
          mapViewMode === 'vector'
            ? 'bg-primary text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Map view"
        data-testid="view-mode-vector"
      >
        Map View
      </button>
    </div>
  )
}


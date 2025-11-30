import { useMapStore } from '../store/useMapStore'

export function AoiList() {
  const { aoiFeatures, toggleVisibility, deleteAoi, focusAoi } = useMapStore()

  if (aoiFeatures.features.length === 0) {
    return (
      <div className="text-sm text-gray-600" data-testid="aoi-list-empty">
        No areas defined yet. Search or draw on the map to create an area.
      </div>
    )
  }

  return (
    <div data-testid="aoi-list">
      <h2 className="text-sm font-medium text-gray-700 mb-2">Areas of Interest</h2>
      <div className="space-y-1">
        {aoiFeatures.features.map((feature, index) => {
          const isVisible = feature.properties?.visible !== false
          const name = feature.properties?.name || `Area ${index + 1}`

          return (
            <div
              key={feature.id}
              className="flex items-center h-10 bg-white rounded border border-inputBorder px-2 group"
              data-testid={`aoi-item-${feature.id}`}
            >
              <div
                className="w-3 h-3 rounded mr-2 flex-shrink-0"
                style={{ backgroundColor: '#E8D6A1' }}
                data-testid={`aoi-color-${feature.id}`}
              />

              <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>

              <button
                onClick={() => toggleVisibility(feature.id as string)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label={isVisible ? 'Hide area' : 'Show area'}
                data-testid={`aoi-toggle-visibility-${feature.id}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isVisible ? 'currentColor' : '#D8D8D8'}
                  strokeWidth="2"
                  className="text-toolbarIcon"
                >
                  {isVisible ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>

              <button
                onClick={() => deleteAoi(feature.id as string)}
                className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
                aria-label="Delete area"
                data-testid={`aoi-delete-${feature.id}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-red-500"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              <button
                onClick={() => focusAoi(feature.id as string)}
                className="p-1 hover:bg-gray-100 rounded transition-colors ml-1 opacity-0 group-hover:opacity-100"
                aria-label="Focus on area"
                data-testid={`aoi-focus-${feature.id}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-toolbarIcon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}


import { useState } from 'react'
import { useMapStore } from '../store/useMapStore'
import { SearchField } from './SearchField'
import { AoiList } from './AoiList'

export function Sidebar() {
  const { aoiFeatures } = useMapStore()
  const [showBack, setShowBack] = useState(false)

  const hasAois = aoiFeatures.features.length > 0

  return (
    <div
      className="w-80 h-full bg-sidebar p-6 flex flex-col"
      data-testid="sidebar"
      style={{ width: '320px' }}
    >
      {showBack && (
        <button
          onClick={() => setShowBack(false)}
          className="mb-4 text-toolbarIcon hover:text-primary transition-colors"
          aria-label="Go back"
          data-testid="back-button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <h1
        className="text-[20px] font-semibold text-primary mb-2"
        data-testid="page-title"
      >
        Define Area of Interest
      </h1>

      <p className="text-sm text-gray-700 mb-6" data-testid="description">
        Search for a location or draw your area of interest on the map. You can
        create multiple areas.
      </p>

      <SearchField />

      <div className="flex-1 overflow-y-auto mt-4">
        <AoiList />
      </div>

      <div className="mt-auto pt-4">
        <button
          className="w-full h-11 bg-white border border-secondaryBorder text-gray-700 rounded-lg font-medium disabled:bg-disabled disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!hasAois}
          data-testid="apply-outline-button"
          aria-label="Apply outline as base image"
        >
          Apply outline as base image
        </button>

        <button
          className="w-full h-12 bg-primary text-white rounded-lg font-medium mt-3 disabled:bg-disabled disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={!hasAois}
          data-testid="confirm-button"
          aria-label="Confirm area of interest"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}


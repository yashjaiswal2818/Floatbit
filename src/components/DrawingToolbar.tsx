import { useMapStore } from '../store/useMapStore'
import { Tooltip } from './Tooltip'

const tools = [
  { id: 'edit' as const, label: 'Edit', tooltip: 'Adjust edges' },
  { id: 'polygon' as const, label: 'Polygon', tooltip: 'Create your own vector shape' },
  { id: 'rectangle' as const, label: 'Rectangle', tooltip: 'Draw rectangle' },
  { id: 'curve' as const, label: 'Curve', tooltip: 'Draw freeform curve' },
  { id: 'erase' as const, label: 'Erase', tooltip: 'Delete area' },
  { id: 'list' as const, label: 'List', tooltip: 'View areas list' },
]

export function DrawingToolbar() {
  const { drawMode, setDrawMode } = useMapStore()

  const handleToolClick = (toolId: typeof tools[number]['id']) => {
    if (toolId === 'list') {
      // Toggle sidebar or show list - for now just toggle
      return
    }
    if (drawMode === toolId) {
      setDrawMode('none')
    } else {
      setDrawMode(toolId)
    }
  }

  return (
    <div
      className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-[1000]"
      data-testid="drawing-toolbar"
    >
      {tools.map((tool) => {
        const isActive = drawMode === tool.id
        return (
          <Tooltip key={tool.id} text={tool.tooltip}>
            <button
              onClick={() => handleToolClick(tool.id)}
              className={`w-11 h-11 rounded-lg shadow-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white text-toolbarIcon hover:bg-gray-50'
              }`}
              aria-label={tool.label}
              data-testid={`tool-${tool.id}`}
            >
              {tool.id === 'edit' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              )}
              {tool.id === 'polygon' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              )}
              {tool.id === 'rectangle' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
              )}
              {tool.id === 'curve' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              )}
              {tool.id === 'erase' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              )}
              {tool.id === 'list' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              )}
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}


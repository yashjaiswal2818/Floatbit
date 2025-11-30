import { useEffect } from 'react'
import { MapComponent } from './map/MapComponent'
import { Sidebar } from './components/Sidebar'
import { DrawingToolbar } from './components/DrawingToolbar'
import { ViewModeSwitcher } from './components/ViewModeSwitcher'
import { ZoomControls } from './components/ZoomControls'
import { useMapStore } from './store/useMapStore'

function App() {
  const loadFromStorage = useMapStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <div className="flex h-screen w-screen overflow-hidden" data-testid="app">
      <Sidebar />
      <div className="flex-1 relative">
        <MapComponent />
        <DrawingToolbar />
        <ViewModeSwitcher />
        <ZoomControls />
      </div>
    </div>
  )
}

export default App


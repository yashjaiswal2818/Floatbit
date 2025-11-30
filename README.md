# AOI Map App

A production-ready single-page application for defining and managing Areas of Interest (AOI) on an interactive map. Built with React, TypeScript, Leaflet, and Tailwind CSS.

## 🎥 Demo Video

[![Demo Video](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

*Replace `VIDEO_ID` with your YouTube video ID, or use one of the options below:*

**Option 1: YouTube Embed**
```markdown
[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

**Option 2: Direct Video Link**
```markdown
[Watch Demo Video](./demo-video.mp4)
```

**Option 3: GitHub Releases**
Upload your video to GitHub Releases and link it:
```markdown
[Download Demo Video](https://github.com/yourusername/aoi-map-app/releases/download/v1.0.0/demo-video.mp4)
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Features

- **Interactive Map**: Leaflet-based map with WMS layer integration
- **Drawing Tools**: Create polygons, rectangles, and freeform shapes
- **Search Integration**: Search locations using Nominatim and auto-outline regions
- **AOI Management**: Create, edit, delete, reorder, and toggle visibility of multiple areas
- **Persistence**: Auto-save AOIs to localStorage with debouncing
- **View Modes**: Toggle between base image (WMS) and vector map view
- **Accessibility**: Full keyboard navigation and ARIA labels

## 🏗️ Architecture

### Map Library Choice: Leaflet

**Why Leaflet?**

1. **WMS Support**: Excellent native support for WMS layers with `L.tileLayer.wms()`
2. **Simplicity**: Clean, well-documented API that's easy to understand and maintain
3. **Mature Ecosystem**: Large community, extensive plugins, and battle-tested codebase
4. **Drawing Tools**: `leaflet-draw` provides robust drawing capabilities with excellent documentation
5. **Performance**: Efficient rendering for typical web mapping use cases
6. **Compatibility**: Works seamlessly with React via `react-leaflet`

### State Management

The application uses **Zustand** for state management:

- **Map Instance**: Reference to the Leaflet map instance
- **Draw Mode**: Current drawing tool (`none`, `edit`, `polygon`, `rectangle`, `curve`, `erase`)
- **AOI Features**: GeoJSON FeatureCollection of all areas
- **View State**: WMS visibility, map view mode, selected AOI

### Component Structure

```
src/
├── components/          # UI components
│   ├── Sidebar.tsx      # Left sidebar with search and AOI list
│   ├── SearchField.tsx  # Location search with dropdown
│   ├── AoiList.tsx      # List of AOIs with controls
│   ├── DrawingToolbar.tsx  # Right-side drawing tools
│   ├── ViewModeSwitcher.tsx # Base image / Map view toggle
│   ├── ZoomControls.tsx # Zoom in/out buttons
│   └── Tooltip.tsx      # Tooltip component
├── map/
│   └── MapComponent.tsx # Main map component with Leaflet integration
├── store/
│   └── useMapStore.ts   # Zustand store
└── utils/
    ├── debounce.ts      # Debounce utility
    ├── storage.ts       # localStorage persistence
    ├── geometry.ts      # Geometry calculations
    └── nominatim.ts     # Nominatim API integration
```

## 🎨 Design System

### Colors

- **Primary**: `#C57A50` - Buttons, active states, headers
- **Sidebar Background**: `#F5EEDC` - Left sidebar
- **AOI Outline**: `#E8D6A1` - Area boundaries
- **Toolbar Icons**: `#A08F7B` - Inactive tool icons
- **Disabled**: `#D8D8D8` - Disabled buttons

### Typography

- **Font Family**: Inter, Manrope, SF Pro (system fallback)
- **Title**: 18-20px, Semi-bold
- **Body**: 14px
- **Button**: 14-15px

### Layout

- **Total Width**: 1440px
- **Sidebar**: 320px fixed width
- **Map Canvas**: Fills remaining space

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm test
```

Tests cover:
- Geometry utilities (polygon area calculation)
- Storage utilities (serialize/deserialize)

### End-to-End Tests (Playwright)

```bash
npm run test:e2e
```

Test suites:
1. **map_loads.spec.ts**: Verifies map initialization and WMS tile loading
2. **draw_and_persist.spec.ts**: Tests drawing polygons and localStorage persistence
3. **search_and_focus.spec.ts**: Tests search functionality and map focus

## ⚡ Performance Strategy

### Debouncing

- **Map Events**: Debounced to prevent excessive re-renders during drawing
- **Storage Saves**: 500ms debounce to avoid localStorage thrashing
- **Search Queries**: 300ms debounce for Nominatim API calls

### React Optimization

- **Memoization**: Components use React hooks efficiently
- **Event Cleanup**: Proper cleanup of map event listeners
- **Conditional Rendering**: Only render visible AOIs on map

### Polygon Simplification

The architecture supports polygon simplification using Turf.js for large datasets. Currently, polygons are stored as-is, but can be simplified before persistence for better performance with 10k+ features.

### Scaling to 10k+ Markers

For large datasets, consider:

1. **Clustering**: Use Leaflet's marker clustering plugins for point features
2. **Simplification**: Simplify polygons using `turf.simplify()` before rendering
3. **Virtualization**: Virtualize AOI list in sidebar
4. **Lazy Loading**: Load AOIs on-demand based on viewport
5. **Web Workers**: Move heavy geometry calculations to Web Workers

## 🌐 CORS Strategy for WMS

The WMS service (`https://www.wms.nrw.de/geobasis/wms_nw_dop`) is accessed directly. If CORS issues occur:

1. **Proxy Solution**: Set up a backend proxy to forward WMS requests
2. **Server Configuration**: Configure server to add CORS headers
3. **Alternative**: Use a CORS proxy service (not recommended for production)

The current implementation assumes the WMS service allows cross-origin requests or is accessed from a same-origin context.

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: All buttons have descriptive `aria-label` attributes
- **Focus Management**: Visible focus rings on all interactive elements
- **Search Dropdown**: Arrow key navigation (up/down) and Enter to select
- **Screen Reader Support**: Semantic HTML and proper ARIA roles

## 🔧 Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Build

```bash
npm run build
```

## 📦 Dependencies

### Core

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Zustand**: State management

### Map

- **leaflet**: Map rendering
- **react-leaflet**: React bindings for Leaflet
- **leaflet-draw**: Drawing tools
- **@turf/turf**: Geometry operations

### Testing

- **Vitest**: Unit testing
- **Playwright**: E2E testing

## 🚢 CI/CD Notes

### Recommended CI Pipeline

1. **Install**: `npm ci`
2. **Lint**: `npm run lint`
3. **Type Check**: `tsc --noEmit`
4. **Unit Tests**: `npm test`
5. **E2E Tests**: `npm run test:e2e`
6. **Build**: `npm run build`

### Environment Variables

No environment variables required for basic functionality. For production:

- Consider adding API keys for rate-limited services
- Configure CORS proxy URL if needed
- Set up analytics tracking IDs

## ⏱️ Time Spent

- **Project Setup**: 30 minutes
- **Core Components**: 2 hours
- **Map Integration**: 1.5 hours
- **State Management**: 1 hour
- **Search Integration**: 1 hour
- **Drawing Tools**: 1.5 hours
- **Testing**: 1.5 hours
- **Styling & Polish**: 1 hour
- **Documentation**: 30 minutes

**Total**: ~10.5 hours

## 🔮 Future Improvements

1. **Advanced Drawing**: 
   - Curve/freeform tool implementation
   - Multi-select for batch operations
   - Undo/redo functionality

2. **Performance**:
   - Implement polygon simplification
   - Add clustering for large datasets
   - Optimize re-renders with React.memo

3. **Features**:
   - Export AOIs as GeoJSON/KML
   - Import AOIs from files
   - Area measurement display
   - Coordinate display on hover

4. **UX**:
   - Loading states for async operations
   - Error boundaries and error handling
   - Toast notifications for user actions
   - Keyboard shortcuts

5. **Backend Integration**:
   - Save AOIs to server
   - User authentication
   - Collaborative editing
   - Version history

## 📄 License

MIT


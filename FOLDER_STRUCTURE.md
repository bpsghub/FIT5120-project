# Improved Folder Structure Documentation

## Overview

The application has been completely restructured to follow modern Vue.js best practices with a scalable, maintainable folder structure.

## Folder Structure

### `/src/assets/`

**Purpose**: Static assets and styling files

- `main.css` - Main application styles with CSS variables and utility classes
- `base.css` - CSS reset and foundational styles

#### Features:

- **CSS Variables**: Consistent theming throughout the app
- **Utility Classes**: Bootstrap-inspired utility classes for rapid development
- **Responsive Grid**: Mobile-first responsive grid system
- **Modern CSS Reset**: Comprehensive reset with accessibility considerations

### `/src/components/`

**Purpose**: Reusable UI components organized by category

#### `/src/components/cards/`

**Purpose**: Card-style components for displaying data

- `EventCard.vue` - Event information display card
- `FacilityCard.vue` - Facility information display card
- `index.js` - Export file for easy importing

#### `/src/components/common/`

**Purpose**: General-purpose UI components

- `Button.vue` - Enhanced responsive button with multiple variants
- `ContentGrid.vue` - Grid/list view container
- `ErrorMessage.vue` - Error state display
- `LoadingSpinner.vue` - Loading indicator
- `NoResults.vue` - Empty state component
- `ResultsHeader.vue` - Results header with view controls
- `index.js` - Export file for easy importing

#### `/src/components/forms/`

**Purpose**: Form-related components

- `FilterSection.vue` - Comprehensive filtering interface
- `SearchBar.vue` - Search input component
- `index.js` - Export file for easy importing

#### `/src/components/map/`

**Purpose**: Map functionality components

- `LocationPermissionDialog.vue` - Geolocation permission modal
- `MapContainer.vue` - Map display container
- `MapHeader.vue` - Map section header
- `MapItemsList.vue` - Sidebar items list for map view
- `MapSection.vue` - Complete map section orchestrator
- `index.js` - Export file for easy importing

#### `/src/components/navigation/`

**Purpose**: Navigation-related components

- `TabNavigation.vue` - Tab switching interface
- `index.js` - Export file for easy importing

#### `/src/components/index.js`

**Purpose**: Main component library index for easy importing across the application

### `/src/composables/`

**Purpose**: Business logic and reusable functionality using Vue 3 Composition API

- `useFacilities.js` - Facilities data management and operations
- `useEvents.js` - Events data management and operations
- `useMap.js` - Map functionality, geolocation, and routing
- `index.js` - Export file for easy importing

#### Features:

- **Reactive State Management**: Using Vue 3 refs and computed properties
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Proper loading indicators for async operations
- **Separation of Concerns**: Business logic separated from UI components

### `/src/services/`

**Purpose**: API communication layer organized by environment

#### `/src/services/api/`

**Purpose**: Production API service implementations

- `facilityService.js` - Real API endpoints for facilities and events

#### `/src/services/mock/`

**Purpose**: Development mock data services

- `facilityService.js` - Mock data for development and testing

#### `/src/services/index.js`

**Purpose**: Service configuration and environment-based switching

### `/src/utils/`

**Purpose**: Utility functions and application constants

- `constants.js` - Application-wide constants and configuration
- `helpers.js` - Utility functions and common operations
- `index.js` - Export file for easy importing

### `/src/views/`

**Purpose**: Page-level components organized by feature

#### `/src/views/FacilityEvent/`

**Purpose**: Facility/Event page components

- `FacilityEventPage.vue` - Main page component (replaces the 2139-line monolith)
- `components/` - Page-specific components (can be added as needed)

#### `/src/views/Home/`

**Purpose**: Home page components

- `components/` - Home page-specific components

#### `/src/views/LearnEnglish/`

**Purpose**: Learn English page components

- Components for the language learning section

### `/src/config/`

**Purpose**: Application configuration files

- `api.js` - API configuration and endpoints

### `/src/stores/`

**Purpose**: Global state management (Pinia stores)

- `counter.js` - Example counter store

### `/src/router/`

**Purpose**: Vue Router configuration

- `index.js` - Route definitions and navigation setup

## Import Patterns

### Component Imports

```javascript
// Individual component import
import { Button } from '@/components/common'

// Multiple components from same category
import { SearchBar, FilterSection } from '@/components/forms'

// Direct import
import FacilityCard from '@/components/cards/FacilityCard.vue'
```

### Composable Imports

```javascript
// Individual composable
import { useFacilities } from '@/composables'

// Multiple composables
import { useFacilities, useEvents, useMap } from '@/composables'
```

### Service Imports

```javascript
// Environment-aware service
import { facilityService } from '@/services'

// Specific service
import { mockFacilityService } from '@/services'
```

### Utils Imports

```javascript
// Constants
import { COUNTRIES, FACILITY_CATEGORIES } from '@/utils'

// Helper functions
import { formatDate, calculateDistance } from '@/utils'
```

## Benefits of This Structure

### 1. **Scalability**

- Easy to add new components in appropriate categories
- Clear patterns for expanding functionality
- Modular architecture supports team development

### 2. **Maintainability**

- Small, focused components (30-200 lines each)
- Clear separation of concerns
- Easy to locate and modify specific functionality

### 3. **Reusability**

- Components designed for reuse across the application
- Consistent APIs and prop interfaces
- Shared utilities and constants

### 4. **Performance**

- Tree-shaking friendly exports
- Lazy loading potential for large components
- Efficient hot module replacement during development

### 5. **Testing**

- Individual components can be unit tested
- Business logic separated for easier testing
- Mock services for consistent test data

### 6. **Developer Experience**

- Clear file organization and naming conventions
- Easy imports with index files
- Consistent patterns throughout the codebase

## Migration Summary

### Before (Monolithic)

- `Facility_Event.vue` - 2139 lines of mixed concerns
- All functionality in one massive file
- Difficult to maintain and test
- Poor reusability

### After (Modular)

- 20+ focused components averaging 50-150 lines each
- Clear separation of UI, business logic, and data
- Easy to maintain, test, and extend
- Highly reusable components

## Development Workflow

### Adding New Components

1. Choose appropriate category folder
2. Create component following naming conventions
3. Add to category's `index.js` export file
4. Update main `components/index.js` if needed

### Adding New Features

1. Create composable for business logic
2. Create UI components as needed
3. Add any new constants to `utils/constants.js`
4. Create page-specific components in `views/` if needed

### Adding New API Endpoints

1. Add to appropriate service file
2. Update composables to use new endpoints
3. Add any new constants or types

This structure provides a solid foundation for continued development and maintenance of the Ankang Life application.

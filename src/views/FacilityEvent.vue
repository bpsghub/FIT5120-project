<template>
  <div class="facility-event-page">
    <!-- Header Section -->
    <div class="header-section d-flex">
      <Button class="button" :hover="true" bg-color="white" :href="'/'">Back</Button>
      <div class="facility_header">
        <h1>Find Facility / Event</h1>
        <p class="subtitle">
          Discover local facilities and community events that serve your cultural needs
        </p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <TabNavigation :tabs="tabs" :activeTab="activeTab" @tab-change="handleTabChange" />

    <!-- Search Section -->
    <SearchBar
      v-model="searchKeyword"
      @search="handleSearch"
      placeholder="Search by name, suburb, postcode..."
    />

    <!-- Filter Section -->
    <FilterSection
      :activeTab="activeTab"
      :initialFilters="filters"
      @filter-change="handleFilterChange"
      @clear-filters="handleClearFilters"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" :type="activeTab" />

    <!-- Error State -->
    <ErrorMessage v-if="error && !loading" :message="error" @retry="loadData" />

    <!-- Results Section -->
    <div v-if="!loading && !error" class="results-section">
      <ResultsHeader
        :itemCount="currentItems.length"
        :activeTab="activeTab"
        :viewMode="viewMode"
        @view-change="handleViewChange"
      />

      <!-- Content Container -->
      <ContentGrid
        v-if="currentItems.length > 0"
        :activeTab="activeTab"
        :facilities="facilities"
        :events="events"
        :viewMode="viewMode"
        @item-select="selectItem"
      />

      <!-- No Results -->
      <NoResults
        v-if="currentItems.length === 0"
        :type="activeTab"
        @clear-filters="handleClearFilters"
      />
    </div>

    <!-- Map Section -->
    <MapSection
      :loading="loading"
      :error="error"
      :currentItems="currentItems"
      :activeTab="activeTab"
      :selectedItem="selectedItem"
      :userLocation="userLocation"
      :userLocationFound="userLocationFound"
      :mapLoading="mapLoading"
      :showLocationPermission="showLocationPermission"
      :locationError="locationError"
      @clear-directions="clearDirections"
      @item-select="selectItemFromMap"
      @request-directions="requestUserLocationForDirections"
      @close-location-dialog="closeLocationDialog"
      @get-user-location="getUserLocation"
      ref="mapSectionRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useFacilities } from '@/composables/useFacilities'
import { useEvents } from '@/composables/useEvents'
import { useMap } from '@/composables/useMap'

// Component imports
import Button from '@/components/common/Button.vue'
import TabNavigation from '@/components/navigation/TabNavigation.vue'
import SearchBar from '@/components/forms/SearchBar.vue'
import FilterSection from '@/components/forms/FilterSection.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ResultsHeader from '@/components/common/ResultsHeader.vue'
import ContentGrid from '@/components/common/ContentGrid.vue'
import NoResults from '@/components/common/NoResults.vue'
import MapSection from '@/components/map/MapSection.vue'

// Reactive data
const activeTab = ref('facilities')
const searchKeyword = ref('')
const viewMode = ref('grid')
const selectedItem = ref(null)
const mapSectionRef = ref(null)

// Tab configuration
const tabs = ref([
  { label: 'Facilities', value: 'facilities', icon: '🏢' },
  { label: 'Events', value: 'events', icon: '📅' },
])

// Filter state
const filters = ref({
  selectedCountry: '',
  selectedCategory: '',
  selectedEventType: '',
  selectedEventCategory: '',
  locationInput: '',
  dateFrom: '',
  dateTo: '',
})

// Use composables
const {
  facilities,
  loading: facilitiesLoading,
  error: facilitiesError,
  loadFacilities,
  searchFacilities,
  filterFacilities,
} = useFacilities()

const {
  events,
  loading: eventsLoading,
  error: eventsError,
  loadEvents,
  searchEvents,
  filterEvents,
} = useEvents()

const {
  userLocation,
  userLocationFound,
  mapLoading,
  showLocationPermission,
  locationError,
  getUserLocation,
  closeLocationDialog,
  clearDirections,
  requestUserLocationForDirections,
  initializeMap,
  updateMapMarkers,
} = useMap()

// Computed properties
const loading = computed(() => {
  return activeTab.value === 'facilities' ? facilitiesLoading.value : eventsLoading.value
})

const error = computed(() => {
  return activeTab.value === 'facilities' ? facilitiesError.value : eventsError.value
})

const currentItems = computed(() => {
  return activeTab.value === 'facilities' ? facilities.value : events.value
})

// Methods
const loadData = async () => {
  if (activeTab.value === 'facilities') {
    await loadFacilities()
  } else {
    await loadEvents()
  }
}

const handleTabChange = async (tab) => {
  activeTab.value = tab
  selectedItem.value = null
  await loadData()

  // Reinitialize map after tab change
  await nextTick()
  setTimeout(() => {
    if (currentItems.value.length > 0) {
      initializeMapIfContainer()
    }
  }, 300)
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    await loadData()
    return
  }

  try {
    if (activeTab.value === 'facilities') {
      await searchFacilities(searchKeyword.value)
    } else {
      await searchEvents(searchKeyword.value)
    }
  } catch (err) {
    console.error('Search failed:', err)
  }
}

const handleFilterChange = async (newFilters) => {
  filters.value = { ...newFilters }

  // Create filter object for API
  const apiFilters = {}
  if (newFilters.selectedCountry) apiFilters.country = newFilters.selectedCountry
  if (newFilters.locationInput?.trim()) apiFilters.location = newFilters.locationInput

  if (activeTab.value === 'facilities') {
    if (newFilters.selectedCategory) apiFilters.category = newFilters.selectedCategory
  } else {
    if (newFilters.selectedEventType) apiFilters.eventType = newFilters.selectedEventType
    if (newFilters.selectedEventCategory) apiFilters.category = newFilters.selectedEventCategory
    if (newFilters.dateFrom) apiFilters.dateFrom = newFilters.dateFrom
    if (newFilters.dateTo) apiFilters.dateTo = newFilters.dateTo
  }

  // If no filters, load all data
  if (Object.keys(apiFilters).length === 0) {
    await loadData()
    return
  }

  try {
    if (activeTab.value === 'facilities') {
      await filterFacilities(apiFilters)
    } else {
      await filterEvents(apiFilters)
    }
  } catch (err) {
    console.error('Filter failed:', err)
  }
}

const handleClearFilters = async () => {
  searchKeyword.value = ''
  filters.value = {
    selectedCountry: '',
    selectedCategory: '',
    selectedEventType: '',
    selectedEventCategory: '',
    locationInput: '',
    dateFrom: '',
    dateTo: '',
  }

  await loadData()

  // Ensure map is reinitialized after clearing filters
  await nextTick()
  setTimeout(() => {
    if (currentItems.value.length > 0) {
      initializeMapIfContainer()
    }
  }, 200)
}

const handleViewChange = (mode) => {
  viewMode.value = mode
}

const selectItem = (item) => {
  selectedItem.value = item
  // Additional map centering logic would be handled by the map composable
}

const selectItemFromMap = (item) => {
  selectedItem.value = item
}

const initializeMapIfContainer = () => {
  const mapElement = document.getElementById('facilityMap')
  if (mapElement && currentItems.value.length > 0) {
    initializeMap(currentItems.value, activeTab.value)
  }
}

// Watch for changes in items to update map
watch(
  currentItems,
  async (newItems) => {
    if (newItems?.length > 0) {
      await nextTick()
      setTimeout(() => {
        initializeMapIfContainer()
      }, 100)
    }
  },
  { immediate: false },
)

// Load data on component mount
onMounted(async () => {
  await loadData()

  // Initialize map after initial data load
  await nextTick()
  setTimeout(() => {
    initializeMapIfContainer()
  }, 500)
})
</script>

<style scoped>
.facility-event-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

.results-section {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }
}
</style>

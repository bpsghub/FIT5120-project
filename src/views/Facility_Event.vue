<template>
  <div class="facility_event-w">
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
    <div class="tab-navigation">
      <button
        @click="activeTab = 'facilities'"
        :class="['tab-btn', { active: activeTab === 'facilities' }]"
      >
        🏢 Facilities
      </button>
      <button
        @click="activeTab = 'events'"
        :class="['tab-btn', { active: activeTab === 'events' }]"
      >
        🎉 Events
      </button>
    </div>
    <!-- Search Section -->
    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          @input="handleSearch"
          @keyup.enter="handleSearch"
          placeholder="Search by name, suburb, postcode..."
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">🔍</button>
      </div>
    </div>
    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>Country/Ethnicity:</label>
          <select v-model="selectedCountry" @change="applyFilters">
            <option value="">All Countries</option>
            <option value="Chinese">Chinese</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Korean">Korean</option>
            <option value="Japanese">Japanese</option>
            <option value="Thai">Thai</option>
          </select>
        </div>

        <!-- Facility-specific filters -->
        <div v-if="activeTab === 'facilities'" class="filter-group">
          <label>Category:</label>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option value="restaurant">Restaurant</option>
            <option value="supermarket">Supermarket</option>
            <option value="community center">Community Center</option>
          </select>
        </div>

        <!-- Event-specific filters -->
        <div v-if="activeTab === 'events'" class="filter-group">
          <label>Event Type:</label>
          <select v-model="selectedEventType" @change="applyFilters">
            <option value="">All Types</option>
            <option value="cultural event">Cultural Event</option>
            <option value="food event">Food Event</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>

        <div v-if="activeTab === 'events'" class="filter-group">
          <label>Category:</label>
          <select v-model="selectedEventCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option value="festival">Festival</option>
            <option value="educational">Educational</option>
            <option value="entertainment">Entertainment</option>
            <option value="market">Market</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Location:</label>
          <input
            v-model="locationInput"
            @input="applyFilters"
            placeholder="Postcode or suburb"
            class="location-input"
          />
        </div>

        <!-- Date filters for events -->
        <div v-if="activeTab === 'events'" class="filter-group">
          <label>Date From:</label>
          <input v-model="dateFrom" @change="applyFilters" type="date" class="date-input" />
        </div>

        <div v-if="activeTab === 'events'" class="filter-group">
          <label>Date To:</label>
          <input v-model="dateTo" @change="applyFilters" type="date" class="date-input" />
        </div>

        <button @click="clearFilters" class="clear-btn">Clear All</button>
      </div>
    </div>
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading {{ activeTab }}...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="loadData" class="retry-btn">Try Again</button>
    </div>

    <!-- Results Section -->
    <div v-if="!loading && !error" class="results-section">
      <div class="results-header">
        <h3>Found {{ currentItems.length }} {{ activeTab }}</h3>
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            Grid
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            List
          </button>
        </div>
      </div>

      <!-- Content Container -->
      <div :class="['content-container', viewMode]">
        <!-- Facilities -->
        <div
          v-if="activeTab === 'facilities'"
          v-for="facility in facilities"
          :key="facility.id"
          class="facility-card"
          @click="selectItem(facility)"
        >
          <div class="facility-image">
            <img :src="facility.image" :alt="facility.name" />
            <div class="facility-type">{{ facility.type }}</div>
          </div>

          <div class="facility-content">
            <h3 class="facility-name">{{ facility.name }}</h3>
            <p class="facility-address">📍 {{ facility.address }}</p>
            <p class="facility-phone">📞 {{ facility.phone }}</p>

            <div class="facility-tags">
              <span v-for="tag in facility.ethnicTags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <div class="facility-rating">
              <span class="stars">⭐</span>
              <span>{{ facility.rating }}/5</span>
            </div>
          </div>
        </div>

        <!-- Events -->
        <div
          v-if="activeTab === 'events'"
          v-for="event in events"
          :key="event.id"
          class="event-card"
          @click="selectItem(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.name" />
            <div class="event-type">{{ event.type }}</div>
            <div class="event-date">{{ formatDate(event.date) }}</div>
          </div>

          <div class="event-content">
            <h3 class="event-name">{{ event.name }}</h3>
            <p class="event-address">📍 {{ event.address }}</p>
            <p class="event-time">🕒 {{ event.time }}</p>
            <p class="event-price">💰 {{ event.price }}</p>

            <div class="event-tags">
              <span v-for="tag in event.ethnicTags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <div class="event-description">
              {{ event.description.substring(0, 100)
              }}{{ event.description.length > 100 ? '...' : '' }}
            </div>

            <div class="event-rating">
              <span class="stars">⭐</span>
              <span>{{ event.rating }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="currentItems.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No {{ activeTab }} found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <button @click="clearFilters" class="clear-btn">Clear Filters</button>
      </div>
    </div>
    <!-- Map Section with Side-by-Side Layout -->
    <div v-if="!loading && !error && currentItems.length > 0" class="map-section">
      <div class="map-header">
        <h3>Map View - {{ activeTab === 'facilities' ? 'Facilities' : 'Events' }}</h3>
        <div class="map-controls">
          <div class="direction-controls" v-if="userLocationFound">
            <button @click="clearDirections" class="clear-directions-btn">Clear Directions</button>
            <span class="location-status">📍 Location enabled</span>
          </div>
        </div>
      </div>

      <div class="map-content">
        <!-- Left Side - Items List -->
        <div class="map-items-list">
          <div class="items-list-header">
            <h4>We found {{ currentItems.length }} {{ activeTab }} near you!</h4>
          </div>

          <div class="items-scroll-container">
            <div
              v-for="item in currentItems"
              :key="item.id"
              @click="selectItemFromMap(item)"
              :class="['map-item', { selected: selectedItem?.id === item.id }]"
            >
              <div class="item-info">
                <h5 class="item-name">{{ item.name }}</h5>
                <p class="item-type">{{ item.type }}</p>
                <p v-if="activeTab === 'events'" class="item-date">{{ formatDate(item.date) }}</p>
                <p class="item-distance">{{ calculateDistance(item.coordinates) }} km</p>
              </div>
              <button
                @click.stop="requestUserLocationForDirections(item)"
                class="get-directions-btn"
                :title="`Get directions to this ${activeTab.slice(0, -1)}`"
              >
                🧭
              </button>
            </div>
          </div>

          <!-- Pagination for map items list -->
          <div class="map-pagination" v-if="currentItems.length > 10">
            <button class="page-btn">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span class="pagination-more">>></span>
          </div>
        </div>

        <!-- Right Side - Map -->
        <div class="map-container">
          <div id="facilityMap" class="map" ref="mapContainer"></div>

          <!-- Map Loading State -->
          <div v-if="mapLoading" class="map-loading">
            <div class="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Location Permission Dialog -->
    <div v-if="showLocationPermission" class="location-overlay">
      <div class="location-dialog">
        <div class="dialog-header">
          <h3>Get Directions</h3>
          <button @click="closeLocationDialog" class="close-btn">&times;</button>
        </div>
        <div class="dialog-content">
          <div class="location-icon">🧭</div>
          <p>
            To show turn-by-turn directions to <strong>{{ selectedItem?.name }}</strong
            >, we need to know your current location.
          </p>

          <div v-if="locationError" class="error-message">
            <p>{{ locationError }}</p>
          </div>
          <div class="dialog-actions">
            <button @click="getUserLocation" class="allow-btn">📍 Share My Location</button>
            <button @click="closeLocationDialog" class="deny-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
// import facilityService from '../services/facilityService.js' // Real API
import mockFacilityService from '../services/mockFacilityService.js' // Mock data for now
import Button from '@/components/Button.vue'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Existing reactive data
const facilities = ref([])
const events = ref([])
const activeTab = ref('facilities')
const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')
const selectedCountry = ref('')
const selectedCategory = ref('')
const selectedEventType = ref('')
const selectedEventCategory = ref('')
const locationInput = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const viewMode = ref('grid')

// New reactive data for map functionality
const selectedItem = ref(null)
const userLocation = ref({ lat: -37.8136, lng: 144.9631 }) // Default to Melbourne CBD
const userLocationFound = ref(false)
const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const markersLayer = ref(null)
const routingControl = ref(null)
const userLocationMarker = ref(null)
const showLocationPermission = ref(false)
const locationError = ref('')
const mapLoading = ref(true)
const mapLoaded = ref(false)

// Computed properties
const currentItems = computed(() => {
  const items = activeTab.value === 'facilities' ? facilities.value : events.value
  return items
})

const selectedFacility = computed(() => {
  return activeTab.value === 'facilities' ? selectedItem.value : null
})

// Methods
const loadData = async () => {
  if (activeTab.value === 'facilities') {
    await loadAllFacilities()
  } else {
    await loadAllEvents()
  }
}

const loadAllFacilities = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.getAllFacilities()
    facilities.value = response.data || []

    // Initialize map after facilities are loaded
    if (facilities.value.length > 0 && !mapLoaded.value) {
      setTimeout(() => {
        initializeMap()
      }, 500)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load facilities'
    console.error('❌ Error loading facilities:', err)
  } finally {
    loading.value = false
  }
}

const loadAllEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await mockFacilityService.getAllEvents()
    events.value = response.data || []

    // Initialize map after events are loaded
    if (events.value.length > 0 && !mapLoaded.value) {
      setTimeout(() => {
        initializeMap()
      }, 500)
    } else if (events.value.length > 0 && mapLoaded.value) {
      setTimeout(() => {
        updateMapMarkers()
      }, 100)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadData()
    return
  }

  loading.value = true
  error.value = ''

  try {
    let response
    if (activeTab.value === 'facilities') {
      response = await mockFacilityService.searchFacilities(searchKeyword.value)
      facilities.value = response.data || []
    } else {
      response = await mockFacilityService.searchEvents(searchKeyword.value)
      events.value = response.data || []
    }
  } catch (err) {
    error.value = err.message || 'Search failed'
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  const filters = {}

  if (selectedCountry.value) filters.country = selectedCountry.value
  if (locationInput.value.trim()) filters.location = locationInput.value

  if (activeTab.value === 'facilities') {
    if (selectedCategory.value) filters.category = selectedCategory.value
  } else {
    if (selectedEventType.value) filters.eventType = selectedEventType.value
    if (selectedEventCategory.value) filters.category = selectedEventCategory.value
    if (dateFrom.value) filters.dateFrom = dateFrom.value
    if (dateTo.value) filters.dateTo = dateTo.value
  }

  // If no filters, load all
  if (Object.keys(filters).length === 0) {
    loadData()
    return
  }

  loading.value = true
  error.value = ''

  try {
    let response
    if (activeTab.value === 'facilities') {
      response = await mockFacilityService.filterFacilities(filters)
      facilities.value = response.data || []
    } else {
      response = await mockFacilityService.filterEvents(filters)
      events.value = response.data || []
    }
  } catch (err) {
    error.value = err.message || 'Filter failed'
    console.error('❌ Filter error:', err)
  } finally {
    loading.value = false
  }
}

const clearFilters = async () => {
  searchKeyword.value = ''
  selectedCountry.value = ''
  selectedCategory.value = ''
  selectedEventType.value = ''
  selectedEventCategory.value = ''
  locationInput.value = ''
  dateFrom.value = ''
  dateTo.value = ''

  await loadData()

  // Ensure map is reinitialized after clearing filters
  await nextTick()
  setTimeout(() => {
    const mapElement = document.getElementById('facilityMap')
    if (mapElement && currentItems.value.length > 0) {
      initializeMap()
    }
  }, 200)
}

const selectItem = (item) => {
  selectedItem.value = item

  // Center map on selected item if map is loaded
  if (mapLoaded.value && map.value) {
    map.value.setView([item.coordinates.lat, item.coordinates.lng], 16)

    // Find and open the popup for this item
    const marker = markers.value.find((m) => m.itemId === item.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

const selectItemFromMap = (item) => {
  selectItem(item)

  // Center map on selected item
  if (mapLoaded.value && map.value) {
    map.value.setView([item.coordinates.lat, item.coordinates.lng], 16)

    // Find and open the popup for this item
    const marker = markers.value.find((m) => m.itemId === item.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const calculateDistance = (coordinates) => {
  // Simple distance calculation using Haversine formula (more accurate)
  const lat1 = userLocation.value.lat
  const lng1 = userLocation.value.lng
  const lat2 = coordinates.lat
  const lng2 = coordinates.lng

  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

// Map-related methods
const initializeMap = async () => {
  await nextTick()

  // Try to get map container with fallback
  const container = mapContainer.value || document.getElementById('facilityMap')
  if (!container) {
    return
  }

  // Always clean up existing map to ensure fresh initialization
  if (map.value) {
    try {
      map.value.remove()
    } catch (error) {
      // Silently handle cleanup errors
    }
    map.value = null
    markersLayer.value = null
    markers.value = []
    mapLoaded.value = false
  }

  try {
    // Clear the container to ensure it's empty
    container.innerHTML = ''

    // Initialize the map
    map.value = L.map(container).setView([userLocation.value.lat, userLocation.value.lng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)

    // Create markers layer group
    markersLayer.value = L.layerGroup().addTo(map.value)

    mapLoading.value = false
    mapLoaded.value = true

    // Force the map to resize properly
    setTimeout(() => {
      if (map.value) {
        map.value.invalidateSize()
      }
    }, 100)

    // Add markers for current items
    updateMapMarkers()
  } catch (error) {
    mapLoading.value = false
  }
}

const updateMapMarkers = () => {
  if (!map.value || !markersLayer.value) {
    return
  }

  // Clear existing markers
  markersLayer.value.clearLayers()
  markers.value = []

  // Add markers for current items
  currentItems.value.forEach((item, index) => {
    try {
      const marker = createMarker(item)
      markersLayer.value.addLayer(marker)
      markers.value.push(marker)
    } catch (error) {
      console.error(`❌ Error creating marker for ${item.name}:`, error)
    }
  })

  // Fit map to show all markers if there are any
  if (markers.value.length > 0) {
    try {
      const group = new L.featureGroup(markers.value)
      map.value.fitBounds(group.getBounds().pad(0.1))
    } catch (error) {
      console.error('❌ Error fitting map bounds:', error)
    }
  } else {
    // If no markers, center on default location
    map.value.setView([userLocation.value.lat, userLocation.value.lng], 13)
  }

  // Force map to refresh its display
  setTimeout(() => {
    if (map.value) {
      map.value.invalidateSize()
    }
  }, 100)
}

const createMarker = (item) => {
  // Create custom icon based on item type
  const iconColor = getMarkerColor(item.type)
  const iconSymbol = getMarkerSymbol(item.type)

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${iconColor};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">
        ${iconSymbol}
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  })

  const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon })

  // Store item ID for reference
  marker.itemId = item.id

  // Create popup content based on item type
  let popupContent = ''
  if (activeTab.value === 'facilities') {
    popupContent = createFacilityPopup(item)
  } else {
    popupContent = createEventPopup(item)
  }

  marker.bindPopup(popupContent, {
    maxWidth: 300,
    className: 'custom-popup',
  })

  // Handle marker click
  marker.on('click', () => {
    selectItem(item)
  })

  return marker
}

const createFacilityPopup = (facility) => {
  return `
    <div style="min-width: 200px;">
      <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
        ${facility.name}
      </h4>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Type:</strong> ${facility.type}
      </p>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Address:</strong> ${facility.address}
      </p>
      ${
        facility.ethnicTags
          ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Ethnic Tags:</strong> ${facility.ethnicTags.join(', ')}
        </p>
      `
          : ''
      }
      ${
        facility.phone
          ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Phone:</strong> ${facility.phone}
        </p>
      `
          : ''
      }
      <div style="text-align: center; margin-top: 12px;">
        <button
          onclick="window.showDirectionsToItem(${facility.id})"
          style="
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          Get Directions
        </button>
      </div>
    </div>
  `
}

const createEventPopup = (event) => {
  return `
    <div style="min-width: 200px;">
      <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
        ${event.name}
      </h4>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Type:</strong> ${event.type}
      </p>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Date:</strong> ${formatDate(event.date)}
      </p>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Time:</strong> ${event.time}
      </p>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Price:</strong> ${event.price}
      </p>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Address:</strong> ${event.address}
      </p>
      ${
        event.ethnicTags
          ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Cultural Focus:</strong> ${event.ethnicTags.join(', ')}
        </p>
      `
          : ''
      }
      <div style="text-align: center; margin-top: 12px;">
        <button
          onclick="window.showDirectionsToItem(${event.id})"
          style="
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          Get Directions
        </button>
      </div>
    </div>
  `
}

const getMarkerColor = (type) => {
  const colors = {
    restaurant: '#e74c3c',
    supermarket: '#27ae60',
    'community center': '#3498db',
    'cultural event': '#9b59b6',
    'food event': '#f39c12',
    workshop: '#16a085',
  }
  return colors[type] || '#95a5a6'
}

const getMarkerSymbol = (type) => {
  const symbols = {
    restaurant: '🍽️',
    supermarket: '🏪',
    'community center': '🏢',
    'cultural event': '🎭',
    'food event': '🍜',
    workshop: '🎨',
  }
  return symbols[type] || '📍'
}

// Geolocation and routing methods
const requestUserLocationForDirections = (item) => {
  if (!userLocationFound.value) {
    showLocationPermission.value = true
    selectedItem.value = item
  } else {
    showDirections(item)
  }
}

const getUserLocation = () => {
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      userLocationFound.value = true
      showLocationPermission.value = false

      // Add user location marker to map
      addUserLocationMarker()
      // Show directions to selected item
      if (selectedItem.value) {
        showDirections(selectedItem.value)
      }
    },
    (error) => {
      console.error('Error getting location:', error)
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = 'Location access denied by user.'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          locationError.value = 'Location request timed out.'
          break
        default:
          locationError.value = 'An unknown error occurred while getting location.'
          break
      }
      showLocationPermission.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    },
  )
}

const addUserLocationMarker = () => {
  if (!map.value || !userLocationFound.value) return

  // Remove existing user location marker
  if (userLocationMarker.value) {
    map.value.removeLayer(userLocationMarker.value)
  }

  // Create user location icon
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        background-color: #007bff;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  userLocationMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng], {
    icon: userIcon,
  }).addTo(map.value)

  userLocationMarker.value.bindPopup('Your Location', {
    className: 'user-location-popup',
  })
}

const showDirections = (item) => {
  if (!map.value || !userLocationFound.value) return

  // Remove existing routing control
  if (routingControl.value) {
    map.value.removeControl(routingControl.value)
  }

  // Create new routing control
  routingControl.value = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.value.lat, userLocation.value.lng),
      L.latLng(item.coordinates.lat, item.coordinates.lng),
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    createMarker: function () {
      return null
    }, // Don't create default markers
    lineOptions: {
      styles: [{ color: '#007bff', weight: 6, opacity: 0.8 }],
    },
    show: true,
    showAlternatives: false,
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
    }),
  }).addTo(map.value)

  // Handle routing events
  routingControl.value.on('routesfound', function (e) {
    const routes = e.routes
    const summary = routes[0].summary

    showRouteInfo(summary)
  })
}

const showRouteInfo = (summary) => {
  const distance = (summary.totalDistance / 1000).toFixed(1) // Convert to km
  const time = Math.round(summary.totalTime / 60) // Convert to minutes

  // Create a simple notification
  const notification = document.createElement('div')
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
      max-width: 300px;
    ">
      <h4 style="margin: 0 0 10px 0; color: #333;">Route to ${selectedItem.value?.name}</h4>
      <p style="margin: 0 0 5px 0;"><strong>Distance:</strong> ${distance} km</p>
      <p style="margin: 0 0 10px 0;"><strong>Estimated time:</strong> ${time} minutes</p>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #dc3545;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      ">Close</button>
    </div>
  `
  document.body.appendChild(notification)

  // Auto remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 10000)
}

const closeLocationDialog = () => {
  showLocationPermission.value = false
  locationError.value = ''
}

const clearDirections = () => {
  if (routingControl.value && map.value) {
    map.value.removeControl(routingControl.value)
    routingControl.value = null
  }
}

// Watch for changes in items to update map
watch(
  currentItems,
  async (newItems, oldItems) => {
    if (newItems?.length > 0) {
      await nextTick()

      // Check if map container exists in DOM
      const mapElement = document.getElementById('facilityMap')
      if (mapElement) {
        // Always reinitialize map to ensure it works properly
        setTimeout(() => {
          initializeMap()
        }, 100)
      }
    }
  },
  { immediate: false },
)

// Watch for tab changes
watch(activeTab, async (newTab, oldTab) => {
  // Clear current selection when switching tabs
  selectedItem.value = null

  await loadData()

  // Always reinitialize map after tab change
  await nextTick()
  setTimeout(() => {
    const mapElement = document.getElementById('facilityMap')
    if (mapElement && currentItems.value.length > 0) {
      initializeMap()
    }
  }, 300)
})

// Load data on component mount
onMounted(async () => {
  await loadData()

  // Add global function for popup buttons
  window.showDirectionsToItem = (itemId) => {
    const item = currentItems.value.find((i) => i.id === itemId)
    if (item) {
      selectItem(item)
      requestUserLocationForDirections(item)
    }
  }

  // Initialize map after initial data load
  await nextTick()
  setTimeout(() => {
    const mapElement = document.getElementById('facilityMap')
    if (mapElement && currentItems.value.length > 0) {
      initializeMap()
    }
  }, 500)
})

// Cleanup on unmount
onUnmounted(() => {
  if (window.showDirectionsToItem) {
    delete window.showDirectionsToItem
  }
  if (routingControl.value && map.value) {
    map.value.removeControl(routingControl.value)
  }
  if (map.value) {
    try {
      map.value.remove()
    } catch (error) {
      console.error('Error cleaning up map:', error)
    }
    map.value = null
    markersLayer.value = null
    markers.value = []
    mapLoaded.value = false
  }
})
</script>

<style scoped>
.facility_event-w {
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 5px;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn:hover {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* Search Section */
.search-section {
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

/* Filter Section */
.filter-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.filter-group select,
.location-input,
.date-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  height: fit-content;
}

.clear-btn:hover {
  background: #545b62;
}

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  text-align: center;
  padding: 20px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin-bottom: 20px;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* Results Section */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  margin: 0;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.view-btn.active {
  background: #007bff;
  color: white;
}

/* Content Container */
.content-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-container.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Facility Cards */
.facility-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.facility-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.list .facility-card {
  display: flex;
}

/* Event Cards */
.event-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.list .event-card {
  display: flex;
}

.facility-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.list .facility-image {
  width: 200px;
  height: 150px;
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.list .event-image {
  width: 200px;
  height: 150px;
}

.facility-image img,
.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-type,
.event-type {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.event-date {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.facility-content {
  padding: 20px;
}

.list .facility-content {
  flex: 1;
  padding: 15px 20px;
}

.event-content {
  padding: 20px;
}

.list .event-content {
  flex: 1;
  padding: 15px 20px;
}

.facility-name,
.event-name {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.facility-address,
.facility-phone,
.event-address,
.event-time,
.event-price {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.facility-tags {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.event-tags {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.facility-rating,
.event-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-weight: 600;
  color: #f57c00;
}

.event-description {
  margin: 10px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results h3 {
  margin-bottom: 10px;
  color: #333;
}

/* Debug Section */
.debug-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px dashed #ddd;
  text-align: center;
}

.test-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.test-btn:hover {
  background: #1e7e34;
}

/* Debug Status Display */
.debug-status {
  background: #f8f9fa;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  font-family: monospace;
}

.debug-status h4 {
  margin: 0 0 10px 0;
  color: #007bff;
}

.debug-info p {
  margin: 5px 0;
  padding: 3px 0;
  border-bottom: 1px solid #e0e0e0;
}

.debug-info p:last-child {
  border-bottom: none;
}

/* Map Section */
.map-section {
  margin-top: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.map-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.map-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.direction-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.clear-directions-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.clear-directions-btn:hover {
  background: #c82333;
}

.location-status {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
}

.map-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 600px;
}

/* Left Side - Items List for Map */
.map-items-list {
  background: #f8f9fa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.items-list-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.items-list-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.items-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.map-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
}

.map-item:hover {
  background: #f0f8ff;
  border-color: #007bff;
  transform: translateX(2px);
}

.map-item.selected {
  background: #e3f2fd;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.map-item .item-info {
  flex: 1;
}

.map-item .item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.map-item .item-type {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 4px 0;
  text-transform: capitalize;
}

.map-item .item-date {
  font-size: 0.75rem;
  color: #007bff;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.map-item .item-distance {
  font-size: 0.75rem;
  color: #999;
  margin: 0;
}

.get-directions-btn {
  background: #28a745;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.get-directions-btn:hover {
  background: #218838;
  transform: scale(1.1);
}

.map-pagination {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px;
  border-top: 1px solid #ddd;
  background: white;
}

.map-pagination .page-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.map-pagination .page-btn:hover {
  background: #f8f9fa;
}

.map-pagination .page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.map-pagination .pagination-more {
  color: #999;
  font-size: 0.9rem;
  margin-left: 5px;
}

/* Right Side - Map Container */
.map-container {
  position: relative;
  background: #e0e0e0;
}

.map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  color: #666;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Location Permission Dialog */
.location-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.location-dialog {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #666;
}

.dialog-content {
  padding: 20px;
  text-align: center;
}

.location-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.dialog-content p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.error-message {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.error-message p {
  margin: 0;
  color: #856404;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.allow-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.allow-btn:hover {
  background: #218838;
}

.deny-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.deny-btn:hover {
  background: #545b62;
}

/* Custom Leaflet Popup Styles */
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 12px;
  line-height: 1.4;
}

:deep(.custom-popup .leaflet-popup-tip) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom marker hover effects */
:deep(.custom-marker) {
  transition: transform 0.2s ease;
}

:deep(.custom-marker:hover) {
  transform: scale(1.1);
}

/* User Location Marker Styles */
:deep(.user-location-marker) {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Routing Control Customization */
:deep(.leaflet-routing-container) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.leaflet-routing-instructions) {
  max-height: 200px;
  overflow-y: auto;
}

:deep(.leaflet-routing-instruction) {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

:deep(.leaflet-routing-instruction:last-child) {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }

  .filter-row {
    flex-direction: column;
    gap: 15px;
  }

  .filter-group {
    min-width: 100%;
  }

  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  .content-container.grid {
    grid-template-columns: 1fr;
  }

  .list .facility-card,
  .list .event-card {
    flex-direction: column;
  }

  .list .facility-image,
  .list .event-image {
    width: 100%;
    height: 200px;
  }

  .map-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .map-controls {
    justify-content: center;
  }
  .map-content {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 400px;
    height: 700px;
  }

  .map-items-list {
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .items-scroll-container {
    max-height: 250px;
  }

  .direction-controls {
    justify-content: center;
  }
  .map-item {
    padding: 10px;
  }

  .map-item .item-name {
    font-size: 0.9rem;
  }

  .map-item .item-type,
  .map-item .item-date,
  .map-item .item-distance {
    font-size: 0.75rem;
  }
}
</style>
```

<template>
  <div class="facility-event-page">
    <!-- Header Navigation -->
    <header class="page-header">
      <div class="container">
        <h1 class="site-title">Ankang Life</h1>
        <nav class="main-nav">
          <router-link to="/FindFacility_Event" class="nav-link">Find Facility / Event</router-link>
          <router-link to="/learnenglish" class="nav-link">Learn English</router-link>
        </nav>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div class="container">
        <div class="tabs">
          <button
            @click="activeTab = 'facility'"
            :class="['tab-btn', { active: activeTab === 'facility' }]"
          >
            Find Facility
          </button>
          <button
            @click="activeTab = 'event'"
            :class="['tab-btn', { active: activeTab === 'event' }]"
          >
            Find Event
          </button>
        </div>
      </div>
    </div>
    <!-- Search Section -->
    <div class="search-section">
      <div class="container">
        <div class="search-controls">
          <div class="search-bar">
            <input
              v-model="searchLocation"
              @keyup.enter="handleLocationSearch"
              placeholder="Enter Suburb / Zipcode"
              class="location-input"
            />
            <button @click="handleLocationSearch" class="search-button">Search</button>
          </div>

          <!-- Direction Controls -->
          <div class="direction-controls" v-if="userLocationFound">
            <button @click="clearDirections" class="clear-directions-btn">Clear Directions</button>
            <span class="location-status">📍 Location enabled</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Results Info -->
        <div class="results-info">
          <h3>
            We found {{ filteredFacilities.length }}
            {{ activeTab === 'facility' ? 'facilities' : 'events' }} near you!
          </h3>
        </div>

        <div class="content-grid">
          <!-- Left Side - Facility List -->
          <div class="facilities-list">            <div
              v-for="facility in paginatedFacilities"
              :key="facility.id"
              @click="selectFacility(facility)"
              :class="['facility-item', { selected: selectedFacility?.id === facility.id }]"
            >
              <div class="facility-info">
                <h4 class="facility-name">{{ facility.name }}</h4>
                <p class="facility-type">{{ facility.type }}</p>
                <p class="facility-distance">{{ calculateDistance(facility.coordinates) }} km</p>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="['page-btn', { active: currentPage === page }]"
              >
                {{ page }}
              </button>
              <span class="pagination-more">>></span>
            </div>
          </div>
          <!-- Right Side - Map -->
          <div class="map-container">
            <div id="map" class="map" ref="mapContainer"></div>

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
              To show turn-by-turn directions to <strong>{{ selectedFacility?.name }}</strong
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
import mockFacilityService from '../services/mockFacilityService.js'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Reactive data
const activeTab = ref('facility')
const searchLocation = ref('')
const facilities = ref([])
const events = ref([]) // We'll create mock events
const selectedFacility = ref(null)
const currentPage = ref(1)
const itemsPerPage = 6
const mapLoading = ref(true)
const mapLoaded = ref(false)
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

// Mock events data
const mockEvents = [
  {
    id: 1,
    name: 'Chinese New Year Festival',
    type: 'cultural event',
    address: 'Federation Square, Melbourne VIC 3000',
    coordinates: { lat: -37.8182, lng: 144.9685 },
    ethnicTags: ['Chinese'],
    date: '2024-02-10',
    time: '10:00 AM - 6:00 PM',
  },
  {
    id: 2,
    name: 'Vietnamese Food Festival',
    type: 'food event',
    address: 'Victoria Street, Richmond VIC 3121',
    coordinates: { lat: -37.8226, lng: 144.9958 },
    ethnicTags: ['Vietnamese'],
    date: '2024-03-15',
    time: '12:00 PM - 8:00 PM',
  },
  {
    id: 3,
    name: 'Indonesian Cultural Workshop',
    type: 'workshop',
    address: 'RMIT University, Melbourne VIC 3000',
    coordinates: { lat: -37.8067, lng: 144.9635 },
    ethnicTags: ['Indonesian'],
    date: '2024-04-20',
    time: '2:00 PM - 5:00 PM',
  },
]

// Computed properties
const currentData = computed(() => {
  return activeTab.value === 'facility' ? facilities.value : events.value
})

const filteredFacilities = computed(() => {
  let data = currentData.value

  if (searchLocation.value.trim()) {
    const searchTerm = searchLocation.value.toLowerCase()
    data = data.filter(
      (item) =>
        item.address.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm),
    )
  }

  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredFacilities.value.length / itemsPerPage)
})

const paginatedFacilities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFacilities.value.slice(start, end)
})

// Methods
const loadFacilities = async () => {
  try {
    const response = await mockFacilityService.getAllFacilities()
    facilities.value = response.data || []
  } catch (error) {
    console.error('Error loading facilities:', error)
  }
}

const loadEvents = () => {
  events.value = mockEvents
}

const handleLocationSearch = async () => {
  if (!searchLocation.value.trim()) return

  // Reset pagination when searching
  currentPage.value = 1

  // In a real app, you would geocode the location and update userLocation
  console.log('Searching for:', searchLocation.value)
}

const selectFacility = (facility) => {
  selectedFacility.value = facility
  console.log('Selected:', facility)

  // Center map on selected facility and open popup
  if (mapLoaded.value && map.value) {
    map.value.setView([facility.coordinates.lat, facility.coordinates.lng], 16)

    // Find and open the popup for this facility
    const marker = markers.value.find((m) => m.facilityId === facility.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

const calculateDistance = (coordinates) => {
  // Simple distance calculation (not accurate, just for demo)
  const lat1 = userLocation.value.lat
  const lng1 = userLocation.value.lng
  const lat2 = coordinates.lat
  const lng2 = coordinates.lng

  const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) * 111 // Rough conversion to km

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

const initializeMap = async () => {
  await nextTick()

  if (!mapContainer.value) {
    console.error('Map container not found')
    return
  }

  try {
    // Initialize the map
    map.value = L.map(mapContainer.value).setView(
      [userLocation.value.lat, userLocation.value.lng],
      13,
    )

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)

    // Create markers layer group
    markersLayer.value = L.layerGroup().addTo(map.value)

    mapLoading.value = false
    mapLoaded.value = true

    // Add markers for current data
    updateMapMarkers()
  } catch (error) {
    console.error('Error initializing map:', error)
    mapLoading.value = false
  }
}

const updateMapMarkers = () => {
  if (!map.value || !markersLayer.value) return

  // Clear existing markers
  markersLayer.value.clearLayers()
  markers.value = []

  // Add markers for current filtered data
  filteredFacilities.value.forEach((facility) => {
    const marker = createMarker(facility)
    markersLayer.value.addLayer(marker)
    markers.value.push(marker)
  })

  // Fit map to show all markers if there are any
  if (markers.value.length > 0) {
    const group = new L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.1))
  }
}

const createMarker = (facility) => {
  // Create custom icon based on facility type
  const iconColor = getMarkerColor(facility.type)

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
        ${getMarkerSymbol(facility.type)}
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  })

  const marker = L.marker([facility.coordinates.lat, facility.coordinates.lng], {
    icon: customIcon,
  })

  // Store facility ID for reference
  marker.facilityId = facility.id

  // Create popup content
  const popupContent = `
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
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        <strong>Distance:</strong> ${calculateDistance(facility.coordinates)} km
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
        facility.openingHours
          ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Hours:</strong> ${facility.openingHours}
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
      }      <div style="text-align: center; margin-top: 12px;">
        <button 
          onclick="window.showDirectionsToFacility(${facility.id})"
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

  marker.bindPopup(popupContent, {
    maxWidth: 300,
    className: 'custom-popup',
  }) // Handle marker click
  marker.on('click', () => {
    selectFacility(facility)
    // Just select the facility when clicking marker, don't request location yet
  })

  return marker
}

// New geolocation and routing methods
const requestUserLocationForDirections = (facility) => {
  if (!userLocationFound.value) {
    showLocationPermission.value = true
    selectedFacility.value = facility
  } else {
    showDirections(facility)
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

      // Show directions to selected facility
      if (selectedFacility.value) {
        showDirections(selectedFacility.value)
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

const showDirections = (facility) => {
  if (!map.value || !userLocationFound.value) return

  // Remove existing routing control
  if (routingControl.value) {
    map.value.removeControl(routingControl.value)
  }

  // Create new routing control
  routingControl.value = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.value.lat, userLocation.value.lng),
      L.latLng(facility.coordinates.lat, facility.coordinates.lng),
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
    console.log('Route found:', summary)

    // You can add a notification here showing the route distance and time
    showRouteInfo(summary)
  })
}

const showRouteInfo = (summary) => {
  const distance = (summary.totalDistance / 1000).toFixed(1) // Convert to km
  const time = Math.round(summary.totalTime / 60) // Convert to minutes

  // Create a simple notification (you can enhance this)
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
      <h4 style="margin: 0 0 10px 0; color: #333;">Route to ${selectedFacility.value?.name}</h4>
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

const getMarkerColor = (type) => {
  const colors = {
    restaurant: '#e74c3c',
    supermarket: '#27ae60',
    'community center': '#3498db',
    'cultural event': '#9b59b6',
    'food event': '#f39c12',
    workshop: '#1abc9c',
  }
  return colors[type] || '#34495e'
}

const getMarkerSymbol = (type) => {
  const symbols = {
    restaurant: '🍽️',
    supermarket: '🛒',
    'community center': '🏢',
    'cultural event': '🎭',
    'food event': '🍜',
    workshop: '📚',
  }
  return symbols[type] || '📍'
}

// Global function for popup button clicks
window.selectFacilityFromMap = (facilityId) => {
  const facility = filteredFacilities.value.find((f) => f.id === facilityId)
  if (facility) {
    selectFacility(facility)
  }
}

// Watch for tab changes
watch(activeTab, (newTab) => {
  currentPage.value = 1
  selectedFacility.value = null

  if (newTab === 'event' && events.value.length === 0) {
    loadEvents()
  }

  // Update map markers when tab changes
  if (mapLoaded.value) {
    updateMapMarkers()
  }
})

// Watch for changes in filtered facilities to update map
watch(filteredFacilities, () => {
  if (mapLoaded.value) {
    updateMapMarkers()
  }
})

// Lifecycle
onMounted(() => {
  loadFacilities()
  initializeMap()

  // Add global function for popup buttons
  window.showDirectionsToFacility = (facilityId) => {
    const facility = currentData.value.find((f) => f.id === facilityId)
    if (facility) {
      selectFacility(facility)
      requestUserLocationForDirections(facility)
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (window.showDirectionsToFacility) {
    delete window.showDirectionsToFacility
  }
  if (routingControl.value && map.value) {
    map.value.removeControl(routingControl.value)
  }
})
</script>

<style scoped>
.facility-event-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: 'Inter', sans-serif;
}

/* Header */
.page-header {
  background: white;
  border-bottom: 2px solid #000;
  padding: 15px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-title {
  font-size: 2rem;
  font-weight: 900;
  font-style: italic;
  margin: 0;
  color: #000;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

/* Tab Navigation */
.tab-navigation {
  background: white;
  padding: 0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: #f8f9fa;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  background: white;
  color: #000;
  border-bottom-color: #007bff;
}

.tab-btn:hover {
  background: #e9ecef;
}

/* Search Section */
.search-section {
  background: white;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.search-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.search-bar {
  display: flex;
  max-width: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.location-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.location-input::placeholder {
  color: #999;
}

.search-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #545b62;
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

/* Main Content */
.main-content {
  padding: 20px 0;
}

.results-info {
  margin-bottom: 20px;
}

.results-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: 600px;
}

/* Facilities List */
.facilities-list {
  background: white;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.facility-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 4px;
  margin-bottom: 5px;
}

.facility-item:hover {
  background: #f8f9fa;
}

.facility-item.selected {
  background: #e3f2fd;
  border-left: 4px solid #007bff;
}

.facility-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.facility-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.facility-type {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 5px 0;
  text-transform: capitalize;
}

.facility-distance {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.page-btn {
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

.page-btn:hover {
  background: #f8f9fa;
}

.page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-more {
  color: #999;
  font-size: 0.9rem;
  margin-left: 5px;
}

/* Map Container */
.map-container {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
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

:deep(.leaflet-routing-container-hide) {
  display: none;
}

/* Custom routing instructions styling */
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
  .page-header .container {
    flex-direction: column;
    gap: 15px;
  }

  .site-title {
    font-size: 1.5rem;
  }

  .main-nav {
    gap: 20px;
  }

  .nav-link {
    font-size: 1rem;
  }

  .search-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .search-bar {
    max-width: 100%;
  }

  .direction-controls {
    justify-content: center;
  }

  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 400px;
    height: auto;
  }

  .facilities-list {
    max-height: 300px;
  }

  .location-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .tab-btn {
    padding: 12px 15px;
    font-size: 0.9rem;
  }

  .facility-item {
    padding: 12px;
  }

  .facility-name {
    font-size: 0.9rem;
  }

  .facility-type,
  .facility-distance {
    font-size: 0.8rem;
  }
}
</style>

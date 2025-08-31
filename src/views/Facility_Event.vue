<template>
  <div class="facility_event-w">
    <div class="header-section">
      <h1>Find Facility / Event</h1>
      <p class="subtitle">
        Discover local facilities and community centers that serve your cultural needs
      </p>
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
          </select>
        </div>

        <div class="filter-group">
          <label>Category:</label>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option value="restaurant">Restaurant</option>
            <option value="supermarket">Supermarket</option>
            <option value="community center">Community Center</option>
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

        <button @click="clearFilters" class="clear-btn">Clear All</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading facilities...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="loadAllFacilities" class="retry-btn">Try Again</button>
    </div>

    <!-- Results Section -->
    <div v-if="!loading && !error" class="results-section">
      <div class="results-header">
        <h3>Found {{ facilities.length }} facilities</h3>
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

      <!-- Facilities Grid/List -->
      <div :class="['facilities-container', viewMode]">
        <div
          v-for="facility in facilities"
          :key="facility.id"
          class="facility-card"
          @click="selectFacility(facility)"
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
      </div>

      <!-- No Results -->
      <div v-if="facilities.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No facilities found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <button @click="clearFilters" class="clear-btn">Clear Filters</button>
      </div>
    </div>    <!-- Test Button (temporary for development) -->
    <div class="debug-section" v-if="isDevelopment">
      <button @click="testAPI" class="test-btn">Test API Connection</button>
    </div>

    <!-- Map Section with Side-by-Side Layout -->
    <div v-if="!loading && !error && facilities.length > 0" class="map-section">
      <div class="map-header">
        <h3>Map View</h3>
        <div class="map-controls">
          <div class="direction-controls" v-if="userLocationFound">
            <button @click="clearDirections" class="clear-directions-btn">
              Clear Directions
            </button>
            <span class="location-status">📍 Location enabled</span>
          </div>
        </div>
      </div>
      
      <div class="map-content">
        <!-- Left Side - Facility List -->
        <div class="map-facilities-list">
          <div class="facilities-list-header">
            <h4>We found {{ facilities.length }} facilities near you!</h4>
          </div>
          
          <div class="facilities-scroll-container">
            <div
              v-for="facility in facilities"
              :key="facility.id"
              @click="selectFacilityFromMap(facility)"
              :class="['map-facility-item', { selected: selectedFacility?.id === facility.id }]"
            >
              <div class="facility-info">
                <h5 class="facility-name">{{ facility.name }}</h5>
                <p class="facility-type">{{ facility.type }}</p>
                <p class="facility-distance">{{ calculateDistance(facility.coordinates) }} km</p>
              </div>
              <button 
                @click.stop="requestUserLocationForDirections(facility)"
                class="get-directions-btn"
                title="Get directions to this facility"
              >
                🧭
              </button>
            </div>
          </div>
          
          <!-- Pagination for map facility list -->
          <div class="map-pagination" v-if="facilities.length > 10">
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
          <p>To show turn-by-turn directions to <strong>{{ selectedFacility?.name }}</strong>, we need to know your current location.</p>
          
          <div v-if="locationError" class="error-message">
            <p>{{ locationError }}</p>
          </div>
          
          <div class="dialog-actions">
            <button @click="getUserLocation" class="allow-btn">
              📍 Share My Location
            </button>
            <button @click="closeLocationDialog" class="deny-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
// import facilityService from '../services/facilityService.js' // Real API
import mockFacilityService from '../services/mockFacilityService.js' // Mock data for now

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Existing reactive data
const facilities = ref([])
const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')
const selectedCountry = ref('')
const selectedCategory = ref('')
const locationInput = ref('')
const viewMode = ref('grid')
const isDevelopment = ref(true) // Set to false in production

// New reactive data for map functionality
const selectedFacility = ref(null)
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

// Methods
const loadAllFacilities = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.getAllFacilities()
    facilities.value = response.data || []
    console.log('✅ Loaded facilities:', response)
    
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

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadAllFacilities()
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.searchFacilities(searchKeyword.value)
    facilities.value = response.data || []
    console.log('🔍 Search results:', response)
  } catch (err) {
    error.value = err.message || 'Search failed'
    console.error('❌ Search error:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  const filters = {}

  if (selectedCountry.value) filters.country = selectedCountry.value
  if (selectedCategory.value) filters.category = selectedCategory.value
  if (locationInput.value.trim()) filters.location = locationInput.value

  // If no filters, load all
  if (Object.keys(filters).length === 0) {
    loadAllFacilities()
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.filterFacilities(filters)
    facilities.value = response.data || []
    console.log('🔧 Filter results:', response)
  } catch (err) {
    error.value = err.message || 'Filter failed'
    console.error('❌ Filter error:', err)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchKeyword.value = ''
  selectedCountry.value = ''
  selectedCategory.value = ''
  locationInput.value = ''
  loadAllFacilities()
}

const selectFacility = (facility) => {
  console.log('📍 Selected facility:', facility)
  selectedFacility.value = facility
  
  // Center map on selected facility if map is loaded
  if (mapLoaded.value && map.value) {
    map.value.setView([facility.coordinates.lat, facility.coordinates.lng], 16)
    
    // Find and open the popup for this facility
    const marker = markers.value.find(m => m.facilityId === facility.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

const selectFacilityFromMap = (facility) => {
  selectFacility(facility)
  
  // Center map on selected facility
  if (mapLoaded.value && map.value) {
    map.value.setView([facility.coordinates.lat, facility.coordinates.lng], 16)
    
    // Find and open the popup for this facility
    const marker = markers.value.find(m => m.facilityId === facility.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

const calculateDistance = (coordinates) => {
  // Simple distance calculation using Haversine formula (more accurate)
  const lat1 = userLocation.value.lat
  const lng1 = userLocation.value.lng
  const lat2 = coordinates.lat
  const lng2 = coordinates.lng

  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

// Map-related methods
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
      13
    )

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value)

    // Create markers layer group
    markersLayer.value = L.layerGroup().addTo(map.value)

    mapLoading.value = false
    mapLoaded.value = true

    // Add markers for current facilities
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

  // Add markers for current facilities
  facilities.value.forEach(facility => {
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
    iconAnchor: [12, 12]
  })

  const marker = L.marker(
    [facility.coordinates.lat, facility.coordinates.lng],
    { icon: customIcon }
  )

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
      ${facility.ethnicTags ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Ethnic Tags:</strong> ${facility.ethnicTags.join(', ')}
        </p>
      ` : ''}
      ${facility.openingHours ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Hours:</strong> ${facility.openingHours}
        </p>
      ` : ''}
      ${facility.phone ? `
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Phone:</strong> ${facility.phone}
        </p>
      ` : ''}
      <div style="text-align: center; margin-top: 12px;">
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
    className: 'custom-popup'
  })

  // Handle marker click
  marker.on('click', () => {
    selectFacility(facility)
  })

  return marker
}

const getMarkerColor = (type) => {
  const colors = {
    'restaurant': '#e74c3c',
    'supermarket': '#27ae60',
    'community center': '#3498db',
    'cultural event': '#9b59b6',
    'food event': '#f39c12',
    'workshop': '#16a085'
  }
  return colors[type] || '#95a5a6'
}

const getMarkerSymbol = (type) => {
  const symbols = {
    'restaurant': '🍽️',
    'supermarket': '🏪',
    'community center': '🏢',
    'cultural event': '🎭',
    'food event': '🍜',
    'workshop': '🎨'
  }
  return symbols[type] || '📍'
}

// Geolocation and routing methods
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
        lng: position.coords.longitude
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
      maximumAge: 60000
    }
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
    iconAnchor: [10, 10]
  })
  
  userLocationMarker.value = L.marker(
    [userLocation.value.lat, userLocation.value.lng],
    { icon: userIcon }
  ).addTo(map.value)
  
  userLocationMarker.value.bindPopup('Your Location', {
    className: 'user-location-popup'
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
      L.latLng(facility.coordinates.lat, facility.coordinates.lng)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    createMarker: function() { return null; }, // Don't create default markers
    lineOptions: {
      styles: [{ color: '#007bff', weight: 6, opacity: 0.8 }]
    },
    show: true,
    showAlternatives: false,
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1'
    })
  }).addTo(map.value)
  
  // Handle routing events
  routingControl.value.on('routesfound', function(e) {
    const routes = e.routes
    const summary = routes[0].summary
    console.log('Route found:', summary)
    
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

const testAPI = async () => {
  console.log('🧪 Testing API...')
  await loadAllFacilities()
}

// Watch for changes in facilities to update map
watch(facilities, () => {
  if (mapLoaded.value && facilities.value.length > 0) {
    updateMapMarkers()
  }
})

// Load data on component mount
onMounted(() => {
  loadAllFacilities()
  
  // Add global function for popup buttons
  window.showDirectionsToFacility = (facilityId) => {
    const facility = facilities.value.find(f => f.id === facilityId)
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
.location-input {
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

/* Facilities Container */
.facilities-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.facilities-container.list {
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

.facility-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.list .facility-image {
  width: 200px;
  height: 150px;
}

.facility-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-type {
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

.facility-content {
  padding: 20px;
}

.list .facility-content {
  flex: 1;
  padding: 15px 20px;
}

.facility-name {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.facility-address,
.facility-phone {
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

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.facility-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-weight: 600;
  color: #f57c00;
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

/* Left Side - Facility List for Map */
.map-facilities-list {
  background: #f8f9fa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.facilities-list-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.facilities-list-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.facilities-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.map-facility-item {
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

.map-facility-item:hover {
  background: #f0f8ff;
  border-color: #007bff;
  transform: translateX(2px);
}

.map-facility-item.selected {
  background: #e3f2fd;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.map-facility-item .facility-info {
  flex: 1;
}

.map-facility-item .facility-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.map-facility-item .facility-type {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 4px 0;
  text-transform: capitalize;
}

.map-facility-item .facility-distance {
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

  .facilities-container.grid {
    grid-template-columns: 1fr;
  }

  .list .facility-card {
    flex-direction: column;
  }

  .list .facility-image {
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

  .map-facilities-list {
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .facilities-scroll-container {
    max-height: 250px;
  }

  .direction-controls {
    justify-content: center;
  }

  .map-facility-item {
    padding: 10px;
  }

  .map-facility-item .facility-name {
    font-size: 0.9rem;
  }

  .map-facility-item .facility-type,
  .map-facility-item .facility-distance {
    font-size: 0.75rem;
  }
}
</style>

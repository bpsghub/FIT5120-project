<template>
  <div class="w-100">
    <BannerMeteor :title="facility?.name || 'Facility Details'"
      :subtitle="facility?.formattedAddress || 'Loading facility information...'" :badges="facilityBadges"
      :mainIcon="facilityIcon" />
    <div class="facility-detail-page my-5">


      <button @click="$router.go(-1)" class="back-btn">← Back</button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading facility details...</p>
      </div>

      <div v-if="error && !loading" class="error-message">
        <p>❌ {{ error }}</p>
        <button @click="loadFacilityDetail" class="retry-btn">Try Again</button>
      </div>

      <div v-if="!loading && !error && facility" class="detail-content">
        <div class="detail-header">
          <div class="header-image">
            <img :src="facility.imageUrl || defaultImage" :alt="facility.name" />
          </div>

          <div class="header-info">
            <!-- Facility name and business status -->
            <div class="status-container">
              <h1 class="facility-name">{{ facility.name }}</h1>
              <el-tag :type="facility.isOpen ? 'success' : 'danger'" class="status-badge" size="large">
                {{ facility.isOpen ? 'Open' : 'Closed' }}
              </el-tag>
            </div>

            <!-- Facility types as tags -->
            <div class="facility-types">
              <el-tag v-for="type in facility.types" :key="type" type="info" class="type-tag" size="small">
                {{ formatType(type) }}
              </el-tag>
            </div>

            <!-- Rating display -->
            <div class="rating">
              <el-rate v-model="facility.rating" disabled show-score text-color="#ff9900"
                score-template="{value} points" />
              <span class="review-count">({{ facility.userRatingCount || 0 }} reviews)</span>
            </div>

            <!-- Address information -->
            <div class="address">
              <el-card class="address-card" shadow="hover">
                <div class="address-content">
                  <el-icon class="address-icon">
                    <LocationFilled />
                  </el-icon>
                  <p>{{ facility.formattedAddress }}</p>
                </div>
              </el-card>
            </div>

            <!-- Action buttons -->
            <div class="action-buttons">
              <el-button @click="getDirections" type="primary" size="large" class="action-btn">
                <el-icon>
                  <Guide />
                </el-icon>
                Get Directions
              </el-button>

              <el-button @click="openGoogleMaps" type="success" size="large" class="action-btn">
                <el-icon>
                  <MapLocation />
                </el-icon>
                View on Google Maps
              </el-button>
            </div>
          </div>
        </div>

        <!-- Facility details and map tabs -->
        <div class="detail-tabs">
          <el-tabs v-model="activeTab" type="card" class="facility-tabs">
            <el-tab-pane label="Details" name="details">
              <div class="tab-content">
                <h3>About This Facility</h3>

                <!-- Location coordinates -->
                <el-card class="info-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon>
                        <Location />
                      </el-icon>
                      <span>Location Information</span>
                    </div>
                  </template>
                  <div class="location-info">
                    <p><strong>Latitude:</strong> {{ facility.location.latitude }}</p>
                    <p><strong>Longitude:</strong> {{ facility.location.longitude }}</p>
                    <p><strong>Business Status:</strong>
                      <el-tag :type="facility.businessStatus === 'OPERATIONAL' ? 'success' : 'warning'" size="small">
                        {{ getBusinessStatusText(facility.businessStatus) }}
                      </el-tag>
                    </p>
                  </div>
                </el-card>

                <!-- Categories -->
                <el-card class="info-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon>
                        <Collection />
                      </el-icon>
                      <span>Categories</span>
                    </div>
                  </template>
                  <div class="categories-list">
                    <el-tag v-for="type in facility.types" :key="type" type="primary" class="category-tag" size="large">
                      {{ formatType(type) }}
                    </el-tag>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Map" name="map">
              <div class="tab-content">
                <div id="facilityMap" class="detail-map"></div>

                <div class="map-actions">
                  <el-button @click="getDirections" type="primary" size="large" class="map-action-btn">
                    <el-icon>
                      <Guide />
                    </el-icon>
                    Get Directions from Your Location
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, h } from 'vue'
import { useRoute } from 'vue-router'
import facilityService from '@/services/facilityService'
import { LocationFilled, Guide, MapLocation, Location, Collection } from '@element-plus/icons-vue'
import BannerMeteor from '@/components/BannerMeteor.vue'

// State management
const route = useRoute()
const facility = ref(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('details')
const defaultImage = 'https://picsum.photos/800/500?grayscale'
const map = ref(null)
const routingControl = ref(null)

// User location
const userLocation = ref({ lat: -37.8136, lng: 144.9631 })
const userLocationFound = ref(false)

// Facility icon for banner
const facilityIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '48',
  height: '48',
  fill: '#ffffff',
}, [
  h('g', {
    fill: 'none',
    stroke: '#ffffff',
    'stroke-linecap': 'round',
    'stroke-miterlimit': '10',
    'stroke-width': '1.5',
  }, [
    h('path', { d: 'M21.5 12h-2.111M12 2.5v2.111M2.5 12h2.111M12 21.5v-2.111m0 0A7.389 7.389 0 1 0 12 4.61a7.389 7.389 0 0 0 0 14.778Z' }),
    h('path', { d: 'M12 16.222a4.222 4.222 0 1 0 0-8.444a4.222 4.222 0 0 0 0 8.444Z' })
  ])
])

// Facility badges
const facilityBadges = [
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })
    ]),
    text: 'Location'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
    ]),
    text: 'Details'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })
    ]),
    text: 'Map'
  }
]

// Helper functions
const getBusinessStatusText = (status) => {
  switch (status) {
    case 'OPERATIONAL':
      return 'Operational'
    case 'CLOSED_TEMPORARILY':
      return 'Temporarily Closed'
    case 'CLOSED_PERMANENTLY':
      return 'Permanently Closed'
    default:
      return 'Unknown Status'
  }
}

// Derive current open status from opening hours
const getOpenStatus = (facility) => {
  const regular = facility && facility.regularOpeningHours
  if (regular && typeof regular.openNow === 'boolean') {
    return regular.openNow
  }
  const current = facility && facility.currentOpeningHours
  if (current && typeof current.openNow === 'boolean') {
    return current.openNow
  }
  return false
}

const formatType = (type) => {
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Open Google Maps in new tab
const openGoogleMaps = () => {
  if (facility.value?.googleMapsUri) {
    window.open(facility.value.googleMapsUri, '_blank')
  }
}
// Load facility details
const loadFacilityDetail = async () => {
  const { id } = route.params
  loading.value = true
  error.value = ''

  try {
    await getUserLocation()
    const response = await facilityService.getFacilityDetail(id)
    facility.value = response.data
    // attach computed open status
    facility.value.isOpen = getOpenStatus(facility.value)

    if (facility.value.location) {
      setTimeout(() => {
        initializeMap()
      }, 500)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load facility details'
    console.error('Error loading facility details:', err)
  } finally {
    loading.value = false
  }
}

// Get user location
const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported')
      resolve()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        userLocationFound.value = true
        resolve()
      },
      (err) => {
        console.warn('Error getting location:', err)
        resolve()
      }
    )
  })
}

// Initialize map
const initializeMap = async () => {
  await nextTick()

  const mapElement = document.getElementById('facilityMap')
  if (!mapElement || !facility.value?.location) return

  const L = window.L || $L
  map.value = L.map(mapElement).setView(
    [facility.value.location.latitude, facility.value.location.longitude],
    16
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  // Add facility marker
  const facilityIcon = L.divIcon({
    className: 'facility-marker',
    html: `
      <div style="
        background-color: #1a73e8;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">
        🏛️
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })

  L.marker(
    [facility.value.location.latitude, facility.value.location.longitude],
    { icon: facilityIcon }
  ).addTo(map.value)
    .bindPopup(`<b>${facility.value.name}</b><br>${facility.value.address}`)
    .openPopup()

  // Add user location marker
  if (userLocationFound.value) {
    L.marker([userLocation.value.lat, userLocation.value.lng])
      .addTo(map.value)
      .bindPopup('Your Location')
  }
}

// Get directions
const getDirections = () => {
  if (!map.value || !facility.value?.location) return

  if (!userLocationFound.value) {
    getUserLocation().then(() => {
      if (userLocationFound.value) {
        initializeMap()
        drawRoute()
      } else {
        alert('Could not get your location. Please enable location services.')
      }
    })
    return
  }

  drawRoute()
}

// Draw route
const drawRoute = () => {
  if (!map.value) return

  // Clear existing route
  if (routingControl.value) {
    map.value.removeControl(routingControl.value)
  }

  const L = window.L || $L
  routingControl.value = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.value.lat, userLocation.value.lng),
      L.latLng(facility.value.location.latitude, facility.value.location.longitude)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    createMarker: () => null,
    lineOptions: {
      styles: [{ color: '#1a73e8', weight: 6, opacity: 0.7 }]
    }
  }).addTo(map.value)
}

// Component lifecycle
onMounted(() => {
  loadFacilityDetail()
})

onUnmounted(() => {
  if (routingControl.value && map.value) {
    map.value.removeControl(routingControl.value)
  }
})
</script>

<style scoped>
.facility-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%);
  min-height: 100vh;
  position: relative;
}

.facility-detail-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);
  pointer-events: none;
}

.back-btn {
  margin-bottom: 30px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #8B5CF6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
  position: relative;
  z-index: 1;
}

.back-btn:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
}

.loading {
  text-align: center;
  padding: 100px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.1);
  position: relative;
  z-index: 1;
}

.spinner {
  border: 4px solid rgba(139, 92, 246, 0.2);
  border-top: 4px solid #8B5CF6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 25px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #8B5CF6;
  font-weight: 600;
  font-size: 18px;
}

.error-message {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(248, 215, 218, 0.3));
  border: 2px solid rgba(220, 53, 69, 0.2);
  border-radius: 25px;
  color: #721c24;
  margin: 30px 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.retry-btn {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
}

.detail-content {
  margin-bottom: 60px;
}

.detail-header {
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.1);
  position: relative;
  z-index: 1;
}

.header-image {
  flex: 0 0 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.header-image:hover img {
  transform: scale(1.05);
}

.header-info {
  flex: 1;
  min-width: 300px;
}

.status-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 15px;
}

.facility-name {
  margin: 0;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-badge {
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-badge.open {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(34, 139, 58, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.status-badge.closed {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(200, 35, 51, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

/* Removed old styles that are no longer used with the new API structure and Element Plus components */

.detail-tabs {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Removed old tab styles and features/hours related styles that are no longer used */

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    gap: 25px;
    padding: 20px;
  }

  .header-image {
    flex: none;
    height: 250px;
  }

  .facility-name {
    font-size: 2rem;
  }

  .facility-types {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .tab-content {
    padding: 20px;
  }

  .categories-list {
    justify-content: center;
  }

  .status-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }

  .rating {
    justify-content: center;
  }
}

/* New styles for updated layout */
.facility-types {
  margin: 15px 0 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-tag {
  margin: 2px;
  border-radius: 15px;
  font-weight: 500;
}

.status-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.status-badge {
  margin-top: 10px;
  border-radius: 20px;
}

.rating {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.review-count {
  color: #718096;
  font-weight: 600;
  font-size: 14px;
}

.address-card {
  margin: 20px 0;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.1);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.08);
}

.address-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.address-icon {
  color: #8B5CF6;
  font-size: 18px;
}

.address-content p {
  margin: 0;
  color: #2d3748;
  font-weight: 500;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.facility-tabs {
  border-radius: 20px;
}

.facility-tabs :deep(.el-tabs__header) {
  margin: 0;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 20px 20px 0 0;
}

.facility-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: rgba(139, 92, 246, 0.2);
}

.facility-tabs :deep(.el-tabs__item) {
  font-weight: 600;
  color: #718096;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
}

.facility-tabs :deep(.el-tabs__item.is-active) {
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.1);
}

.facility-tabs :deep(.el-tabs__active-bar) {
  background-color: #8B5CF6;
}

.tab-content {
  padding: 30px;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-card {
  margin-bottom: 20px;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.1);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2d3748;
}

.card-header .el-icon {
  color: #8B5CF6;
  font-size: 18px;
}

.location-info p {
  margin: 8px 0;
  color: #2d3748;
  font-weight: 500;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  border-radius: 15px;
  font-weight: 600;
  margin: 2px;
}

.map-action-btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 15px 30px;
  margin-top: 20px;
}

.detail-map {
  height: 450px;
  border-radius: 15px;
  margin-bottom: 25px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.map-actions {
  text-align: center;
}

/* Element Plus theme customization */
:deep(.el-rate__text) {
  color: #718096;
  font-weight: 600;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #A78BFA, #8B5CF6);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #28a745, #20c997);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #20c997, #28a745);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

:deep(.el-tag--success) {
  background-color: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.2);
  color: #8B5CF6;
}

:deep(.el-tag--info) {
  background-color: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

:deep(.el-tag--primary) {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
  border-color: rgba(139, 92, 246, 0.2);
  color: #8B5CF6;
}

:deep(.el-card__header) {
  background: rgba(139, 92, 246, 0.05);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}
</style>

<template>
  <div class="find-page">
    <BannerMeteor :title="$t('facility.title')" :subtitle="$t('facility.subtitle')" :badges="facilityBadges"
      :main-icon="facilityMainIcon" />

    <div class="content-wrapper mb-5">
      <div class="controls-container my-3">
        <div class="controls">
          <button @click="showFilters = !showFilters" class="filter-btn" :class="{ 'filter-active': showFilters }">
            <span class="btn-text">Filters</span>
          </button>
        </div>
      </div>

      <!-- Filter panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filter-group">
          <label>Distance Range</label>
          <select v-model="filters.distance">
            <option value="1">Within 1 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Rating</label>
          <select v-model="filters.minRating">
            <option value="0">Any rating</option>
            <option value="3">3 stars and above</option>
            <option value="4">4 stars and above</option>
            <option value="5">5 stars and above</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Open Now</label>
          <input type="checkbox" v-model="filters.openNow">
        </div>

        <!-- Category filter -->
        <div class="filter-group">
          <label>Category</label>
          <select v-model="filters.category">
            <option value="">Any category</option>
            <option value="supermarket">Supermarket</option>
            <option value="clinic">Clinic</option>
            <option value="chinese_restaurant">Chinese restaurant</option>
            <option value="vietnamese_restaurant">Vietnamese restaurant</option>
            <option value="indonesian_restaurant">Indonesian restaurant</option>
            <option value="shopping_mall">Shopping mall</option>
          </select>
        </div>

        <div class="filter-actions">
          <button @click="applyFilters" class="apply-btn">Apply Filters</button>
          <button @click="resetFilters" class="reset-btn">Reset</button>
        </div>
      </div>

      <!-- Main content -->
      <div class="main-content">
        <!-- Left side list -->
        <div class="results-list">
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Loading facilities...</p>
          </div>

          <div v-if="error && !loading" class="error-message">
            <p>❌ {{ error }}</p>
            <button @click="loadData" class="retry-btn">Try Again</button>
          </div>

          <div v-if="!loading && !error && items.length === 0" class="no-results">
            <p>No facilities found matching your criteria.</p>
            <button @click="resetFilters" class="reset-btn">Clear Filters</button>
          </div>

          <div v-if="!loading && !error && items.length > 0" class="cards-container">
            <FacilityCard v-for="item in items" :key="item.id" :facility="item" />
          </div>
        </div>

        <!-- Right side map -->
        <div class="map-container">
          <div id="mainMap" class="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, h } from 'vue'
import FacilityCard from '@/components/FacilityCard.vue'
import BannerMeteor from '@/components/BannerMeteor.vue'
import facilityService from '@/services/facilityService'

// Custom main icon for facility finder
const facilityMainIcon = () => h('svg', {
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
]);

// Facility badges
const facilityBadges = [
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })
    ]),
    text: 'Location',
    translationKey: 'facility.badges.location'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z' })
    ]),
    text: 'Restaurants',
    translationKey: 'facility.badges.restaurants'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' })
    ]),
    text: 'Shopping Malls',
    translationKey: 'facility.badges.shopping'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' })
    ]),
    text: 'Schools',
    translationKey: 'facility.badges.schools'
  },

]

const showFilters = ref(false)
const loading = ref(false)
const error = ref('')
const items = ref([])
const map = ref(null)
const markers = ref([])

const userLocation = ref({ lat: -37.8136, lng: 144.9631 })
const userLocationFound = ref(false)

const filters = ref({
  distance: '5',
  minRating: '0',
  openNow: false,
  category: ''
})

// Derive isOpen from opening hours data returned by backend
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

const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
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
      () => resolve()
    )
  })
}

const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    const filterParams = {
      latitude: userLocation.value.lat,
      longitude: userLocation.value.lng,
      page: 1,
      limit: 20,
      distance: filters.value.distance,
      minRating: filters.value.minRating,
      openNow: filters.value.openNow,
      category: filters.value.category   // Pass category filter to backend
    }

    const response = await facilityService.searchFacilitiesWithFilters(filterParams)
    console.log("Response data is ", response.data)
    items.value = (response.data || []).map(f => ({
      ...f,
      isOpen: getOpenStatus(f)
    }))
    console.log("Response data items is ", items.value)

    updateMapMarkers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const initializeMap = async () => {
  await nextTick()
  const mapElement = document.getElementById('mainMap')
  if (!mapElement) return
  const L = window.L
  if (!L) return
  map.value = L.map(mapElement).setView([userLocation.value.lat, userLocation.value.lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)
}

const clearMarkers = () => {
  if (!map.value) return
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []
}

const updateMapMarkers = () => {
  if (!map.value || !items.value.length) return
  clearMarkers()
  const L = window.L
  if (!L) return
  console.log("items value is ", items.value)
  items.value.forEach(item => {
    if (!item.location) return
    console.log("item location ", item.location)
    const marker = L.marker([item.location.latitude, item.location.longitude]).addTo(map.value)
    marker.bindPopup(`<b>${item.name}</b><br>${item.formattedAddress || ''}`)
    markers.value.push(marker)
  })
}

const applyFilters = () => {
  clearMarkers()
  loadData()
  showFilters.value = false
}

const resetFilters = () => {
  filters.value = {
    distance: '5',
    minRating: '0',
    openNow: false,
    category: ''
  }
  clearMarkers()
  loadData()
  showFilters.value = false
}

onMounted(async () => {
  await getUserLocation()
  await initializeMap()
  loadData()
})

onUnmounted(() => {
  clearMarkers()
  map.value = null
})
</script>

<style scoped>
/* Fresh color scheme - consistent with homepage and navbar */

/* Page header */

.controls-container {
  max-width: 500px;
  margin: 0 auto 1.5rem;
  padding: 0 1rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 1.5rem;
  /* box-shadow: 0 4px 16px rgba(107, 70, 193, 0.12); */
  /* border: 2px solid #e0d4f7; */
  transition: all 0.3s ease;
}

/* Toggle button */
.toggle-btn {
  flex: 1;
  min-width: 200px;
  padding: 14px 24px;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  border: 2px solid #e0d4f7;
}

.btn-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.btn-text {
  transition: all 0.3s ease;
}

.facility-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.event-active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.3);
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 70, 193, 0.2);
  border-color: #a259e6;
}

.toggle-btn:hover .btn-icon {
  transform: scale(1.1);
}

.facility-active:hover,
.event-active:hover {
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

/* Filter button */
.filter-btn {
  flex: 0 0 auto;
  min-width: 140px;
  padding: 14px 24px;
  background: #ffffff;
  border: 2px solid #e0d4f7;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  color: #667eea;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.filter-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-color: #a259e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.2);
}

.filter-btn:hover .btn-icon {
  transform: rotate(90deg);
}

.filter-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.filter-icon {
  font-size: 16px;
}

/* Filter panel */
.filters-panel {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08);
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 0 0 1.5rem 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input[type="checkbox"] {
  padding: 10px 15px;
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.75rem;
  background: #ffffff;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-group select:focus,
.filter-group input[type="checkbox"]:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.filter-group input[type="checkbox"] {
  padding: 0;
  width: 20px;
  height: 20px;
  accent-color: #8B5CF6;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 1rem;
}

.apply-btn {
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.12);
}

.reset-btn {
  background: #ffffff;
  border: 2px solid rgba(113, 128, 150, 0.2);
  padding: 12px 24px;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(113, 128, 150, 0.1);
  border-color: #718096;
  transform: translateY(-2px);
}

/* Main content area */
.main-content {
  display: flex;
  height: calc(100vh - 220px);
  gap: 2rem;
  padding: 0px;
  /* max-width: 1400px; */
  margin: 0 auto;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

/* Results list */
.results-list {
  width: 50%;
  overflow-y: auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* Map container */
.map-container {
  width: 60%;
  height: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.1);
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* Status styles */
.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
}

.spinner {
  border: 4px solid rgba(139, 92, 246, 0.1);
  border-top: 4px solid #8B5CF6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
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
  font-size: 16px;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(248, 215, 218, 0.3));
  border: 2px solid rgba(220, 53, 69, 0.2);
  border-radius: 1.5rem;
  color: #721c24;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
}

.retry-btn {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  font-size: 16px;
  font-weight: 500;
}

/* Scrollbar styling */
.results-list::-webkit-scrollbar {
  width: 8px;
}

.results-list::-webkit-scrollbar-track {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #8B5CF6;
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: #A78BFA;
}

/* Responsive design */
@media (max-width: 1600px) {
  .find-page {
    padding: 1rem;
  }

  .controls-container {
    padding: 0 0.5rem;
  }

  .page-header,
  .filters-panel,
  .main-content {
    max-width: 1400px;
  }

  .main-content {
    gap: 1.5rem;
    padding: 0rem;
    padding-top: 10px;
  }
}

@media (max-width: 1024px) {
  .find-page {
    padding: 1rem;
  }

  .page-header,
  .filters-panel,
  .main-content {
    max-width: 100%;
    margin: 0;
  }

  .page-header {
    border-radius: 1rem 1rem 0 0;
  }

  .filters-panel {
    border-radius: 0 0 1rem 1rem;
  }

  .main-content {
    flex-direction: column;
    height: auto;
    gap: 1.5rem;
    border-radius: 1rem;
  }

  .results-list,
  .map-container {
    width: 100%;
    height: 400px;
  }
}

@media (max-width: 768px) {
  .find-page {
    padding: 0.5rem;
  }

  .controls-container {
    padding: 0;
    margin-bottom: 1rem;
  }

  .controls {
    flex-direction: column;
    padding: 0.75rem;
  }

  .toggle-btn,
  .filter-btn {
    min-width: 100%;
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .filters-panel {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .filter-group {
    min-width: auto;
  }

  .filter-actions {
    margin-left: 0;
    justify-content: center;
  }

  .main-content {
    padding: 1rem;
  }

  .results-list,
  .map-container {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .find-page {
    padding: 0.25rem;
  }

  .controls {
    border-radius: 1rem;
  }

  .toggle-btn,
  .filter-btn {
    padding: 12px 18px;
    font-size: 14px;
  }

  .page-header {
    padding: 1rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .filters-panel {
    padding: 1rem;
    border-radius: 0 0 0.75rem 0.75rem;
  }

  .filter-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .apply-btn,
  .reset-btn {
    width: 100%;
  }

  .main-content {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .results-list,
  .map-container {
    height: 300px;
    border-radius: 0.75rem;
  }
}
</style>

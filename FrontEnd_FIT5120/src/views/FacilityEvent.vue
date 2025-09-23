<template>
  <div class="find-page">
    <Header />
    <div class="page-header">
      <h1>Find {{ activeTab === 'facilities' ? 'Facilities' : 'Events' }}</h1>

      <div class="controls">
        <button @click="toggleTab" class="toggle-btn"
          :class="activeTab === 'facilities' ? 'facility-active' : 'event-active'">
          {{ activeTab === 'facilities' ? 'Switch to Events' : 'Switch to Facilities' }}
        </button>

        <button @click="showFilters = !showFilters" class="filter-btn">
          <i class="filter-icon">⚙️</i> Filters
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
        <label v-if="activeTab === 'facilities'">Open Now</label>
        <label v-if="activeTab === 'events'">Active Events</label>
        <input type="checkbox" v-model="filters.openNow">
      </div>

      <!-- Category filter -->
      <div class="filter-group" v-if="activeTab === 'facilities'">
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
          <p>Loading {{ activeTab }}...</p>
        </div>

        <div v-if="error && !loading" class="error-message">
          <p>❌ {{ error }}</p>
          <button @click="loadData" class="retry-btn">Try Again</button>
        </div>

        <div v-if="!loading && !error && items.length === 0" class="no-results">
          <p>No {{ activeTab }} found matching your criteria.</p>
          <button @click="resetFilters" class="reset-btn">Clear Filters</button>
        </div>

        <div v-if="!loading && !error && items.length > 0" class="cards-container">
          <FacilityCard v-for="item in items" :key="item.id" :facility="item" v-if="activeTab === 'facilities'" />

          <EventCard v-for="item in items" :key="item.id" :event="item" v-if="activeTab === 'events'" />
        </div>
      </div>

      <!-- Right side map -->
      <div class="map-container">
        <div id="mainMap" class="map"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import FacilityCard from '@/components/FacilityCard.vue'
import EventCard from '@/components/EventCard.vue'
import facilityService from '@/services/facilityService'
import eventService from '@/services/eventService'
import Header from '@/components/Header.vue'

const activeTab = ref('facilities')
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

const toggleTab = () => {
  activeTab.value = activeTab.value === 'facilities' ? 'events' : 'facilities'
  clearMarkers()
  loadData()
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
    if (activeTab.value === 'facilities') {
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
      console.log("响应数据 is ", response.data)
      items.value = (response.data || []).map(f => ({
        ...f,
        isOpen: getOpenStatus(f)
      }))
      console.log("响应数据 is  items is ", items.value)
    } else {
      const response = await eventService.getNearbyEvents(
        userLocation.value.lat,
        userLocation.value.lng,
        1,
        20
      )
      items.value = response.data


    }

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
  const L = window.L || $L
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
  const L = window.L || $L
  console.log("items value isisisis ", items.value)
  items.value.forEach(item => {
    if (!item.location) return
    console.log("item value loacltoion  ", item.location)
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

/* Page layout */
.find-page {
  background: #f7fafc;
  min-height: 100vh;
  padding: 1.5rem;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 208, 132, 0.1);
  box-shadow: 0 2px 12px rgba(0, 208, 132, 0.08);
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 1.5rem 1.5rem 0 0;
}

.page-header h1 {
  margin: 0;
  color: #2d3748;
  font-size: 2.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-header h1::before {
  content: '📍';
  font-size: 2rem;
  color: #00d084;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Toggle button */
.toggle-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 208, 132, 0.08);
  position: relative;
  overflow: hidden;
  min-width: 140px;
}

.facility-active {
  background: linear-gradient(135deg, #00d084, #4de6a3);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 208, 132, 0.12);
}

.event-active {
  background: linear-gradient(135deg, #ff7675, #fda085);
  color: white;
  box-shadow: 0 4px 20px rgba(255, 118, 117, 0.3);
}

.toggle-btn:not(.facility-active):not(.event-active) {
  background: #ffffff;
  color: #2d3748;
  border: 2px solid rgba(0, 208, 132, 0.2);
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 208, 132, 0.12);
}

/* Filter button */
.filter-btn {
  padding: 12px 24px;
  background: #ffffff;
  border: 2px solid rgba(0, 208, 132, 0.2);
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #00d084;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  background: rgba(0, 208, 132, 0.1);
  border-color: #00d084;
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 208, 132, 0.08);
}

.filter-icon {
  font-size: 16px;
}

/* Filter panel */
.filters-panel {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 208, 132, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 208, 132, 0.08);
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
  border: 2px solid rgba(0, 208, 132, 0.2);
  border-radius: 0.75rem;
  background: #ffffff;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-group select:focus,
.filter-group input[type="checkbox"]:focus {
  outline: none;
  border-color: #00d084;
  box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1);
}

.filter-group input[type="checkbox"] {
  padding: 0;
  width: 20px;
  height: 20px;
  accent-color: #00d084;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 1rem;
}

.apply-btn {
  background: linear-gradient(135deg, #00d084, #4de6a3);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 208, 132, 0.08);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 208, 132, 0.12);
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
  box-shadow: 0 4px 20px rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.1);
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
  box-shadow: 0 4px 20px rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.1);
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
  border: 4px solid rgba(0, 208, 132, 0.1);
  border-top: 4px solid #00d084;
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
  color: #00d084;
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
  background: rgba(0, 208, 132, 0.1);
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #00d084;
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: #4de6a3;
}

/* Responsive design */
@media (max-width: 1600px) {
  .find-page {
    padding: 1rem;
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

  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .controls {
    justify-content: center;
    width: 100%;
  }

  .toggle-btn,
  .filter-btn {
    flex: 1;
    min-width: auto;
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

  .page-header {
    padding: 1rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .controls {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-btn,
  .filter-btn {
    width: 100%;
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

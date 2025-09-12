<template>
  <div class="find-page">
    <div class="page-header">
      <h1>Find {{ activeTab === 'facilities' ? 'Facilities' : 'Events' }}</h1>

      <div class="controls">
        <!-- 切换按钮 -->
        <button
          @click="toggleTab"
          class="toggle-btn"
          :class="activeTab === 'facilities' ? 'facility-active' : 'event-active'"
        >
          {{ activeTab === 'facilities' ? 'Switch to Events' : 'Switch to Facilities' }}
        </button>

        <!-- 筛选按钮 -->
        <button @click="showFilters = !showFilters" class="filter-btn">
          ⚙️ Filters
        </button>
      </div>
    </div>

    <!-- 筛选面板 -->
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
        </select>
      </div>

      <div class="filter-group">
        <label v-if="activeTab === 'facilities'">Open Now</label>
        <label v-if="activeTab === 'events'">Active Events</label>
        <input type="checkbox" v-model="filters.openNow">
      </div>

      <div class="filter-actions">
        <button @click="applyFilters" class="apply-btn">Apply Filters</button>
        <button @click="resetFilters" class="reset-btn">Reset</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧列表 -->
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
          <FacilityCard
            v-for="item in items"
            :key="item.id"
            :facility="item"
          />

          <EventCard
            v-for="item in items"
            :key="item.id"
            :event="item"
            v-if="activeTab === 'events'"
          />
        </div>
      </div>

      <!-- 右侧地图 -->
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

// 状态管理
const activeTab = ref('facilities') // 'facilities' 或 'events'
const showFilters = ref(false)
const loading = ref(false)
const error = ref('')
const items = ref([])
const map = ref(null)
const markers = ref([])

// 用户位置
const userLocation = ref({ lat: -37.8136, lng: 144.9631 }) // 默认墨尔本
const userLocationFound = ref(false)

// 筛选条件
const filters = ref({
  distance: '5',
  minRating: '0',
  openNow: false
})

// 切换设施/活动
const toggleTab = () => {
  activeTab.value = activeTab.value === 'facilities' ? 'events' : 'facilities'
  clearMarkers()
  loadData()
}

// 获取用户位置
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

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    if (activeTab.value === 'facilities') {
      const response = await facilityService.getNearbyFacilities(
        userLocation.value.lat,
        userLocation.value.lng,
        1,
        20
      )
      items.value = response.data
    } else {
      const response = await eventService.getNearbyEvents(
        userLocation.value.lat,
        userLocation.value.lng,
        1,
        20
      )
      items.value = response.data
    }

    // 更新地图标记
    updateMapMarkers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load data'
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

// 初始化地图
const initializeMap = async () => {
  await nextTick()

  const mapElement = document.getElementById('mainMap')
  if (!mapElement) return

  // 初始化地图
  const L = window.L || $L
  map.value = L.map(mapElement).setView(
    [userLocation.value.lat, userLocation.value.lng],
    13
  )

  // 添加地图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  // 添加用户位置标记
  if (userLocationFound.value) {
    L.marker([userLocation.value.lat, userLocation.value.lng])
      .addTo(map.value)
      .bindPopup('Your Location')
      .openPopup()
  }
}

// 清除地图标记
const clearMarkers = () => {
  if (!map.value) return

  markers.value.forEach(marker => {
    map.value.removeLayer(marker)
  })
  markers.value = []
}

// 更新地图标记
const updateMapMarkers = () => {
  if (!map.value || !items.value.length) return

  clearMarkers()
  const L = window.L || $L

  items.value.forEach(item => {
    if (!item.location) return

    // 不同类型使用不同图标
    let iconColor = activeTab.value === 'facilities' ? '#1a73e8' : '#9b59b6'
    let iconSymbol = activeTab.value === 'facilities' ? '🏛️' : '🎉'

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${iconColor};
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
          ${iconSymbol}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    const marker = L.marker(
      [item.location.latitude, item.location.longitude],
      { icon: customIcon }
    ).addTo(map.value)

    // 绑定弹窗
    marker.bindPopup(`
      <div style="width: 200px;">
        <h3 style="margin: 0 0 5px 0; font-size: 1rem;">${item.name}</h3>
        <p style="margin: 0 0 10px 0; font-size: 0.8rem;">
          ${activeTab.value === 'facilities'
            ? `${item.type} • ${item.distance.toFixed(1)}km`
            : `${new Date(item.startDate).toLocaleDateString()}`}
        </p>
        <button onclick="window.location.href='/ ${activeTab.value}/${item.id}'"
                style="background: ${iconColor}; color: white; border: none; padding: 5px 10px;
                       border-radius: 3px; cursor: pointer; font-size: 0.8rem;">
          View Details
        </button>
      </div>
    `)

    markers.value.push(marker)
  })
}

// 应用筛选条件
const applyFilters = () => {
  clearMarkers()
  // 实际应用中这里应该调用带筛选条件的API
  loadData()
  showFilters.value = false
}

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    distance: '5',
    minRating: '0',
    openNow: false
  }
  clearMarkers()
  loadData()
  showFilters.value = false
}

// 组件生命周期
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
.find-page {
  max-width: 100%;
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 15px;
}

.toggle-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.facility-active {
  background-color: #e8f0fe;
  color: #1a73e8;
}

.event-active {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.filter-btn {
  padding: 8px 16px;
  background-color: #f0f2f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.filter-btn:hover {
  background-color: #e1e4e8;
}

.filters-panel {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #555;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.apply-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn {
  background-color: #f0f2f5;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  display: flex;
  height: calc(100vh - 220px);
}

.results-list {
  width: 40%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.map-container {
  width: 60%;
  height: 100%;
  position: sticky;
  top: 0;
}

.map {
  width: 100%;
  height: 100%;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 30px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin: 20px 0;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
</style>

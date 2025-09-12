<template>
  <div class="facility-detail-page">
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
          <div class="status-container">
            <h1 class="facility-name">{{ facility.name }}</h1>
            <span class="status-badge" :class="facility.isOpen ? 'open' : 'closed'">
              {{ facility.isOpen ? 'Open Now' : 'Closed' }}
            </span>
          </div>
          
          <p class="facility-type">{{ facility.type }}</p>
          
          <div class="rating">
            <span class="stars">⭐ {{ facility.rating }}</span>
            <span class="review-count">({{ facility.reviewCount }} reviews)</span>
          </div>
          
          <div class="distance">
            <p>📍 {{ facility.distance.toFixed(1) }} km from your location</p>
          </div>
          
          <div class="address">
            <p>{{ facility.address }}</p>
          </div>
          
          <div class="contact-info">
            <p v-if="facility.phone">📞 {{ facility.phone }}</p>
            <a v-if="facility.website" :href="facility.website" target="_blank" class="website-link">
              🌐 Visit Website
            </a>
          </div>
          
          <div class="action-buttons">
            <button @click="getDirections" class="directions-btn">
              🧭 Get Directions
            </button>
          </div>
        </div>
      </div>
      
      <div class="detail-tabs">
        <div class="tab-buttons">
          <button 
            @click="activeTab = 'details'" 
            :class="['tab-btn', activeTab === 'details' ? 'active' : '']"
          >
            Details
          </button>
          <button 
            @click="activeTab = 'hours'" 
            :class="['tab-btn', activeTab === 'hours' ? 'active' : '']"
          >
            Opening Hours
          </button>
          <button 
            @click="activeTab = 'map'" 
            :class="['tab-btn', activeTab === 'map' ? 'active' : '']"
          >
            Map
          </button>
        </div>
        
        <div v-if="activeTab === 'details'" class="tab-content">
          <h3>About This Facility</h3>
          
          <div class="description">
            <p>{{ facility.description || 'No description available.' }}</p>
          </div>
          
          <div class="facility-features" v-if="facility.features && facility.features.length">
            <h4>Features</h4>
            <div class="features-grid">
              <div v-for="(feature, index) in facility.features" :key="index" class="feature-item">
                ✅ {{ feature }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'hours'" class="tab-content">
          <h3>Opening Hours</h3>
          
          <div class="opening-hours">
            <div v-for="(hour, index) in facility.openingHours" :key="index" class="hour-item">
              <span class="day">{{ hour.day }}</span>
              <span class="hours">{{ hour.hours }}</span>
            </div>
          </div>
          
          <div v-if="facility.specialHours" class="special-hours">
            <h4>Special Hours</h4>
            <div v-for="(hour, index) in facility.specialHours" :key="index" class="hour-item">
              <span class="day">{{ hour.date }}</span>
              <span class="hours">{{ hour.hours }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'map'" class="tab-content">
          <div id="facilityMap" class="detail-map"></div>
          
          <div class="map-actions">
            <button @click="getDirections" class="directions-btn">
              🧭 Get Directions from Your Location
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import facilityService from '@/services/facilityService'

// 状态管理
const route = useRoute()
const facility = ref(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('details')
const defaultImage = 'https://picsum.photos/800/500?grayscale'
const map = ref(null)
const routingControl = ref(null)

// 用户位置
const userLocation = ref({ lat: -37.8136, lng: 144.9631 })
const userLocationFound = ref(false)

// 加载设施详情
const loadFacilityDetail = async () => {
  const { id } = route.params
  loading.value = true
  error.value = ''

  try {
    await getUserLocation()
    const response = await facilityService.getFacilityDetail(id)
    facility.value = response.data
    
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

// 初始化地图
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

  // 添加设施标记
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

  // 添加用户位置标记
  if (userLocationFound.value) {
    L.marker([userLocation.value.lat, userLocation.value.lng])
      .addTo(map.value)
      .bindPopup('Your Location')
  }
}

// 获取路线
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

// 绘制路线
const drawRoute = () => {
  if (!map.value) return

  // 清除现有路线
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

// 组件生命周期
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
  font-family: 'Arial', sans-serif;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #f0f2f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.back-btn:hover {
  background-color: #e1e4e8;
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
  margin: 30px 0;
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

.detail-content {
  margin-bottom: 60px;
}

.detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.header-image {
  flex: 0 0 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.header-info {
  flex: 1;
  min-width: 300px;
}

.status-container {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 10px;
}

.facility-name {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
}

.status-badge.open {
  background: #e6f4ea;
  color: #1e7e34;
}

.status-badge.closed {
  background: #fce8e6;
  color: #c82333;
}

.facility-type {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
}

.rating {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  font-size: 1.1rem;
  font-weight: 500;
}

.review-count {
  color: #666;
}

.distance {
  margin: 0 0 15px 0;
  color: #555;
}

.address {
  margin: 0 0 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  max-width: 600px;
}

.address p {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

.contact-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.contact-info p {
  margin: 0;
  color: #333;
}

.website-link {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.website-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.directions-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.directions-btn:hover {
  background: #218838;
}

.detail-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  padding: 15px 25px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #1a73e8;
  background: #f8f9fa;
}

.tab-btn.active {
  color: #1a73e8;
  border-bottom-color: #1a73e8;
}

.tab-content {
  padding: 30px;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.description {
  line-height: 1.8;
  color: #555;
  margin-bottom: 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.feature-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
}

.opening-hours {
  margin-bottom: 30px;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.day {
  font-weight: 500;
  color: #333;
}

.hours {
  color: #666;
}

.special-hours {
  padding: 20px;
  background: #fff3cd;
  border-radius: 8px;
}

.special-hours h4 {
  margin-top: 0;
  color: #856404;
}

.detail-map {
  height: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.map-actions {
  text-align: center;
}
</style>

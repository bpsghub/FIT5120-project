<template>
  <div class="container mt-4">
    <h1 class="mb-4">墨尔本设施查找</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <p class="mt-2">正在获取设施数据...</p>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    
    <!-- 筛选控件 -->
    <div v-if="!loading" class="card mb-4 p-3">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="category" class="form-label">设施类别</label>
          <select v-model="selectedCategory" id="category" class="form-select" @change="filterByCategory">
            <option value="">所有类别</option>
            <option value="school">学校</option>
            <option value="theatre">剧院</option>
            <option value="health">医疗服务</option>
            <option value="sport">体育设施</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="radius" class="form-label">搜索半径（公里）</label>
          <select v-model="searchRadius" id="radius" class="form-select" @change="loadNearbyFacilities">
            <option value="1">1公里</option>
            <option value="5">5公里</option>
            <option value="10">10公里</option>
            <option value="20">20公里</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-primary w-100" @click="refreshLocation">
            <i class="bi bi-crosshair"></i> 使用当前位置
          </button>
        </div>
      </div>
    </div>
    
    <!-- 地图和结果区域 -->
    <div v-if="!loading && !error" class="row">
      <!-- 地图 -->
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-body p-0">
            <div id="map" class="map-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 结果列表 -->
      <div class="col-md-4">
        <div class="card h-100 overflow-auto">
          <div class="card-header">
            <h5 class="mb-0">设施列表 ({{ filteredFacilities.length }})</h5>
          </div>
          <div class="list-group list-group-flush">
            <div v-for="facility in filteredFacilities" :key="facility.id" 
                 class="list-group-item list-group-item-action"
                 @click="showFacilityDetails(facility)">
              <h6 class="mb-1">{{ facility.name }}</h6>
              <p class="mb-1 small text-muted">{{ facility.category }}</p>
              <p class="mb-0 small">{{ facility.address }}</p>
              <p class="mb-0 small text-primary">{{ facility.distance.toFixed(1) }} 公里</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设施详情模态框 -->
    <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true" ref="facilityModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedFacility.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedFacility">
              <p><strong>类别:</strong> {{ selectedFacility.category }}</p>
              <p><strong>地址:</strong> {{ selectedFacility.address }}</p>
              <p><strong>描述:</strong> {{ selectedFacility.description || '无描述信息' }}</p>
              <p><strong>距离:</strong> {{ selectedFacility.distance.toFixed(1) }} 公里</p>
              <p><strong>文化背景:</strong> {{ selectedFacility.culturalBackground }}</p>
              <p v-if="selectedFacility.contact"><strong>联系方式:</strong> {{ selectedFacility.contact }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import facilityService from '../services/facilityService.js'
import { Modal } from 'bootstrap'

// 状态变量
const loading = ref(true)
const error = ref('')
const facilities = ref([])
const filteredFacilities = ref([])
const userLocation = ref({ lat: -37.8136, lng: 144.9631 }) // 默认为墨尔本市中心
const map = ref(null)
const markers = ref([])
const selectedCategory = ref('')
const searchRadius = ref(5)
const selectedFacility = ref(null)
const modalId = 'facilityDetailsModal'
const facilityModal = ref(null)

// 初始化地图
const initMap = () => {
  // 清除现有地图
  if (map.value) {
    map.value.remove()
  }
  
  // 创建新地图
  map.value = L.map('map').setView([userLocation.value.lat, userLocation.value.lng], 13)
  
  // 添加地图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)
  
  // 添加用户位置标记
  L.marker([userLocation.value.lat, userLocation.value.lng], {
    icon: L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })
  }).addTo(map.value)
    .bindPopup('您的位置')
    .openPopup()
  
  // 添加设施标记
  addFacilityMarkers()
}

// 添加设施标记到地图
const addFacilityMarkers = () => {
  // 清除现有标记
  markers.value.forEach(marker => {
    if (map.value && marker) {
      map.value.removeLayer(marker)
    }
  })
  markers.value = []
  
  // 添加新标记
  filteredFacilities.value.forEach(facility => {
    const marker = L.marker([facility.latitude, facility.longitude])
      .addTo(map.value)
      .bindPopup(`<b>${facility.name}</b><br>${facility.category}<br>${facility.distance.toFixed(1)} 公里`)
    
    marker.on('click', () => {
      showFacilityDetails(facility)
    })
    
    markers.value.push(marker)
  })
}

// 加载附近的设施
const loadNearbyFacilities = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const data = await facilityService.getNearbyFacilities(
      userLocation.value.lat, 
      userLocation.value.lng, 
      searchRadius.value
    )
    
    facilities.value = data
    filteredFacilities.value = data
    loading.value = false
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

// 根据类别筛选设施
const filterByCategory = () => {
  if (!selectedCategory.value) {
    filteredFacilities.value = [...facilities.value]
  } else {
    filteredFacilities.value = facilities.value.filter(facility => 
      facility.category && facility.category.toLowerCase().includes(selectedCategory.value.toLowerCase())
    )
  }
  addFacilityMarkers()
}

// 刷新用户位置
const refreshLocation = () => {
  if (navigator.geolocation) {
    loading.value = true
    error.value = ''
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        initMap()
        loadNearbyFacilities()
      },
      (err) => {
        error.value = '无法获取您的位置，请允许位置权限或使用默认位置'
        console.error('位置获取失败:', err)
        loading.value = false
      }
    )
  } else {
    error.value = '您的浏览器不支持地理位置'
  }
}

// 显示设施详情
const showFacilityDetails = (facility) => {
  selectedFacility.value = facility
  const modal = new Modal(facilityModal.value)
  modal.show()
}

// 初始化
onMounted(() => {
  // 设置地图容器高度
  const mapContainer = document.getElementById('map')
  if (mapContainer) {
    mapContainer.style.height = '600px'
  }
  
  // 初始化地图和数据
  initMap()
  loadNearbyFacilities()
  
  // 监听筛选条件变化，更新地图标记
  watch([() => filteredFacilities.value, () => userLocation.value], addFacilityMarkers)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.list-group-item {
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>

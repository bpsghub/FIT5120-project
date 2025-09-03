<template>
  <div class="map-container">
    <div id="facilityMap" class="map" ref="mapContainer"></div>

    <!-- Map Loading State -->
    <div v-if="loading" class="map-loading">
      <div class="loading-spinner"></div>
      <p>Loading map...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const mapContainer = ref(null)

defineExpose({
  mapContainer,
})
</script>

<style scoped>
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
</style>

<template>
  <div v-if="!loading && !error && currentItems.length > 0" class="map-section">
    <MapHeader
      :activeTab="activeTab"
      :userLocationFound="userLocationFound"
      @clear-directions="clearDirections"
    />

    <div class="map-content">
      <!-- Left Side - Items List -->
      <MapItemsList
        :items="currentItems"
        :activeTab="activeTab"
        :selectedItem="selectedItem"
        :userLocation="userLocation"
        @item-select="handleItemSelect"
        @request-directions="requestDirections"
      />

      <!-- Right Side - Map -->
      <MapContainer :loading="mapLoading" ref="mapContainerRef" />
    </div>

    <!-- Location Permission Dialog -->
    <LocationPermissionDialog
      :show="showLocationPermission"
      :selectedItemName="selectedItem?.name || ''"
      :error="locationError"
      @close="closeLocationDialog"
      @allow-location="getUserLocation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapHeader from './MapHeader.vue'
import MapItemsList from './MapItemsList.vue'
import MapContainer from './MapContainer.vue'
import LocationPermissionDialog from './LocationPermissionDialog.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  currentItems: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
  selectedItem: {
    type: Object,
    default: null,
  },
  userLocation: {
    type: Object,
    required: true,
  },
  userLocationFound: {
    type: Boolean,
    default: false,
  },
  mapLoading: {
    type: Boolean,
    default: false,
  },
  showLocationPermission: {
    type: Boolean,
    default: false,
  },
  locationError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'clear-directions',
  'item-select',
  'request-directions',
  'close-location-dialog',
  'get-user-location',
])

const mapContainerRef = ref(null)

const clearDirections = () => {
  emit('clear-directions')
}

const handleItemSelect = (item) => {
  emit('item-select', item)
}

const requestDirections = (item) => {
  emit('request-directions', item)
}

const closeLocationDialog = () => {
  emit('close-location-dialog')
}

const getUserLocation = () => {
  emit('get-user-location')
}

defineExpose({
  mapContainerRef,
})
</script>

<style scoped>
.map-section {
  margin-top: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 600px;
}

@media (max-width: 768px) {
  .map-content {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 400px;
    height: 700px;
  }
}
</style>

<template>
  <div class="map-header">
    <h3>Map View - {{ activeTab === 'facilities' ? 'Facilities' : 'Events' }}</h3>
    <div class="map-controls">
      <div class="direction-controls" v-if="userLocationFound">
        <button @click="$emit('clear-directions')" class="clear-directions-btn">
          Clear Directions
        </button>
        <span class="location-status">📍 Location enabled</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  userLocationFound: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['clear-directions'])
</script>

<style scoped>
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

@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .map-controls {
    justify-content: center;
  }

  .direction-controls {
    justify-content: center;
  }
}
</style>

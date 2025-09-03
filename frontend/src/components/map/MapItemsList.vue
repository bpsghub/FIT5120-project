<template>
  <div class="map-items-list">
    <div class="items-list-header">
      <h4>We found {{ items.length }} {{ activeTab }} near you!</h4>
    </div>

    <div class="items-scroll-container">
      <div
        v-for="item in items"
        :key="item.id"
        @click="$emit('item-select', item)"
        :class="['map-item', { selected: selectedItem?.id === item.id }]"
      >
        <div class="item-info">
          <h5 class="item-name">{{ item.name }}</h5>
          <p class="item-type">{{ item.type }}</p>
          <p v-if="activeTab === 'events'" class="item-date">{{ formatDate(item.date) }}</p>
          <p class="item-distance">{{ calculateDistance(item.coordinates) }} km</p>
        </div>
        <button
          @click.stop="$emit('request-directions', item)"
          class="get-directions-btn"
          :title="`Get directions to this ${activeTab.slice(0, -1)}`"
        >
          🧭
        </button>
      </div>
    </div>

    <!-- Pagination for map items list -->
    <div class="map-pagination" v-if="items.length > 10">
      <button class="page-btn">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <span class="pagination-more">>></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
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
})

defineEmits(['item-select', 'request-directions'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const calculateDistance = (coordinates) => {
  const lat1 = props.userLocation.lat
  const lng1 = props.userLocation.lng
  const lat2 = coordinates.lat
  const lng2 = coordinates.lng

  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}
</script>

<style scoped>
.map-items-list {
  background: #f8f9fa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.items-list-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.items-list-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.items-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.map-item {
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

.map-item:hover {
  background: #f0f8ff;
  border-color: #007bff;
  transform: translateX(2px);
}

.map-item.selected {
  background: #e3f2fd;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.map-item .item-info {
  flex: 1;
}

.map-item .item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.map-item .item-type {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 4px 0;
  text-transform: capitalize;
}

.map-item .item-date {
  font-size: 0.75rem;
  color: #007bff;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.map-item .item-distance {
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

@media (max-width: 768px) {
  .map-items-list {
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .items-scroll-container {
    max-height: 250px;
  }

  .map-item {
    padding: 10px;
  }

  .map-item .item-name {
    font-size: 0.9rem;
  }

  .map-item .item-type,
  .map-item .item-date,
  .map-item .item-distance {
    font-size: 0.75rem;
  }
}
</style>

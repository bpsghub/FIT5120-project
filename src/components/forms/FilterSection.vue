<template>
  <div class="filter-section">
    <div class="filter-row">
      <div class="filter-group">
        <label>Country/Ethnicity:</label>
        <select v-model="filters.selectedCountry" @change="handleFilterChange">
          <option value="">All Countries</option>
          <option value="Chinese">Chinese</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Indonesian">Indonesian</option>
          <option value="Korean">Korean</option>
          <option value="Japanese">Japanese</option>
          <option value="Thai">Thai</option>
        </select>
      </div>

      <!-- Facility-specific filters -->
      <div v-if="activeTab === 'facilities'" class="filter-group">
        <label>Category:</label>
        <select v-model="filters.selectedCategory" @change="handleFilterChange">
          <option value="">All Categories</option>
          <option value="restaurant">Restaurant</option>
          <option value="supermarket">Supermarket</option>
          <option value="community center">Community Center</option>
        </select>
      </div>

      <!-- Event-specific filters -->
      <div v-if="activeTab === 'events'" class="filter-group">
        <label>Event Type:</label>
        <select v-model="filters.selectedEventType" @change="handleFilterChange">
          <option value="">All Types</option>
          <option value="cultural event">Cultural Event</option>
          <option value="food event">Food Event</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      <div v-if="activeTab === 'events'" class="filter-group">
        <label>Category:</label>
        <select v-model="filters.selectedEventCategory" @change="handleFilterChange">
          <option value="">All Categories</option>
          <option value="festival">Festival</option>
          <option value="educational">Educational</option>
          <option value="entertainment">Entertainment</option>
          <option value="market">Market</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Location:</label>
        <input
          v-model="filters.locationInput"
          @input="handleFilterChange"
          placeholder="Postcode or suburb"
          class="location-input"
        />
      </div>

      <!-- Date filters for events -->
      <div v-if="activeTab === 'events'" class="filter-group">
        <label>Date From:</label>
        <input
          v-model="filters.dateFrom"
          @change="handleFilterChange"
          type="date"
          class="date-input"
        />
      </div>

      <div v-if="activeTab === 'events'" class="filter-group">
        <label>Date To:</label>
        <input
          v-model="filters.dateTo"
          @change="handleFilterChange"
          type="date"
          class="date-input"
        />
      </div>

      <button @click="handleClearFilters" class="clear-btn">Clear All</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['filter-change', 'clear-filters'])

const filters = reactive({
  selectedCountry: '',
  selectedCategory: '',
  selectedEventType: '',
  selectedEventCategory: '',
  locationInput: '',
  dateFrom: '',
  dateTo: '',
  ...props.initialFilters,
})

const handleFilterChange = () => {
  emit('filter-change', { ...filters })
}

const handleClearFilters = () => {
  Object.keys(filters).forEach((key) => {
    filters[key] = ''
  })
  emit('clear-filters')
}

// Watch for external filter changes
watch(
  () => props.initialFilters,
  (newFilters) => {
    Object.assign(filters, newFilters)
  },
  { deep: true },
)
</script>

<style scoped>
.filter-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.filter-group select,
.location-input,
.date-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  height: fit-content;
}

.clear-btn:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 15px;
  }

  .filter-group {
    min-width: 100%;
  }
}
</style>

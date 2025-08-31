<template>
  <div class="facility_event-w">
    <div class="header-section">
      <h1>Find Facility / Event</h1>
      <p class="subtitle">
        Discover local facilities and community centers that serve your cultural needs
      </p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          @input="handleSearch"
          @keyup.enter="handleSearch"
          placeholder="Search by name, suburb, postcode..."
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">🔍</button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>Country/Ethnicity:</label>
          <select v-model="selectedCountry" @change="applyFilters">
            <option value="">All Countries</option>
            <option value="Chinese">Chinese</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Korean">Korean</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Category:</label>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option value="restaurant">Restaurant</option>
            <option value="supermarket">Supermarket</option>
            <option value="community center">Community Center</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Location:</label>
          <input
            v-model="locationInput"
            @input="applyFilters"
            placeholder="Postcode or suburb"
            class="location-input"
          />
        </div>

        <button @click="clearFilters" class="clear-btn">Clear All</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading facilities...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="loadAllFacilities" class="retry-btn">Try Again</button>
    </div>

    <!-- Results Section -->
    <div v-if="!loading && !error" class="results-section">
      <div class="results-header">
        <h3>Found {{ facilities.length }} facilities</h3>
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            Grid
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            List
          </button>
        </div>
      </div>

      <!-- Facilities Grid/List -->
      <div :class="['facilities-container', viewMode]">
        <div
          v-for="facility in facilities"
          :key="facility.id"
          class="facility-card"
          @click="selectFacility(facility)"
        >
          <div class="facility-image">
            <img :src="facility.image" :alt="facility.name" />
            <div class="facility-type">{{ facility.type }}</div>
          </div>

          <div class="facility-content">
            <h3 class="facility-name">{{ facility.name }}</h3>
            <p class="facility-address">📍 {{ facility.address }}</p>
            <p class="facility-phone">📞 {{ facility.phone }}</p>

            <div class="facility-tags">
              <span v-for="tag in facility.ethnicTags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <div class="facility-rating">
              <span class="stars">⭐</span>
              <span>{{ facility.rating }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="facilities.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No facilities found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <button @click="clearFilters" class="clear-btn">Clear Filters</button>
      </div>
    </div>

    <!-- Test Button (temporary for development) -->
    <div class="debug-section" v-if="isDevelopment">
      <button @click="testAPI" class="test-btn">Test API Connection</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import facilityService from '../services/facilityService.js' // Real API
import mockFacilityService from '../services/mockFacilityService.js' // Mock data for now

// Reactive data
const facilities = ref([])
const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')
const selectedCountry = ref('')
const selectedCategory = ref('')
const locationInput = ref('')
const viewMode = ref('grid')
const isDevelopment = ref(true) // Set to false in production

// Methods
const loadAllFacilities = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.getAllFacilities()
    facilities.value = response.data || []
    console.log('✅ Loaded facilities:', response)
  } catch (err) {
    error.value = err.message || 'Failed to load facilities'
    console.error('❌ Error loading facilities:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadAllFacilities()
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.searchFacilities(searchKeyword.value)
    facilities.value = response.data || []
    console.log('🔍 Search results:', response)
  } catch (err) {
    error.value = err.message || 'Search failed'
    console.error('❌ Search error:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  const filters = {}

  if (selectedCountry.value) filters.country = selectedCountry.value
  if (selectedCategory.value) filters.category = selectedCategory.value
  if (locationInput.value.trim()) filters.location = locationInput.value

  // If no filters, load all
  if (Object.keys(filters).length === 0) {
    loadAllFacilities()
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await mockFacilityService.filterFacilities(filters)
    facilities.value = response.data || []
    console.log('🔧 Filter results:', response)
  } catch (err) {
    error.value = err.message || 'Filter failed'
    console.error('❌ Filter error:', err)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchKeyword.value = ''
  selectedCountry.value = ''
  selectedCategory.value = ''
  locationInput.value = ''
  loadAllFacilities()
}

const selectFacility = (facility) => {
  console.log('📍 Selected facility:', facility)
  // TODO: Navigate to facility detail page or show modal
  alert(`Selected: ${facility.name}\nAddress: ${facility.address}`)
}

const testAPI = async () => {
  console.log('🧪 Testing API...')
  await loadAllFacilities()
}

// Load data on component mount
onMounted(() => {
  loadAllFacilities()
})
</script>

<style scoped>
.facility_event-w {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

/* Filter Section */
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
.location-input {
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

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  text-align: center;
  padding: 20px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin-bottom: 20px;
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

/* Results Section */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  margin: 0;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.view-btn.active {
  background: #007bff;
  color: white;
}

/* Facilities Container */
.facilities-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.facilities-container.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Facility Cards */
.facility-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.facility-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.list .facility-card {
  display: flex;
}

.facility-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.list .facility-image {
  width: 200px;
  height: 150px;
}

.facility-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-type {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.facility-content {
  padding: 20px;
}

.list .facility-content {
  flex: 1;
  padding: 15px 20px;
}

.facility-name {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.facility-address,
.facility-phone {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.facility-tags {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.facility-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-weight: 600;
  color: #f57c00;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results h3 {
  margin-bottom: 10px;
  color: #333;
}

/* Debug Section */
.debug-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px dashed #ddd;
  text-align: center;
}

.test-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.test-btn:hover {
  background: #1e7e34;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }

  .filter-row {
    flex-direction: column;
    gap: 15px;
  }

  .filter-group {
    min-width: 100%;
  }

  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .facilities-container.grid {
    grid-template-columns: 1fr;
  }

  .list .facility-card {
    flex-direction: column;
  }

  .list .facility-image {
    width: 100%;
    height: 200px;
  }
}
</style>

import { ref, computed } from 'vue'
import { facilityService } from '@/services'

export function useFacilities() {
  const facilities = ref([])
  const loading = ref(false)
  const error = ref('')

  // Get all facilities
  const loadFacilities = async (page = 1, limit = 20) => {
    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.getAllFacilities(page, limit)
      facilities.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to load facilities'
      throw err
    } finally {
      loading.value = false
    }
  }
  // Search facilities
  const searchFacilities = async (keyword) => {
    if (!keyword?.trim()) {
      return loadFacilities()
    }

    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.searchFacilities(keyword)
      facilities.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Search failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter facilities
  const filterFacilities = async (filters) => {
    if (Object.keys(filters).length === 0) {
      return loadFacilities()
    }

    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.filterFacilities(filters)
      facilities.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Filter failed'
      throw err
    } finally {
      loading.value = false
    }
  }
  // Get nearby facilities
  const getNearbyFacilities = async (lat, lng, radius = 5) => {
    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.getNearbyFacilities(lat, lng, radius)
      facilities.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to get nearby facilities'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    facilities: computed(() => facilities.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadFacilities,
    searchFacilities,
    filterFacilities,
    getNearbyFacilities,
  }
}

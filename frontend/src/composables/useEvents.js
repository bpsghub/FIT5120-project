import { ref, computed } from 'vue'
import { facilityService } from '@/services'

export function useEvents() {
  const events = ref([])
  const loading = ref(false)
  const error = ref('')

  // Get all events
  const loadEvents = async (page = 1, limit = 20) => {
    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.getAllEvents(page, limit)
      events.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to load events'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search events
  const searchEvents = async (keyword) => {
    if (!keyword?.trim()) {
      return loadEvents()
    }

    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.searchEvents(keyword)
      events.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Search failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter events
  const filterEvents = async (filters) => {
    if (Object.keys(filters).length === 0) {
      return loadEvents()
    }

    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.filterEvents(filters)
      events.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Filter failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get nearby events
  const getNearbyEvents = async (lat, lng, radius = 5) => {
    loading.value = true
    error.value = ''

    try {
      const response = await facilityService.getNearbyEvents(lat, lng, radius)
      events.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to get nearby events'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    events: computed(() => events.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadEvents,
    searchEvents,
    filterEvents,
    getNearbyEvents,
  }
}

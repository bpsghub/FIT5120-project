import apiClient from '../config/api.js'

class FacilityService {
  // Get all facilities with pagination
  async getAllFacilities(page = 1, limit = 20) {
    try {
      const response = await apiClient.get('/facilities', {
        params: { page, limit },
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch facilities: ${error.message}`)
    }
  }

  // Filter facilities
  async filterFacilities(filters) {
    try {
      const response = await apiClient.post('/facilities/filter', filters)
      return response.data
    } catch (error) {
      throw new Error(`Failed to filter facilities: ${error.message}`)
    }
  }

  // Search facilities by keyword
  async searchFacilities(keyword) {
    try {
      const response = await apiClient.get('/facilities/search', {
        params: { q: keyword },
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to search facilities: ${error.message}`)
    }
  }

  // Get nearby facilities (supporting API)
  async getNearbyFacilities(lat, lng, radius = 5) {
    try {
      const response = await apiClient.get('/facilities/nearby', {
        params: { lat, lng, radius },
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to get nearby facilities: ${error.message}`)
    }
  }
}

export default new FacilityService()

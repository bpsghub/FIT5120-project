import api from './api'

const facilityService = {
  // Get nearby facilities
  getNearbyFacilities: (latitude, longitude, page = 1, limit = 20) => {
    console.log('getNearbyFacilities')
    console.log(latitude, longitude)
    return api.get('/facilities/nearby', {
      params: { latitude, longitude, page, limit }
    })
  },

  // Get facility details
  getFacilityDetail: (id) => {
    return api.get(`/facilities/${id}`)
  },

  // Basic search (without filters)
  searchFacilities: (query, filters = {}) => {
    return api.get('/facilities/search', {
      params: { ...query, ...filters }
    })
  },

  // Search facilities with filters
  searchFacilitiesWithFilters: (filterParams) => {
    console.log('facilityService: sending filter request', filterParams);

    // Convert parameters: frontend filters.language -> backend language parameters
    const params = {
      latitude: filterParams.latitude,
      longitude: filterParams.longitude,
      page: filterParams.page,
      limit: filterParams.limit,
      distance: filterParams.distance,
      minRating: filterParams.minRating,
      openNow: filterParams.openNow,
      category: filterParams.category || ''  // Send category preference to backend
    }

    return api.get('/facilities/search', { params })
  }
}

export default facilityService

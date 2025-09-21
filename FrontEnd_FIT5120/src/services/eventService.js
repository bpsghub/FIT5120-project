import api from './api'

const eventService = {
  // Get nearby events
  getNearbyEvents: (latitude, longitude, page = 1, limit = 20) => {
    return api.get('/events/nearby', {
      params: { latitude, longitude, page, limit }
    })
  },
  
  // Get event details
  getEventDetail: (id) => {
    return api.get(`/events/${id}`)
  },
  
  // Search events
  searchEvents: (query, filters = {}) => {
    return api.get('/events/search', {
      params: { ...query, ...filters }
    })
  },
  
  // Event registration
  registerForEvent: (eventId, registrationData) => {
    return api.post(`/events/${eventId}/register`, registrationData)
  }
}

export default eventService

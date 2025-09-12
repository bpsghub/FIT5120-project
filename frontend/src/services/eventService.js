import api from './api'

const eventService = {
  // 获取附近的活动
  getNearbyEvents: (latitude, longitude, page = 1, limit = 20) => {
    return api.get('/events/nearby', {
      params: { latitude, longitude, page, limit }
    })
  },
  
  // 获取活动详情
  getEventDetail: (id) => {
    return api.get(`/events/${id}`)
  },
  
  // 搜索活动
  searchEvents: (query, filters = {}) => {
    return api.get('/events/search', {
      params: { ...query, ...filters }
    })
  },
  
  // 活动报名
  registerForEvent: (eventId, registrationData) => {
    return api.post(`/events/${eventId}/register`, registrationData)
  }
}

export default eventService

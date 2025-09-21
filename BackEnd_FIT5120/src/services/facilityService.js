import apiClient from '../config/api.js'

class FacilityService {
  // 获取所有设施（带分页）
  async getAllFacilities(page = 1, limit = 20) {
    try {
      const response = await apiClient.get('/facilities', {
        params: { page, size: limit }
      })
      return response.data
    } catch (error) {
      throw new Error(`获取设施失败：${error.message}`)
    }
  }

  // 获取附近的设施
  async getNearbyFacilities(lat, lng, radius = 5) {
    try {
      const response = await apiClient.get('/api/facilities/nearby', {
        params: { lat, lng, radius }
      })
      return response.data
    } catch (error) {
      throw new Error(`获取附近设施失败：${error.message}`)
    }
  }

  // 按类别筛选设施
  async filterByCategory(category) {
    try {
      const response = await apiClient.get('/api/facilities/filter', {
        params: { category }
      })
      return response.data
    } catch (error) {
      throw new Error(`筛选设施失败：${error.message}`)
    }
  }
}

export default new FacilityService()

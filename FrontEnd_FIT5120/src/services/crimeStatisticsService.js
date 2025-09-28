import apiClient from '@/config/api'

/**
 * Crime Statistics Service
 * 犯罪统计服务
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
const crimeStatisticsService = {
  
  /**
   * Get crime statistics grouped by LGA for all years
   * 获取按LGA分组的所有年份犯罪统计数据
   */
  async getCrimeStatisticsByLGA() {
    try {
      const response = await apiClient.get('/crime-statistics/by-lga')
      return response.data
    } catch (error) {
      console.error('Error fetching crime statistics by LGA:', error)
      throw error
    }
  },

  /**
   * Get crime statistics grouped by LGA for a specific year
   * 获取指定年份按LGA分组的犯罪统计数据
   */
  async getCrimeStatisticsByLGAAndYear(year) {
    try {
      const response = await apiClient.get(`/crime-statistics/by-lga/${year}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching crime statistics by LGA for year ${year}:`, error)
      throw error
    }
  },

  /**
   * Get crime statistics grouped by LGA for a specific police region
   * 获取指定警区按LGA分组的犯罪统计数据
   */
  async getCrimeStatisticsByPoliceRegion(policeRegion) {
    try {
      const response = await apiClient.get(`/crime-statistics/by-police-region/${encodeURIComponent(policeRegion)}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching crime statistics by police region ${policeRegion}:`, error)
      throw error
    }
  },

  /**
   * Get crime statistics with filters and pagination
   * 获取带筛选条件和分页的犯罪统计数据
   */
  async getCrimeStatisticsWithFilters(params = {}) {
    try {
      const response = await apiClient.get('/crime-statistics/search', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching filtered crime statistics:', error)
      throw error
    }
  },

  /**
   * Get crime statistics grouped by LGA with year information
   * 获取包含年份信息的按LGA分组犯罪统计数据
   */
  async getCrimeStatisticsByLGAWithYear() {
    try {
      const response = await apiClient.get('/crime-statistics/by-lga-with-year')
      return response.data
    } catch (error) {
      console.error('Error fetching crime statistics by LGA with year:', error)
      throw error
    }
  },

  /**
   * Get available years in the database
   * 获取数据库中可用的年份列表
   */
  async getAvailableYears() {
    try {
      const response = await apiClient.get('/crime-statistics/available-years')
      return response.data
    } catch (error) {
      console.error('Error fetching available years:', error)
      throw error
    }
  },

  /**
   * Get available police regions
   * 获取可用的警区列表
   */
  async getAvailablePoliceRegions() {
    try {
      const response = await apiClient.get('/crime-statistics/available-police-regions')
      return response.data
    } catch (error) {
      console.error('Error fetching available police regions:', error)
      throw error
    }
  }
}

export default crimeStatisticsService

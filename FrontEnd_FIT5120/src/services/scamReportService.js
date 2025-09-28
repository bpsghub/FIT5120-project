import api from './api.js'

/**
 * 诈骗报告相关API服务
 */
class ScamReportService {
  /**
   * 获取诈骗报告列表（带分页和筛选条件）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.size - 每页数量，默认10
   * @param {string} params.state - 州/地区筛选（可选）
   * @param {string} params.contactMode - 联系方式筛选（可选）
   * @param {string} params.age - 年龄筛选（可选）
   * @param {string} params.gender - 性别筛选（可选）
   * @param {string} params.categoryLevel2 - 二级分类筛选（可选）
   * @param {string} params.categoryLevel3 - 三级分类筛选（可选）
   * @param {string} params.startDate - 开始日期筛选（可选，格式：yyyy-MM-dd）
   * @param {string} params.endDate - 结束日期筛选（可选，格式：yyyy-MM-dd）
   * @returns {Promise} API响应
   */
  async getScamReports(params = {}) {
    try {
      const response = await api.get('/scam-reports', {
        params: {
          page: params.page || 1,
          size: params.size || 10,
          state: params.state,
          contactMode: params.contactMode,
          age: params.age,
          gender: params.gender,
          categoryLevel2: params.categoryLevel2,
          categoryLevel3: params.categoryLevel3,
          startDate: params.startDate,
          endDate: params.endDate
        }
      })
      return response.data
    } catch (error) {
      console.error('获取诈骗报告失败:', error)
      throw error
    }
  }

  /**
   * 获取诈骗统计数据
   * @returns {Promise} 统计数据
   */
  async getScamStatistics() {
    try {
      const response = await api.get('/scam-reports/statistics')
      return response.data
    } catch (error) {
      console.error('获取诈骗统计数据失败:', error)
      throw error
    }
  }

  /**
   * 获取最新的诈骗警报
   * @param {number} limit - 限制数量，默认5
   * @returns {Promise} 最新警报列表
   */
  async getLatestAlerts(limit = 5) {
    try {
      const response = await api.get('/scam-reports/latest-alerts', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      console.error('获取最新诈骗警报失败:', error)
      throw error
    }
  }
}

export default new ScamReportService()

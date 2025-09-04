import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api', // 后端API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {

  // 获取所有项目（设施和事件），基于用户位置
  getAllItems(lat, lng) {
    return apiClient.get('/AllItem', {
      params: {
        lat: 123.11,
        lng: 123.0
      }
    });
  },

  // 根据筛选条件获取项目
  getFilteredItems(filters, lat, lng) {
    return apiClient.get('/items/filter', {
      params: {
        ...filters,
        lat: lat,
        lng: lng
      }
    });
  },

  // 地理编码：将地址转换为坐标
  geocodeLocation(location) {
    return apiClient.get('/geocode', {
      params: {
        address: location
      }
    });
  },

  // 获取单个项目详情
  getItemDetails(id) {
    return apiClient.get(`/items/${id}`);
  }
};

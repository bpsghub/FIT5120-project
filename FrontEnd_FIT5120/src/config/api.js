import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5566/api', // Change this to your backend URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor (for loading states, auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message)
    return Promise.reject(error)
  },
)

export default apiClient

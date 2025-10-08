import axios from 'axios'

// =========================================================
// 🌍 Base URL 自动切换（根据环境自动选择本地或云端后端）
// =========================================================
// import.meta.env.MODE 是 Vite 自动注入的变量：
// - 'development' → 本地运行 npm run dev
// - 'production' → npm run build 后部署的版本
// =========================================================

const baseURL='http://54.252.184.10:5566/api'
// const baseURL =
//   import.meta.env.MODE === 'development'
//     ? 'http://localhost:5566/api'        // ✅ 本地 Spring Boot 后端
//     : 'https://api.allorigins.win/raw?url=http://54.252.184.10:5566/api'    // ✅ 使用 HTTPS 代理防止 Mixed Content

// =========================================================
// 🚀 创建 axios 实例
// =========================================================
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 请求超时 10 秒
  headers: {
    'Content-Type': 'application/json',
  },
})

// =========================================================
// 🔧 请求拦截器（可打印日志、加 token 等）
// =========================================================
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`
    )
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error.message)
    return Promise.reject(error)
  }
)

// =========================================================
// 📦 响应拦截器（统一日志 & 错误处理）
// =========================================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    const status = error.response?.status
    console.error(
      `❌ API Error: ${status || 'NO_STATUS'} - ${error.message}`
    )
    return Promise.reject(error)
  }
)

// =========================================================
// 🧩 导出统一实例
// =========================================================
export default apiClient

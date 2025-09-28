import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: 6773,
    open: true,
    proxy: {
      // 把 /api/weather 开头的请求代理到 BOM 数据源
      '/api/weather': {
        target: 'http://www.bom.gov.au/fwo', 
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/weather/, '') 
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})

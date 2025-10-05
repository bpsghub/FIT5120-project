import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: 6773,
    open: true,
    proxy: {
      // ✅ 把 /bom 代理到 BOM 的真实数据源
      '/bom': {
        target: 'https://reg.bom.gov.au',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/bom/, ''), // 去掉前缀
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

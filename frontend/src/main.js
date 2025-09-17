import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'bootstrap/dist/css/bootstrap.min.css'

// 修复Leaflet图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const app = createApp(App)
app.config.globalProperties.$L = L
app.use(router).mount('#app')

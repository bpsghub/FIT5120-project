import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import L from 'leaflet'
import 'leaflet-routing-machine'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css' // Import Element Plus styles
import { createI18n } from 'vue-i18n'
import messages from './locales'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'aos/dist/aos.css'

// Import Web Speech test helpers (only in development)
if (import.meta.env.DEV) {
  import('./utils/webSpeechTest.js')
}

// Fix Leaflet icon path issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const savedLocale = localStorage.getItem('locale') || 'en'
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)
app.use(ElementPlus)
app.config.globalProperties.$L = L

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // Register all icons
  app.component(key, component)
}

app.use(router)
app.use(i18n)
app.mount('#app')

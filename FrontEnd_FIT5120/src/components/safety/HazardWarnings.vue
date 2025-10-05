<template>
  <div class="hazard-warnings">
    <div class="module-header">
      <h2 class="module-title">
        ⚠️ {{ t('safety.hazard_warnings', 'Weather & Hazard Warnings') }}
      </h2>
    </div>

    <div class="module-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('safety.loading_weather', 'Loading weather data...') }}</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <span class="error-icon">❌</span>
        <p>{{ t('safety.weather_error', 'Unable to load weather data') }}</p>
        <button @click="fetchWeatherData" class="retry-btn">
          {{ t('safety.retry', 'Retry') }}
        </button>
      </div>

      <!-- 天气数据展示 -->
      <div v-else-if="weatherData" class="weather-display">
        <div class="current-weather">
          <div class="weather-main">
            <span class="temperature">{{ weatherData.temperature }}</span>
            <div class="weather-details">
              <p class="feels-like">{{ t('safety.feels_like', 'Feels like') }} {{ weatherData.feels_like }}</p>
              <p class="location">📍 {{ weatherData.location }}</p>
              <p class="updated">{{ t('safety.updated', 'Updated') }}: {{ weatherData.updated }}</p>
            </div>
          </div>

          <div class="weather-stats">
            <div class="stat-item">
              <span class="stat-icon">💨</span>
              <span class="stat-label">{{ t('safety.wind', 'Wind') }}:</span>
              <span class="stat-value">{{ weatherData.wind }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💧</span>
              <span class="stat-label">{{ t('safety.humidity', 'Humidity') }}:</span>
              <span class="stat-value">{{ weatherData.humidity }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">☔</span>
              <span class="stat-label">{{ t('safety.rain_today', 'Rain Today') }}:</span>
              <span class="stat-value">{{ weatherData.rain_today }}</span>
            </div>
          </div>
        </div>

        <!-- 警告区域 -->
        <div v-if="warnings.length > 0" class="warnings-section">
          <h3 class="warnings-title">🚨 {{ t('safety.active_warnings', 'Active Warnings') }}</h3>
          <div class="warnings-list">
            <div
              v-for="warning in warnings"
              :key="warning.type"
              :class="['warning-item', warning.severity]"
            >
              <span class="warning-icon">{{ warning.icon }}</span>
              <div class="warning-content">
                <h4 class="warning-type">{{ warning.title }}</h4>
                <p class="warning-description">{{ warning.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 无警告状态 -->
        <div v-else class="no-warnings">
          <span class="safe-icon">✅</span>
          <p class="safe-message">{{ t('safety.no_warnings', 'No active weather warnings') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'  // ✅ 关键：必须显式引入 axios

const { t } = useI18n()

const loading = ref(true)
const error = ref(false)
const weatherData = ref(null)

const warnings = computed(() => {
  if (!weatherData.value) return []
  const data = weatherData.value
  const list = []

  const wind = parseFloat(data.wind.match(/\d+\.?\d*/)?.[0] || 0)
  const temp = parseFloat(data.temperature.replace('°C', ''))
  const hum = parseFloat(data.humidity.replace('%', ''))
  const rain = parseFloat(data.rain_today.replace(' mm', ''))

  if (wind > 50)
    list.push({
      icon: '💨',
      title: t('safety.strong_wind_warning', 'Strong Wind Warning'),
      description: t('safety.strong_wind_desc', 'Avoid outdoor activities, watch for falling objects'),
      severity: 'high'
    })
  if (temp > 40)
    list.push({
      icon: '🔥',
      title: t('safety.heat_hazard', 'Heat Hazard'),
      description: t('safety.heat_desc', 'Stay hydrated, avoid midday sun exposure'),
      severity: 'high'
    })
  if (rain > 50)
    list.push({
      icon: '⛈️',
      title: t('safety.heavy_rain_warning', 'Heavy Rain Warning'),
      description: t('safety.heavy_rain_desc', 'Avoid driving in flooded areas, stay indoors if possible'),
      severity: 'medium'
    })
  if (hum < 20 && temp > 35)
    list.push({
      icon: '🔥',
      title: t('safety.bushfire_risk', 'Bushfire Risk'),
      description: t('safety.bushfire_desc', 'High fire danger, avoid outdoor burning'),
      severity: 'high'
    })

  return list
})

const fetchWeatherData = async () => {
  loading.value = true
  error.value = false

  try {
    console.log('🌤️ Fetching weather data from BOM (via Vite proxy)...')

    // ✅ 关键修改：访问 /bom/fwo/ 而不是 /bom.gov.au/fwo/
    const bomUrl =
      import.meta.env.MODE === 'development'
        ? '/bom/fwo/IDV60901/IDV60901.95936.json' // 本地用 Vite 代理
        : 'https://reg.bom.gov.au/fwo/IDV60901/IDV60901.95936.json' // 部署后直接访问 BOM

    const response = await axios.get(bomUrl, { timeout: 10000 })

    const latest = response.data.observations.data[0]
    const header = response.data.observations.header[0]

    weatherData.value = {
      location: header.name || 'Melbourne (Olympic Park)',
      updated: formatDateTime(latest.local_date_time_full),
      temperature: `${latest.air_temp}°C`,
      feels_like: `${latest.apparent_t}°C`,
      wind: `${latest.wind_dir} at ${latest.wind_spd_kmh} km/h`,
      humidity: `${latest.rel_hum}%`,
      rain_today: `${latest.rain_trace} mm`,
    }

    console.log('✅ Weather data loaded:', weatherData.value)
  } catch (err) {
    console.error('❌ Weather API error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}


const formatDateTime = (str) => {
  try {
    const y = str.substring(0, 4)
    const m = str.substring(4, 6)
    const d = str.substring(6, 8)
    const h = str.substring(8, 10)
    const min = str.substring(10, 12)
    const date = new Date(`${y}-${m}-${d}T${h}:${min}:00`)
    return date.toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return new Date().toLocaleString()
  }
}

onMounted(() => fetchWeatherData())
</script>







<style scoped>
.hazard-warnings {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.module-header {
  background: #f3e5f5;
  color: #6a1b9a;
  padding: 1.5rem;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid #ce93d8;
}

.module-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.module-content {
  padding: 1.5rem;
  flex-grow: 1;
}

/* 加载和错误状态 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8e24aa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #8e24aa;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.3);
}

.retry-btn:hover {
  background: #6a1b9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.4);
}

/* Weather display */
.current-weather {
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(106, 27, 154, 0.1);
  border: 1px solid #e1bee7;
}

.weather-main {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.temperature {
  font-size: 2.5rem;
  font-weight: 700;
  color: #8e24aa;
  margin-right: 1.5rem;
}

.weather-details p {
  margin: 0.3rem 0;
  font-size: 1rem;
  color: #555;
}

.feels-like {
  font-weight: 600;
  color: #8e24aa;
}

.weather-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(241, 190, 231, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
}

.stat-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.stat-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.stat-value {
  font-weight: 700;
  color: #8e24aa;
}

/* 警告区域 */
.warnings-section {
  margin-top: 1.5rem;
}

.warnings-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #8e24aa;
}

.warnings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid;
}

.warning-item.high {
  background: #fce4ec;
  border-left-color: #8e24aa;
}

.warning-item.medium {
  background: #f3e5f5;
  border-left-color: #ba68c8;
}

.warning-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.warning-content {
  flex-grow: 1;
}

.warning-type {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #8e24aa;
}

.warning-description {
  margin: 0;
  color: #666;
  line-height: 1.4;
}

/* 无警告状态 */
.no-warnings {
  text-align: center;
  padding: 2rem;
  background: #f1f8e9;
  border-radius: 10px;
  margin-top: 1rem;
}

.safe-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.safe-message {
  color: #8e24aa;
  font-weight: 600;
  margin: 0;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .weather-main {
    flex-direction: column;
    text-align: center;
  }

  .temperature {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .weather-stats {
    grid-template-columns: 1fr;
  }

  .stat-item {
    justify-content: center;
  }
}
</style>

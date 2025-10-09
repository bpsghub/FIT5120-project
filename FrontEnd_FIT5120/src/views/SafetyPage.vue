<template>
  <div class="safety-page">

    <!-- BannerBubble -->
    <BannerBubble :title="t('safety.title', 'Safety Information')"
      :subtitle="t('safety.subtitle', 'Stay safe and informed with real-time warnings, crime alerts, and safety tips')"
      :bubbleTexts="['Safe', '000', 'Help', 'Alert', 'Warning', 'Police', 'Fire', 'Ambulance', 'Emergency', 'Danger', 'Caution', 'SOS']"
      :customIcon="safetyIcon" />

    <!-- 主要内容区 -->
    <div class="safety-content container">
      <div class="safety-grid">
        <!-- 天气预警模块 -->
        <section class="safety-module hazard-section">
          <HazardWarnings />
        </section>

        <!-- 犯罪热点模块 -->
        <section class="safety-module crime-section">
          <CrimeHotspots />
        </section>

        <!-- 诈骗警报模块 -->
        <section class="safety-module scam-section">
          <ScamAlerts />
        </section>

        <!-- 安全提示模块 -->
        <section class="safety-module tips-section">
          <SafetyTips />
        </section>
      </div>

      <!-- 紧急联系按钮 -->
      <div class="emergency-section">
        <button class="emergency-btn" @click="callEmergency">
          🚨 {{ t('safety.emergency_call', 'Call 000 - Emergency') }}
        </button>
        <p class="emergency-note">
          {{ t('safety.emergency_note', 'For immediate emergency assistance') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'
import HazardWarnings from '@/components/safety/HazardWarnings.vue'
import CrimeHotspots from '@/components/safety/CrimeHotspots.vue'
import ScamAlerts from '@/components/safety/ScamAlerts.vue'
import SafetyTips from '@/components/safety/SafetyTips.vue'

// Safety icon (shield)
const safetyIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' })
])

const { t } = useI18n()

const callEmergency = () => {
  if (confirm(t('safety.emergency_confirm', 'Do you want to call 000 for emergency assistance?'))) {
    window.location.href = 'tel:000'
  }
}
</script>

<style scoped>
.safety-page {
  min-height: 100vh;
  background: #ffffff;
}

.safety-content {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.safety-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.safety-module {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.safety-module:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.emergency-section {
  text-align: center;
  margin: 2rem 0;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.emergency-btn {
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: white;
  border: none;
  padding: 1.75rem 3.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(255, 87, 34, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.emergency-btn:hover {
  background: linear-gradient(135deg, #e64a19 0%, #d84315 100%);
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(255, 87, 34, 0.4);
}

.emergency-btn:active {
  transform: translateY(-1px);
}

.emergency-note {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6c757d;
  font-style: italic;
}

/* 老人友好化设计 */
@media (max-width: 768px) {
  .safety-grid {
    gap: 1rem;
    width: 90%;
    padding: 0;
  }

  .safety-header {
    padding: 1.5rem 0;
    margin-bottom: 1rem;
  }

  .safety-title {
    font-size: 2rem;
  }

  .safety-subtitle {
    font-size: 1.1rem;
  }

  .emergency-section {
    width: 90%;
    margin: 1.5rem auto;
  }

  .emergency-btn {
    padding: 1.2rem 2rem;
    font-size: 1.3rem;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .safety-content {
    padding: 0 0.5rem;
  }

  .safety-grid {
    width: 95%;
    gap: 0.8rem;
  }

  .emergency-section {
    width: 95%;
    margin: 1rem auto;
  }

  .safety-title {
    font-size: 1.8rem;
  }

  .safety-subtitle {
    font-size: 1rem;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .safety-module {
    border: 2px solid #333;
  }

  .emergency-btn {
    border: 3px solid #fff;
  }
}

/* 大字体模式支持 */
@media (prefers-reduced-motion: no-preference) {
  .safety-module {
    animation: fadeInUp 0.6s ease-out;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

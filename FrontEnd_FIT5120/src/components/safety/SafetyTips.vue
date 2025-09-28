<template>
  <div class="safety-tips">
    <div class="module-header">
      <h2 class="module-title">
        💡 {{ t('safety.safety_tips', 'Safety Tips & Emergency Contacts') }}
      </h2>
    </div>

    <div class="module-content">
      <!-- 紧急联系区域 -->
      <div class="emergency-contacts">
        <h3 class="section-title emergency-title">
          🚨 {{ t('safety.emergency_contacts', 'Emergency Contacts') }}
        </h3>

        <div class="contacts-grid">
          <button
            v-for="contact in emergencyContacts"
            :key="contact.id"
            class="contact-btn"
            :class="contact.priority"
            @click="makeCall(contact.number, contact.name)"
          >
            <span class="contact-icon">{{ contact.icon }}</span>
            <div class="contact-info">
              <span class="contact-number">{{ contact.number }}</span>
              <span class="contact-name">{{ contact.name }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 安全提示分类 -->
      <div class="tips-sections">
        <div
          v-for="category in safetyCategories"
          :key="category.id"
          class="tips-category"
        >
          <h3 class="category-title">
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.title }}
          </h3>

          <div class="tips-list">
            <div
              v-for="tip in category.tips"
              :key="tip.id"
              class="tip-card"
            >
              <span class="tip-icon">✅</span>
              <p class="tip-text">{{ tip.text }}</p>
            </div>
          </div>
        </div>
      </div>





    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 紧急联系人
const emergencyContacts = ref([
  {
    id: 1,
    number: '000',
    name: t('safety.police_fire_ambulance', 'Police / Fire / Ambulance'),
    icon: '🚨',
    priority: 'critical'
  },
  {
    id: 2,
    number: '131 444',
    name: t('safety.police_non_emergency', 'Police Non-Emergency'),
    icon: '👮',
    priority: 'high'
  },
  {
    id: 3,
    number: '131 450',
    name: t('safety.translation_service', 'Translation Service (TIS)'),
    icon: '🌐',
    priority: 'normal'
  },
  {
    id: 4,
    number: '1300 795 995',
    name: t('safety.scamwatch', 'Scamwatch'),
    icon: '🛡️',
    priority: 'normal'
  }
])

// 安全提示分类
const safetyCategories = ref([
  {
    id: 1,
    icon: '🏠',
    title: t('safety.daily_safety', 'Daily Safety'),
    tips: [
      {
        id: 1,
        text: t('safety.daily_tip1', 'Avoid walking alone at night, especially in unfamiliar areas')
      },
      {
        id: 2,
        text: t('safety.daily_tip2', 'Keep your personal belongings secure and don\'t display expensive items')
      },
      {
        id: 3,
        text: t('safety.daily_tip3', 'Stay aware of your surroundings and trust your instincts')
      },
      {
        id: 4,
        text: t('safety.daily_tip4', 'Let someone know where you\'re going and when you expect to return')
      }
    ]
  },
  {
    id: 2,
    icon: '🛡️',
    title: t('safety.scam_protection', 'Scam Protection'),
    tips: [
      {
        id: 1,
        text: t('safety.scam_tip1', 'Don\'t click on suspicious links in text messages or emails')
      },
      {
        id: 2,
        text: t('safety.scam_tip2', 'Never send money to people you\'ve only met online')
      },
      {
        id: 3,
        text: t('safety.scam_tip3', 'Government agencies won\'t call demanding immediate payment')
      },
      {
        id: 4,
        text: t('safety.scam_tip4', 'If something sounds too good to be true, it probably is')
      }
    ]
  },
  {
    id: 3,
    icon: '🏡',
    title: t('safety.at_home', 'At Home'),
    tips: [
      {
        id: 1,
        text: t('safety.home_tip1', 'Always lock doors and windows, even when you\'re home')
      },
      {
        id: 2,
        text: t('safety.home_tip2', 'Use motion sensor lights or security cameras if possible')
      },
      {
        id: 3,
        text: t('safety.home_tip3', 'Don\'t tell strangers that you live alone')
      },
      {
        id: 4,
        text: t('safety.home_tip4', 'Have a safety plan and know your exit routes')
      }
    ]
  }
])

// 重要提醒
const importantReminders = ref([
  {
    id: 1,
    type: 'critical',
    icon: '🚨',
    title: t('safety.immediate_danger', 'Immediate Danger'),
    description: t('safety.immediate_danger_desc', 'If you are in immediate danger, call 000 first. Don\'t hesitate!')
  },
  {
    id: 2,
    type: 'warning',
    icon: '💰',
    title: t('safety.money_lost', 'Money Lost to Scam'),
    description: t('safety.money_lost_desc', 'Contact your bank immediately and then report to Scamwatch and police')
  },
  {
    id: 3,
    type: 'info',
    icon: '🆔',
    title: t('safety.identity_theft', 'Identity Theft'),
    description: t('safety.identity_theft_desc', 'Contact IDCARE (1800 595 160) for free support with identity theft')
  }
])

// 快速行动
const quickActions = ref([
  {
    id: 1,
    icon: '📞',
    text: t('safety.call_000', 'Call 000'),
    action: 'call_000'
  },
  {
    id: 2,
    icon: '📍',
    text: t('safety.share_location', 'Share Location'),
    action: 'share_location'
  },
  {
    id: 3,
    icon: '🚨',
    text: t('safety.activate_alarm', 'Sound Alarm'),
    action: 'sound_alarm'
  },
  {
    id: 4,
    icon: '📝',
    text: t('safety.report_incident', 'Report Incident'),
    action: 'report_incident'
  }
])

// 有用资源
const helpfulResources = ref([
  {
    id: 1,
    icon: '🛡️',
    title: 'Scamwatch',
    description: t('safety.scamwatch_desc', 'Official Australian scam reporting website'),
    url: 'https://www.scamwatch.gov.au/'
  },
  {
    id: 2,
    icon: '👮',
    title: 'VicPol',
    description: t('safety.vicpol_desc', 'Victoria Police official website'),
    url: 'https://www.police.vic.gov.au/'
  },
  {
    id: 3,
    icon: '🏥',
    title: 'Health Direct',
    description: t('safety.healthdirect_desc', '24/7 health advice line'),
    url: 'https://www.healthdirect.gov.au/'
  },
  {
    id: 4,
    icon: '🆔',
    title: 'IDCARE',
    description: t('safety.idcare_desc', 'Identity theft support service'),
    url: 'https://www.idcare.org/'
  }
])

// 拨打电话
const makeCall = (number, name) => {
  const cleanNumber = number.replace(/\s/g, '')
  if (confirm(t('safety.call_confirm', `Do you want to call ${name} at ${number}?`))) {
    window.location.href = `tel:${cleanNumber}`
  }
}

// 处理快速行动
const handleQuickAction = (action) => {
  switch (action) {
    case 'call_000':
      if (confirm(t('safety.emergency_confirm', 'This will call emergency services. Continue?'))) {
        window.location.href = 'tel:000'
      }
      break
    case 'share_location':
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const locationText = `My location: https://maps.google.com/?q=${latitude},${longitude}`

            if (navigator.share) {
              navigator.share({
                title: 'My Emergency Location',
                text: locationText
              })
            } else {
              navigator.clipboard.writeText(locationText).then(() => {
                alert(t('safety.location_copied', 'Location copied to clipboard'))
              })
            }
          },
          () => {
            alert(t('safety.location_error', 'Unable to get location'))
          }
        )
      }
      break
    case 'sound_alarm':
      // 这里可以实现声音警报功能
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }
      alert(t('safety.alarm_activated', 'Emergency alert activated!'))
      break
    case 'report_incident':
      window.open('https://www.police.vic.gov.au/report', '_blank')
      break
  }
}
</script>

<style scoped>
.safety-tips {
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
  overflow-y: auto;
}

/* 紧急联系区域 */
.emergency-contacts {
  margin-bottom: 2rem;
}

.emergency-title {
  color: #8e24aa !important;
  font-weight: 700;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.contact-btn {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.contact-btn.critical {
  background: #8e24aa;
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.3);
}

.contact-btn.high {
  background: #ba68c8;
  box-shadow: 0 4px 12px rgba(186, 104, 200, 0.3);
}

.contact-btn.normal {
  background: #ce93d8;
  box-shadow: 0 4px 12px rgba(206, 147, 216, 0.3);
}

.contact-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.contact-number {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.contact-name {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* 安全提示分类 */
.tips-sections {
  margin-bottom: 2rem;
}

.tips-category {
  margin-bottom: 1.5rem;
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(106, 27, 154, 0.08);
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
}

.category-icon {
  font-size: 1.3rem;
  margin-right: 0.5rem;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #ba68c8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.tip-card:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.12);
}

.tip-icon {
  font-size: 1.1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.tip-text {
  margin: 0;
  color: #555;
  line-height: 1.4;
  font-size: 0.95rem;
}

/* 重要提醒 */
.important-reminders {
  margin-bottom: 2rem;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reminder-card {
  display: flex;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 10px;
  border-left: 4px solid;
}

.reminder-card.critical {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.reminder-card.warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.reminder-card.info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.reminder-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.reminder-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.reminder-text {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

/* 快速行动 */
.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.action-btn:hover {
  background: linear-gradient(135deg, #5a6268 0%, #494f54 100%);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.action-text {
  font-size: 0.9rem;
  text-align: center;
}

/* 资源链接 */
.resources-section {
  margin-bottom: 1rem;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.resource-link:hover {
  background: #f8f9fa;
  border-color: #007bff;
  transform: translateX(5px);
}

.resource-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.resource-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.resource-title {
  font-weight: 600;
  margin-bottom: 0.2rem;
  color: #007bff;
}

.resource-desc {
  font-size: 0.9rem;
  color: #666;
}

.external-icon {
  font-size: 1rem;
  color: #007bff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .contact-btn {
    justify-content: center;
    text-align: center;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tip-card {
    padding: 0.75rem;
  }

  .reminder-card {
    flex-direction: column;
    text-align: center;
  }

  .reminder-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  .tip-card,
  .reminder-card,
  .resource-link {
    border-width: 2px;
  }

  .contact-btn {
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
}
</style>

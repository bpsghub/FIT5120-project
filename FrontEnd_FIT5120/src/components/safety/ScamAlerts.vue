<template>
  <div class="scam-alerts">
    <div class="module-header">
      <h2 class="module-title">
        🛡️ {{ t('safety.scam_alerts', 'Scam Alerts') }}
      </h2>
    </div>

    <div class="module-content">
      <!-- Warning banner with prevention tips -->
      <div class="warning-banner">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <h3 class="warning-title">{{ t('safety.stay_alert', 'Stay Alert!') }}</h3>
          <p class="warning-text">
            {{ t('safety.scam_warning', 'Scammers often target elderly and new immigrants. Be vigilant!') }}
          </p>
          
          <!-- Prevention tips in banner -->
          <div class="banner-prevention-tips">
            <h4 class="banner-tips-title">
              📝 {{ t('safety.prevention_tips', 'Prevention Tips') }}:
            </h4>
            <ul class="banner-tips-list">
              <li class="banner-tip-item">{{ t('safety.phone_tip1', 'Be suspicious of unexpected calls requesting information') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip2', 'Hang up and call back using official numbers') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip3', 'Government agencies rarely call without prior contact') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip4', 'Never provide personal details over unsolicited calls') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 最新诈骗警报 -->
      <div class="latest-alerts">
        <h3 class="section-title">
          🚨 {{ t('safety.latest_scam_alerts', 'Latest Scam Alerts') }}
        </h3>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ t('safety.loading_scam_data', 'Loading scam reports...') }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">❌</div>
          <p class="error-text">{{ error }}</p>
          <button @click="retryLoad" class="retry-button">
            🔄 {{ t('safety.retry', 'Retry') }}
          </button>
        </div>

        <!-- Data list -->
        <div v-else-if="formattedScamData.length > 0" class="alerts-list">
          <div
            v-for="(scam, index) in formattedScamData"
            :key="scam.id"
            class="scam-card"
            :class="scam.priority"
          >
            <!-- Scam header with icon and title -->
            <div class="scam-header">
              <span class="scam-rank">{{ (pagination.currentPage - 1) * pagination.pageSize + index + 1 }}️⃣</span>
              <span class="scam-icon">{{ scam.icon }}</span>
              <h4 class="scam-title">{{ scam.categoryLevel2 || t('safety.unknown_scam_type', 'Unknown Scam Type') }}</h4>
            </div>

            <!-- Scam details section -->
            <div class="scam-details">
            <div class="scam-description">
                <p class="scam-text">
                  <strong>{{ t('safety.scam_type', 'Type') }}:</strong> {{ scam.categoryLevel3 || t('safety.no_description', 'No description available') }}
                </p>
              </div>

              <!-- Additional scam information -->
              <div class="scam-info">
                <div class="info-row" v-if="scam.addressState">
                  <span class="info-label">📍 {{ t('safety.location', 'Location') }}:</span>
                  <span class="info-value">{{ scam.addressState }}</span>
                </div>
                <div class="info-row" v-if="scam.scamContactMode">
                  <span class="info-label">📞 {{ t('safety.contact_method', 'Contact Method') }}:</span>
                  <span class="info-value">{{ scam.scamContactMode }}</span>
                </div>
                <div class="info-row" v-if="scam.complainantAge">
                  <span class="info-label">👤 {{ t('safety.victim_age', 'Victim Age') }}:</span>
                  <span class="info-value">{{ scam.complainantAge }}</span>
                </div>
                <div class="info-row" v-if="scam.formattedDate">
                  <span class="info-label">📅 {{ t('safety.reported_month', 'Reported') }}:</span>
                  <span class="info-value">{{ scam.formattedDate }}</span>
                </div>
              </div>
            </div>

            <!-- Statistics section -->
            <div class="scam-stats">
              <div class="stat-item" v-if="scam.numberOfReports">
                <span class="stat-label">{{ t('safety.reports', 'Reports') }}:</span>
                <span class="stat-value danger">{{ scam.numberOfReports }}</span>
              </div>
              <div class="stat-item" v-if="scam.formattedAmount">
                <span class="stat-label">{{ t('safety.amount_lost', 'Amount Lost') }}:</span>
                <span class="stat-value danger">{{ scam.formattedAmount }}</span>
              </div>
            </div>

          </div>

          <!-- 分页控件 -->
          <div class="pagination" v-if="pagination.totalPages > 1">
            <button
              @click="changePage(pagination.currentPage - 1)"
              :disabled="!pagination.hasPrevious"
              class="pagination-btn"
              :class="{ disabled: !pagination.hasPrevious }"
            >
              ← {{ t('safety.previous', 'Previous') }}
            </button>

            <div class="pagination-info">
              <span class="page-numbers">
                {{ pagination.currentPage }} / {{ pagination.totalPages }}
              </span>
              <span class="total-records">
                {{ t('safety.total_records', 'Total') }}: {{ pagination.total }}
              </span>
            </div>

            <button
              @click="changePage(pagination.currentPage + 1)"
              :disabled="!pagination.hasNext"
              class="pagination-btn"
              :class="{ disabled: !pagination.hasNext }"
            >
              {{ t('safety.next', 'Next') }} →
            </button>
            </div>
          </div>

        <!-- 无数据状态 -->
        <div v-else class="no-data-state">
          <div class="no-data-icon">📄</div>
          <p class="no-data-text">{{ t('safety.no_scam_reports', 'No scam reports available') }}</p>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import scamReportService from '@/services/scamReportService.js'

const { t } = useI18n()

// 响应式数据
const scamData = ref([])
const loading = ref(false)
const error = ref(null)

// 分页相关数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
})

// Computed property: Format scam data with localization and icons
const formattedScamData = computed(() => {
  return scamData.value.map((scam, index) => {
    // Assign icons and priority based on scam type
    let icon = '⚠️'
    let priority = 'medium'
 
    if (scam.categoryLevel2) {
      const category = scam.categoryLevel2.toLowerCase()
      if (category.includes('romance') || category.includes('dating') || category.includes('relationship')) {
        icon = '💔'
        priority = 'high'
      } else if (category.includes('government') || category.includes('authority') || category.includes('police') || category.includes('tax')) {
        icon = '👮'
        priority = 'high'
      } else if (category.includes('investment') || category.includes('financial') || category.includes('trading') || category.includes('crypto')) {
        icon = '💰'
        priority = 'high'
      } else if (category.includes('phishing') || category.includes('email') || category.includes('personal information')) {
        icon = '📧'
        priority = 'high'
      } else if (category.includes('phone') || category.includes('call') || category.includes('mobile')) {
        icon = '📞'
        priority = 'medium'
      } else if (category.includes('online') || category.includes('internet') || category.includes('website')) {
        icon = '💻'
        priority = 'medium'
      }
    }

    return {
      ...scam,
      icon,
      priority,
      // Format amount for display (remove extra spaces and ensure proper formatting)
      formattedAmount: scam.amountLost ? scam.amountLost.trim() : null,
      // Format date for display
      formattedDate: scam.startOfMonth ? new Date(scam.startOfMonth).toLocaleDateString('en-AU', { 
        year: 'numeric', 
        month: 'short' 
      }) : null
    }
  })
})

// Fetch scam reports data from API
const fetchScamReports = async (page = 1) => {
  loading.value = true
  error.value = null
 
  try {
    const response = await scamReportService.getScamReports({
      page,
      size: pagination.value.pageSize
    })
 
    if (response.success) {
      scamData.value = response.data
      pagination.value = {
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious
      }
    } else {
      throw new Error(response.message || 'Failed to fetch data')
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch scam reports. Please try again later.'
    console.error('Failed to fetch scam reports:', err)
  } finally {
    loading.value = false
  }
}

// Change page for pagination
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchScamReports(page)
  }
}

// Retry loading data
const retryLoad = () => {
  fetchScamReports(pagination.value.currentPage)
}

// Fetch data when component is mounted
onMounted(() => {
  fetchScamReports()
})

// Protection guidelines (can be used in future features)
const protectionTips = ref([
  {
    id: 1,
    icon: '🔒',
    title: t('safety.protect_personal_info', 'Protect Personal Information'),
    description: t('safety.protect_personal_desc', 'Never share personal details like passwords, bank account numbers, or Medicare numbers with strangers.')
  },
  {
    id: 2,
    icon: '⏰',
    title: t('safety.take_time', 'Take Your Time'),
    description: t('safety.take_time_desc', 'Scammers create urgency. Always take time to think and consult with trusted family or friends.')
  },
  {
    id: 3,
    icon: '🔍',
    title: t('safety.verify_identity', 'Verify Identity'),
    description: t('safety.verify_identity_desc', 'Always verify the identity of callers by hanging up and calling official numbers independently.')
  },
  {
    id: 4,
    icon: '💳',
    title: t('safety.secure_payments', 'Secure Payment Methods'),
    description: t('safety.secure_payments_desc', 'Use secure payment methods and avoid wire transfers, gift cards, or cryptocurrency for unknown parties.')
  }
])


</script>

<style scoped>
.scam-alerts {
  height: 600px;
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
  max-height: calc(600px - 90px); /* 减去header高度 */
  scrollbar-width: thin;
  scrollbar-color: #6f42c1 #f1f1f1;
}

/* Webkit scrollbar styles */
.module-content::-webkit-scrollbar {
  width: 6px;
}

.module-content::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 10px;
}

.module-content::-webkit-scrollbar-thumb {
  background: #ba68c8;
  border-radius: 10px;
}

.module-content::-webkit-scrollbar-thumb:hover {
  background: #8e24aa;
}

/* Warning banner */
.warning-banner {
  display: flex;
  align-items: center;
  background: #fce4ec;
  border: 1px solid #f1bee7;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.1);
}

.warning-icon {
  font-size: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.warning-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #6a1b9a;
}

.warning-text {
  margin: 0 0 1.5rem 0;
  color: #6a1b9a;
  line-height: 1.4;
}

/* Prevention tips in banner */
.banner-prevention-tips {
  margin-top: 1rem;
}

.banner-tips-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #6a1b9a;
}

.banner-tips-list {
  margin: 0;
  padding-left: 1.2rem;
}

.banner-tip-item {
  margin-bottom: 0.5rem;
  color: #6a1b9a;
  line-height: 1.4;
  font-size: 0.9rem;
}

.banner-tip-item:last-child {
  margin-bottom: 0;
}

/* 最新警报 */
.latest-alerts {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scam-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 3px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.scam-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.15);
}

.scam-card.high {
  border-left-color: #8e24aa;
}

.scam-card.medium {
  border-left-color: #ba68c8;
}

.scam-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.scam-rank {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.scam-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.scam-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

/* Scam details section */
.scam-details {
  margin-bottom: 1rem;
}

.scam-description {
  margin-bottom: 1rem;
}

.scam-text {
  color: #555;
  line-height: 1.5;
  margin: 0;
}

/* Scam information section */
.scam-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #495057;
  flex-shrink: 0;
  min-width: 140px;
}

.info-value {
  color: #6c757d;
  text-align: right;
  font-weight: 500;
}

.scam-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
}

.stat-value.danger {
  color: #dc3545;
}


/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6f42c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* 错误状态样式 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: #fff5f5;
  border: 2px solid #fed7d7;
  border-radius: 12px;
  margin: 1rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-text {
  color: #e53e3e;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
}

.retry-button {
  background: #8e24aa;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.3);
}

.retry-button:hover {
  background: #6a1b9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.4);
}

/* 无数据状态样式 */
.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  margin: 1rem 0;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.no-data-text {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.pagination-btn {
  background: #8e24aa;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.3);
}

.pagination-btn:hover:not(.disabled) {
  background: #6a1b9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.4);
}

.pagination-btn.disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.page-numbers {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.total-records {
  font-size: 0.85rem;
  color: #666;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .scam-alerts {
    height: 500px;
  }
  
  .module-content {
    max-height: calc(500px - 80px);
    padding: 1rem;
  }

  .warning-banner {
    flex-direction: column;
    text-align: center;
  }

  .warning-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .banner-tips-title {
    font-size: 0.9rem;
  }

  .banner-tip-item {
    font-size: 0.85rem;
  }

  .scam-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-btn {
    min-width: auto;
    width: 100%;
  }

  .pagination-info {
    order: -1;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-label {
    min-width: auto;
  }

  .info-value {
    text-align: left;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .scam-alerts {
    height: 450px;
  }
  
  .module-content {
    max-height: calc(450px - 70px);
    padding: 0.8rem;
  }
  
  .module-header {
    padding: 1rem;
  }

  .banner-tips-title {
    font-size: 0.85rem;
  }

  .banner-tip-item {
    font-size: 0.8rem;
  }

  .pagination {
    padding: 0.8rem;
  }

  .pagination-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .loading-state,
  .error-state,
  .no-data-state {
    padding: 2rem 0.8rem;
  }

  .scam-info {
    padding: 0.8rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-label {
    min-width: auto;
    font-size: 0.85rem;
  }

  .info-value {
    text-align: left;
    font-size: 0.85rem;
  }
}
</style>


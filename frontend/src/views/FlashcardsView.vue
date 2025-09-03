<template>
  <div class="flashcards-page">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <button class="back-btn" @click="goBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style="height: 16px; width: 16px"
          >
            <path
              d="M19 12a1 1 0 0 1-1 1H8.414l1.293 1.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L8.414 11H18a1 1 0 0 1 1 1z"
            />
          </svg>
          Back to Categories
        </button>
        <div class="header-content">
          <h1>{{ categoryName }}</h1>
          <p class="language-info">Learning in: {{ getLanguageName(language) }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading flashcards...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-section">
        <h2>⚠️ Error Loading Flashcards</h2>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadPhrases">Try Again</button>
      </div>

      <!-- Main Flashcard Interface -->
      <div v-else-if="currentPhrase" class="flashcard-section">
        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-info">
            <span>{{ currentPosition }} / {{ totalPhrases }}</span>
            <span>{{ progress }}% viewed</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>

        <!-- Flashcard Component -->
        <Flashcard
          :phrase="currentPhrase"
          :native-language="language"
          @flip="onCardFlip"
          @audio-start="onAudioStart"
          @audio-end="onAudioEnd"
        />
        <!-- Navigation Controls -->
        <div class="controls-section">
          <div class="nav-controls">
            <button class="control-btn" :disabled="!hasPrevious" @click="previousCard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="height: 16px; width: 16px"
              >
                <path
                  d="M19 12a1 1 0 0 1-1 1H8.414l1.293 1.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L8.414 11H18a1 1 0 0 1 1 1z"
                  data-name="Left"
                />
              </svg>
              Previous
            </button>

            <div class="middle-controls">
              <button
                class="control-btn shuffle-btn"
                @click="toggleShuffle"
                :class="{ active: isShuffled }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style="height: 16px; width: 16px"
                >
                  <path
                    d="M14 20v-2h2.6l-3.2-3.2 1.4-1.4L18 16.6V14h2v6h-6zM10 4V2H4v6h2V5.4l3.2 3.2 1.4-1.4L7.4 4H10zm4 0h2.6l-3.2 3.2 1.4 1.4L18 5.4V8h2V2h-6v2zM6 20v-2H3.4l3.2-3.2-1.4-1.4L2 16.6V14H0v6h6z"
                  />
                </svg>
                {{ isShuffled ? 'Shuffled' : 'Order' }}
              </button>
              <button class="control-btn" @click="restart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style="height: 16px; width: 16px"
                >
                  <path
                    d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                  />
                </svg>
                Restart
              </button>
            </div>

            <button class="control-btn" :disabled="!hasNext" @click="nextCard">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="height: 16px; width: 16px"
              >
                <path
                  d="m18.707 12.707-3 3a1 1 0 0 1-1.414-1.414L15.586 13H6a1 1 0 0 1 0-2h9.586l-1.293-1.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414z"
                  data-name="Right"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-value">{{ viewedPhrases.size }}</span>
            <span class="stat-label">Viewed</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalPhrases - viewedPhrases.size }}</span>
            <span class="stat-label">Remaining</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ Math.round(progress) }}%</span>
            <span class="stat-label">Progress</span>
          </div>
        </div>
      </div>

      <!-- No Phrases State -->
      <div v-else class="empty-section">
        <h2>📚 No Phrases Available</h2>
        <p>No phrases found for this category and language combination.</p>
        <button class="btn btn-primary" @click="goBack">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashcard } from '@/composables/useFlashcard.js'
import Flashcard from '@/components/language/Flashcard.vue'

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
})

const router = useRouter()

// Use the flashcard composable
const {
  phrases,
  currentPhrase,
  isLoading,
  error,
  isShuffled,
  viewedPhrases,
  progress,
  hasNext,
  hasPrevious,
  totalPhrases,
  currentPosition,
  nextCard,
  previousCard,
  shuffle,
  resetOrder,
  restart,
  loadPhrases,
} = useFlashcard(props.category, props.language)

// Computed properties
const categoryName = computed(() => {
  const categoryMap = {
    greetings: 'Basic Greetings & Communication',
    emergency: 'Emergency & Medical',
    shopping: 'Shopping & Daily Needs',
    activities: 'Activities & Hobbies',
  }
  return categoryMap[props.category] || props.category
})

const getLanguageName = computed(() => {
  const languageMap = {
    en: 'English',
    zh: '中文',
    vi: 'Tiếng Việt',
    id: 'Bahasa Indonesia',
  }
  return (langCode) => languageMap[langCode] || langCode
})

// Methods
const goBack = () => {
  router.push('/learnenglish')
}

const toggleShuffle = () => {
  if (isShuffled.value) {
    resetOrder()
  } else {
    shuffle()
  }
}

const onCardFlip = (isFlipped) => {
  // Could track flip events for analytics
  console.log('Card flipped:', isFlipped)
}

const onAudioStart = () => {
  // Could show audio indicator
  console.log('Audio started')
}

const onAudioEnd = () => {
  // Could hide audio indicator
  console.log('Audio ended')
}
</script>

<style scoped>
/* Quizlet-style Flashcards View */
.flashcards-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  flex: 1;
}

.header-content h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: #1e293b;
}

.language-info {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

/* Loading Section */
.loading-section {
  text-align: center;
  color: #64748b;
  padding: 4rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error Section */
.error-section {
  text-align: center;
  color: #ef4444;
  padding: 4rem 0;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
  margin: 2rem 0;
}

.error-section h2 {
  margin: 0 0 1rem 0;
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Progress Section */
.progress-section {
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #475569;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.25s ease-out;
}

/* Flashcard Section */
.flashcard-section {
  max-width: 600px;
  margin: 0 auto;
}

/* Controls Section */
.controls-section {
  margin: 2rem 0;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.nav-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.middle-controls {
  display: flex;
  gap: 0.75rem;
}

.control-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.control-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: #f8fafc;
  color: #94a3b8;
}

.shuffle-btn.active {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
}

/* Stats Section */
.stats-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.stat-item {
  text-align: center;
  color: #475569;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin: 0;
}

/* Empty Section */
.empty-section {
  text-align: center;
  color: #64748b;
  padding: 4rem 0;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.empty-section h2 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.btn-primary {
  background: #3b82f6;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .nav-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .middle-controls {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 0.75rem;
  }

  .control-btn {
    flex: 1;
    min-width: auto;
  }

  .stats-section {
    gap: 1rem;
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0.5rem;
  }

  .progress-info {
    font-size: 0.8125rem;
  }

  .control-btn {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }

  .middle-controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stats-section {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  .stat-value {
    font-size: 1.25rem;
    margin-bottom: 0;
  }
}

/* Focus states for accessibility */
.back-btn:focus,
.control-btn:focus,
.btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .header-section {
    border-bottom-color: #000;
  }

  .progress-section,
  .controls-section,
  .stats-section,
  .empty-section {
    border-color: #000;
  }

  .control-btn {
    border-color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .back-btn,
  .control-btn,
  .btn,
  .progress-fill,
  .loading-spinner {
    transition: none;
    animation: none;
  }
}
</style>

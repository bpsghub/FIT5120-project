<template>
  <div class="learn-english-page">    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Back Button -->
        <div class="header-controls">
          <Button class="back-button" :hover="true" bg-color="white" :href="'/'">Back</Button>
        </div>

        <div class="hero-content">
          <h1>Learn English</h1>
          <p class="subtitle">Practice English phrases for everyday situations</p>
        </div>
      </div>
      
      <!-- Language Selection -->
      <div class="language-selection-wrapper">
        <div class="language-selection">
          <label for="native-language">Select your native language:</label>
          <select id="native-language" v-model="selectedLanguage" class="language-select">
            <option value="">Choose your language</option>
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- Learning Categories -->
    <div class="categories-section" v-if="selectedLanguage">
      <div class="container">
        <div class="section-header">
          <h2>Choose a Category</h2>
          <p>Select a topic to start learning English phrases</p>
        </div>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="selectCategory(category)"
            tabindex="0"
            @keydown.enter="selectCategory(category)"
            @keydown.space="selectCategory(category)"
          >
            <div class="category-icon" :style="{ backgroundColor: category.color }">
              {{ category.icon }}
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <div class="category-stats">{{ getCategoryPhraseCount(category.id) }} phrases</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome Message if no language selected -->
    <div class="welcome-section" v-else>
      <div class="container">
        <div class="welcome-content">
          <h2>Welcome to English Learning!</h2>
          <p>Please select your native language above to start learning English phrases.</p>
          <div class="features-list">
            <div class="feature">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style="height: 24px; width: 24px; fill: #3b82f6"
                >
                  <path
                    d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z"
                  />
                </svg>
              </div>
              <span>Audio pronunciation</span>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style="height: 24px; width: 24px; fill: #3b82f6"
                >
                  <path
                    d="M21 16V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1zM5 5h14v10H5V5z"
                  />
                </svg>
              </div>
              <span>Interactive flashcards</span>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style="height: 24px; width: 24px; fill: #3b82f6"
                >
                  <path
                    d="M17 2v2c3.39 0 6 2.61 6 6s-2.61 6-6 6-6-2.61-6-6V8h2c1.1 0 2-.9 2-2s-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V8c0-4.42-3.58-8-8-8z"
                  />
                </svg>
              </div>
              <span>Mobile-friendly design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TranslationService } from '@/data/translation.js'
import Button from '@/components/Button.vue'

const router = useRouter()

// Reactive data
const selectedLanguage = ref('')
const categories = ref([])
const availableLanguages = ref([])

// Computed properties
const getCategoryPhraseCount = computed(() => {
  return (categoryId) => {
    const category = categories.value.find((cat) => cat.id === categoryId)
    return category ? category.phrases.length : 0
  }
})

// Methods
const selectCategory = (category) => {
  // Navigate to flashcard page with category and language
  router.push({
    name: 'flashcards',
    params: {
      category: category.id,
      language: selectedLanguage.value,
    },
  })
}

// Lifecycle
onMounted(async () => {
  try {
    // Initialize translation data from CSV
    await TranslationService.initialize()

    // Load available languages and categories
    availableLanguages.value = TranslationService.getSupportedLanguages()
    categories.value = TranslationService.getCategories()
  } catch (error) {
    console.error('Error loading translation data:', error)
    // Load basic data even if CSV fails
    availableLanguages.value = TranslationService.getSupportedLanguages()
    categories.value = TranslationService.getCategories()
  }
})
</script>

<style scoped>
/* Quizlet-style Learn English Page */
.learn-english-page {
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
  padding: 0 1rem;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0 2rem;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 18, 92, 0.8);
  z-index: 1;
}

.header-container {
  position: relative;
  z-index: 2;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-controls {
  margin-bottom: 3rem;
}

.back-button {
  display: inline-block;
}

.hero-content {
  text-align: center;
  padding: 2rem 0;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.375rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Language Selection Wrapper */
.language-selection-wrapper {
  position: relative;
  z-index: 2;
  padding: 0 1rem 2rem;
}

/* Language Selection */
.language-selection {
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-20px);
}

.language-selection label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  text-align: center;
}

.language-select {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.0625rem;
  background: #ffffff;
  color: #374151;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 56px;
  font-weight: 500;
}

.language-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.language-select:hover {
  border-color: #9ca3af;
}

/* Categories Section */
.categories-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.category-card:active {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 2rem;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 1;
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.category-card p {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

.category-stats {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
  font-size: 0.9375rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

/* Welcome Section */
.welcome-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.welcome-content {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 4rem;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.welcome-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome-content h2 {
  font-size: 2.75rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-content p {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  color: #64748b;
  line-height: 1.7;
  font-weight: 400;
}

.features-list {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .header-section {
    padding: 3rem 0 1.5rem;
  }

  .header-container {
    padding: 0 1rem;
  }

  .header-controls {
    margin-bottom: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.125rem;
  }

  .language-selection-wrapper {
    padding: 0 1rem 1.5rem;
  }

  .language-selection {
    padding: 2rem;
    transform: translateY(-10px);
  }

  .categories-section {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .section-header p {
    font-size: 1.125rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .category-card {
    padding: 2rem;
  }

  .category-icon {
    width: 70px;
    height: 70px;
    font-size: 1.75rem;
  }

  .features-list {
    gap: 2.5rem;
  }

  .welcome-content {
    margin: 0 1rem;
    padding: 3rem;
  }
  .welcome-content h2 {
    font-size: 2.25rem;
  }
}

@media (max-width: 576px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .language-selection-wrapper {
    padding: 0 0.75rem 1rem;
  }

  .language-selection {
    padding: 1.5rem;
  }

  .categories-grid {
    padding: 0 0.75rem;
  }

  .category-card {
    padding: 1.5rem;
  }

  .category-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .category-card h3 {
    font-size: 1.25rem;
  }

  .features-list {
    flex-direction: column;
    gap: 2rem;
  }

  .welcome-content {
    margin: 0 0.75rem;
    padding: 2rem;
  }

  .welcome-content h2 {
    font-size: 1.875rem;
  }

  .welcome-content p {
    font-size: 1.125rem;
  }
}

/* Focus states for accessibility */
.category-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .header-section {
    border-bottom-color: #000;
  }

  .language-selection,
  .category-card,
  .welcome-content {
    border-color: #000;
  }

  .language-select {
    border-color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .category-card,
  .language-select {
    transition: none;
  }
}

/* Loading state for categories */
.categories-grid.loading .category-card {
  opacity: 0.6;
  pointer-events: none;
}

/* Empty state */
.categories-grid:empty::after {
  content: 'Loading categories...';
  display: block;
  text-align: center;
  color: #64748b;
  font-style: italic;
  grid-column: 1 / -1;
  padding: 2rem;
}
</style>

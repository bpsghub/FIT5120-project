<template>
  <div class="learn-english-container">
    <header class="page-header">
      <h1>Speaking Up: English for Everyday Life</h1>
      <p class="subtitle">Learn essential English phrases for daily situations</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading phrases...</p>
    </div>

    <div v-if="hasError" class="error-state">
      <p>⚠️ Failed to load phrases. Please try again later.</p>
      <button @click="fetchCards()">Retry</button>
    </div>

    <div v-else>
      <div class="controls-section">
        <div class="category-selector">
          <label>Choose Category:</label>
          <div class="category-buttons">
            <button
              @click="currentCategory = 'greetings'"
              :class="{ active: currentCategory === 'greetings' }"
            >
              Basic Greetings
            </button>
            <button
              @click="currentCategory = 'emergency'"
              :class="{ active: currentCategory === 'emergency' }"
            >
              Emergency Phrases
            </button>
            <button
              @click="currentCategory = 'shopping'"
              :class="{ active: currentCategory === 'shopping' }"
            >
              Shopping Vocabularies
            </button>
          </div>
        </div>


        <div class="language-selector">
          <label>Translation Language:</label>
          <div class="language-buttons">
            <button
              @click="currentLanguage = 'chinese'"
              :class="{ active: currentLanguage === 'chinese' }"
              class="language-btn"
            >
              🇨🇳 Chinese
            </button>
            <button
              @click="currentLanguage = 'vietnamese'"
              :class="{ active: currentLanguage === 'vietnamese' }"
              class="language-btn"
            >
              🇻🇳 Vietnamese
            </button>
            <button
              @click="currentLanguage = 'indonesian'"
              :class="{ active: currentLanguage === 'indonesian' }"
              class="language-btn"
            >
              🇮🇩 Indonesian
            </button>
          </div>
        </div>
      </div>

      <!-- 学习卡片区域 -->
      <div class="cards-section">
        <div class="cards-container">
          <div
            v-for="card in filteredCards"
            :key="card.key"
            class="phrase-card"
          >
            <div class="english-phrase">
              <h3>{{ card.translations?.en }}</h3>
            </div>

            <!-- 翻译内容 -->
            <div class="translation">
              <p>{{ getTranslation(card) }}</p>
            </div>

            <!-- 发音按钮 -->
            <button
              class="speaker-btn"
              @click="playPronunciation(card.translations?.en || '')"
              aria-label="Play pronunciation"
            >
              🔊
            </button>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div v-if="filteredCards.length === 0" class="empty-state">
          <p>No phrases available for this category.</p>
        </div>
      </div>

      <!-- 学习进度区域 -->
      <div class="progress-section">
        <div class="progress-info">
          <span>Current: {{ currentCategoryText }}</span>
          <span>Phrases: {{ filteredCards.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { englishService } from '@/services/englishService'; // 导入服务


const currentCategory = ref('greetings');
const currentLanguage = ref('chinese');
const cards = ref([]);


const isLoading = ref(true);
const hasError = ref(false);

onMounted(() => {
  fetchCards();
});


const fetchCards = async () => {
  try {

    isLoading.value = true;
    hasError.value = false;

    const response = await englishService.getPhrases();

    if (response && response.data) {
      cards.value = response.data;
    } else {
      cards.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch phrases:', error);
    hasError.value = true;
    cards.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filteredCards = computed(() => {
  if (!cards.value) return [];
  return cards.value.filter(card => card.category === currentCategory.value);
});

const currentCategoryText = computed(() => {
  switch(currentCategory.value) {
    case 'greetings': return 'Basic Greetings';
    case 'emergency': return 'Emergency Phrases';
    case 'shopping': return 'Shopping Vocabularies';
    default: return '';
  }
});


const getTranslation = (card) => {

  if (!card.translations) return 'No translation available';

  switch(currentLanguage.value) {
    case 'chinese':
      return card.translations.zh || 'No translation available'; // translations.zh
    case 'vietnamese':
      return card.translations.vi || 'No translation available'; // translations.vi
    case 'indonesian':
      return card.translations.id || 'No translation available'; // translations.id
    default:
      return card.translations.zh || 'No translation available';
  }
};


const playPronunciation = (text) => {

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};
</script>

<style scoped>
.learn-english-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #4a90e2;
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.error-state button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-state button:hover {
  background-color: #3a7bc8;
}


.controls-section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-selector, .language-selector {
  margin-bottom: 20px;
}

.category-selector:last-child, .language-selector:last-child {
  margin-bottom: 0;
}

.controls-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #444;
  font-size: 1.05rem;
}

.category-buttons, .language-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-buttons button, .language-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #e9ecef;
  color: #495057;
}

.category-buttons button.active, .language-buttons button.active {
  background-color: #4a90e2;
  color: white;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

.category-buttons button:hover:not(.active),
.language-buttons button:hover:not(.active) {
  background-color: #d0d7dc;
  transform: translateY(-2px);
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 卡片区域样式 */
.cards-section {
  margin-bottom: 30px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.phrase-card {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.phrase-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.english-phrase h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.translation p {
  color: #4a90e2;
  font-size: 1.2rem;
  margin: 0;
  padding: 10px 0;
}

.speaker-btn {
  background: #4a90e2;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.speaker-btn:hover {
  background: #3a7bc8;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #666;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 进度区域样式 */
.progress-section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }

  .category-buttons, .language-buttons {
    flex-direction: column;
  }

  .category-buttons button, .language-buttons button {
    width: 100%;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }
}
</style>

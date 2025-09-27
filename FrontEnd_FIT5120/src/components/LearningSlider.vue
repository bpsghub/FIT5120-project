<template>
  <div class="learning-slider-container justify-content-center container">
    <div class="slider-content">
      <div class="display-toggle">
        <button :class="{ active: displayMode === 'grid' }" @click="displayMode = 'grid'">{{ gridBtnText }}</button>
        <button :class="{ active: displayMode === 'column' }" @click="displayMode = 'column'">{{ columnBtnText
        }}</button>
      </div>
      <div :class="['cards-wrapper', displayMode]">
        <div class="row w-100 m-0">
          <div v-for="(card, idx) in translatedCards" :key="card.key"
            :class="displayMode === 'grid' ? 'col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4 ' : 'col-12 d-flex justify-content-center mb-4 '">
            <div :class="['slide-card-with-image', 'w-100', displayMode]" data-aos="fade-up"
              :data-aos-delay="Math.min(idx * 50, 150)">
              <template v-if="displayMode === 'grid'">
                <div class="slide-image w-100 mb-3">
                  <img :src="getRandomImage(idx)" alt="Slide Image" />
                </div>
                <div class="slide-card text-center">
                  <h2 class="slide-title">{{ card.translatedTitle }}</h2>
                  <p class="slide-desc">{{ card.translatedDesc }}</p>
                </div>
              </template>
              <template v-else>
                <div class="slide-card d-flex flex-column justify-content-center align-items-start flex-grow-1">
                  <h2 class="slide-title">{{ card.translatedTitle }}</h2>
                  <p class="slide-desc">{{ card.translatedDesc }}</p>
                </div>
                <div class="slide-image ms-4 d-flex align-items-center">
                  <img :src="getRandomImage(idx)" alt="Slide Image" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="quiz-btn-bottom-wrapper">
      <button class="quiz-btn" @click="takeQuiz">
        {{ quizBtnText }}
      </button>
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted, watch, nextTick } from 'vue'
import AOS from 'aos'
import Papa from 'papaparse'
import { translateBatch } from '@/services/translationService.js'
import { useRouter } from 'vue-router'

const router = useRouter()

function takeQuiz() {
  alert('Quiz coming soon!');
  router.push("/quiztaking")
}

const props = defineProps({
  csvUrl: { type: String, required: true },
  imageSeedPrefix: { type: String, default: 'slide' },
  lang: { type: String, default: 'en' },
})

const originalCards = ref([])
const translatedCards = ref([])
const displayMode = ref('grid')
const quizBtnText = ref('Take Quiz')
const gridBtnText = ref('Grid')
const columnBtnText = ref('Column')

function getRandomImage(idx) {
  return `https://picsum.photos/seed/${props.imageSeedPrefix}${idx + 1}/180/180`
}

function buildTranslationTexts(cards) {
  const texts = []
  // Add button labels first so order is fixed
  texts.push('Grid')
  texts.push('Column')
  texts.push('Take Quiz')

  for (const card of cards) {
    texts.push(card.title)
    texts.push(card.en)
  }
  return texts
}

function mapTranslationsToCards(cards, translations) {
  // translations: [grid, column, ...card titles/descs..., take quiz]
  const newCards = []
  for (let i = 0; i < cards.length; i++) {
    // offset by 2 for grid/column
    newCards.push({
      ...cards[i],
      translatedTitle: translations[3 + i * 2],
      translatedDesc: translations[3 + i * 2 + 1],
    })
  }
  return newCards
}

async function translateAll() {
  // If English, no need to translate, just set original texts
  if (props.lang === 'en') {
    setEnglishTexts()
    return
  }

  // Build array of texts to translate
  const texts = buildTranslationTexts(originalCards.value)
  try {
    const translations = await translateBatch(texts, props.lang, 'en')
    // Assign translated values to buttons and cards
    gridBtnText.value = translations[0]
    columnBtnText.value = translations[1]
    quizBtnText.value = translations[2]
    translatedCards.value = mapTranslationsToCards(originalCards.value, translations)
  } catch {
    // If error, fallback to English
    setEnglishTexts()
  }
}

// If language is English, just set original texts
function setEnglishTexts() {
  translatedCards.value = originalCards.value.map(card => ({
    ...card,
    translatedTitle: card.title,
    translatedDesc: card.en,
  }))
  quizBtnText.value = 'Take Quiz'
  gridBtnText.value = 'Grid'
  columnBtnText.value = 'Column'
}

async function loadOriginalCards() {
  const res = await fetch(props.csvUrl)
  const csv = await res.text()
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true })
  originalCards.value = parsed.data
  await translateAll()
}

onMounted(loadOriginalCards)
watch(() => props.lang, () => { translateAll() }, AOS.refresh())

// Watch displayMode to refresh AOS after DOM updates
watch(displayMode, async () => {
  await nextTick()
  AOS.refresh()
})
// Ensure AOS is initialized on mount
onMounted(() => {
  AOS.init()
})

</script>

<style scoped>
.learning-slider-container {
  min-height: 80vh;
  background: #74238b00;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
}

.display-toggle {
  display: flex;
  gap: 12px;
  margin: 24px 0 24px 0;
  justify-content: center;
}

.display-toggle button {
  background: #e9e4ff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #661aff;
  cursor: pointer;
  transition: background 0.2s;
}

.display-toggle button.active {
  background: #661aff;
  color: #fff;
}

.cards-wrapper {
  width: 100%;
}

.slider-content {
  width: 100%;
  min-height: 250px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
  padding-bottom: 24px;
}

.slide-card-with-image {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(102, 26, 255, 0.10);
  padding: 32px 36px;
  gap: 32px;
  width: 100%;
  margin: 0;
  transition: box-shadow 0.25s, transform 0.22s, border 0.18s;
  border: 2.5px solid transparent;
  z-index: 1;
  box-sizing: border-box;
}

.slide-card-with-image.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.slide-card-with-image.column {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.slide-card-with-image:hover {
  box-shadow: 0 12px 36px 0 rgba(102, 26, 255, 0.22), 0 2px 16px 0 rgba(102, 26, 255, 0.10);
  transform: translateY(-15px) !important;
  border: 2.5px solid #a259e6;
  z-index: 2;
}

.slide-card {
  background: transparent;
  border-radius: 12px;
  box-shadow: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.slide-title {
  color: #661aff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  text-align: start;
}

.slide-desc {
  color: #222;
  font-size: 1.08rem;
  margin-bottom: 8px;
  text-align: start;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  background: #fff;
  border: none;
  transition: transform 0.5s;
  display: block;
}

.quiz-btn-bottom-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 16px;
}

.quiz-btn {
  background: #661aff;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  padding: 16px 40px;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.1);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  outline: none;
  margin: 0 auto;
  display: block;
}

.quiz-btn:hover,
.quiz-btn:focus {
  background: #a259e6;
  transform: scale(1.04);
}

@media (max-width: 900px) {
  .slider-content {
    font-size: 1.1rem;
    margin: 16px auto 0 auto;
    padding-bottom: 8px;
  }

  .slide-card-with-image {
    padding: 16px 10px;
    gap: 12px;
    margin: 0;
  }

  .slide-card-with-image.grid,
  .slide-card-with-image.column {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
  }

  .slide-card {
    font-size: 1rem;
    align-items: center;
  }

  .slide-image img {
    width: 120px;
    height: 120px;
    border-radius: 10px;
  }
}

@media (max-width: 600px) {
  .slider-content {
    font-size: 0.95rem;
  }

  .slide-card {
    padding: 8px 4px;
    font-size: 0.9rem;
  }

  .slide-title {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .slide-desc {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .slide-image img {
    width: 80px;
    height: 80px;
    border-radius: 7px;
  }
}
</style>

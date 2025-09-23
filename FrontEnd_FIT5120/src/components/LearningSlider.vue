<template>
  <div class="learning-slider-container justify-content-center container">
    <div class="slider-content">
      <slot name="lang-switcher">
        <LanguageSwitcher v-model="langProxy" class="lang-switcher" />
      </slot>
      <div class="display-toggle">
        <button :class="{ active: displayMode === 'grid' }" @click="displayMode = 'grid'">Grid</button>
        <button :class="{ active: displayMode === 'column' }" @click="displayMode = 'column'">Column</button>
      </div>
      <div :class="['cards-wrapper', displayMode]">
        <div class="row w-100 m-0">
          <div v-for="(card, idx) in cards" :key="card.key"
            :class="displayMode === 'grid' ? 'col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4' : 'col-12 d-flex justify-content-center mb-4'">
            <div :class="['slide-card-with-image', 'w-100', displayMode]">
              <template v-if="displayMode === 'grid'">
                <div class="slide-image mb-3">
                  <img :src="getRandomImage(idx)" alt="Slide Image" />
                </div>
                <div class="slide-card text-center">
                  <h2 class="slide-title">{{ getTitle(card) }}</h2>
                  <p class="slide-desc">{{ card[langProxy] }}</p>
                </div>
              </template>
              <template v-else>
                <div class="slide-card d-flex flex-column justify-content-center align-items-start flex-grow-1">
                  <h2 class="slide-title">{{ getTitle(card) }}</h2>
                  <p class="slide-desc">{{ card[langProxy] }}</p>
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
      <button class="quiz-btn" @click="$emit('take-quiz')">
        {{ quizBtnText }}
      </button>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const props = defineProps({
  csvUrl: { type: String, required: true },
  imageSeedPrefix: { type: String, default: 'slide' },
  lang: { type: String, default: 'en' },
})
const emit = defineEmits(['update:lang', 'take-quiz'])

// Proxy for v-model:lang
const langProxy = computed({
  get: () => props.lang,
  set: (val) => emit('update:lang', val)
})

const quizBtnText = computed(() => {
  switch (langProxy.value) {
    case 'en': return 'Take Quiz'
    case 'cn': return '参加测验'
    case 'vn': return 'Làm bài kiểm tra'
    case 'id': return 'Ikuti Kuis'
    default: return 'Take Quiz'
  }
})

const cards = ref([])
const displayMode = ref('grid')

function getRandomImage(idx) {
  return `https://picsum.photos/seed/${props.imageSeedPrefix}${idx + 1}/180/180`
}

onMounted(async () => {
  const res = await fetch(props.csvUrl)
  const csv = await res.text()
  const lines = csv.split(/\r?\n/).filter(Boolean)
  const headers = lines[0].split(',')
  cards.value = lines.slice(1).map(line => {
    const values = []
    let inQuotes = false, cur = ''
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') inQuotes = !inQuotes
      else if (char === ',' && !inQuotes) { values.push(cur); cur = '' }
      else cur += char
    }
    values.push(cur)
    const obj = {}
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').replace(/^"|"$/g, '') })
    return obj
  })
})

function getTitle(card) {
  switch (langProxy.value) {
    case 'en': return card.title_en || card.en || card.key || ''
    case 'cn': return card.title_cn || card.cn || card.key || ''
    case 'vn': return card.title_vn || card.vn || card.key || ''
    case 'id': return card.title_id || card.id || card.key || ''
    default: return card.key || ''
  }
}

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

.lang-switcher {
  position: absolute;
  top: 150px;
  right: 50px;
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

.slider-main-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 24px;
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
  transform: translateY(-8px) scale(1.025);
  border: 2.5px solid #a259e6;
  z-index: 2;
}

.arrow-btn {
  background: #a259e6;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.1);
}

.arrow-btn:disabled {
  background: #e0d6f7;
  color: #b8a1e6;
  cursor: not-allowed;
}


.slide-card {
  /* display: flex !important;
  align-items: center !important; */
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
}

.slide-desc {
  color: #222;
  font-size: 1.08rem;
  margin-bottom: 8px;
  text-align: start;
}



.slide-image {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 16px rgba(102, 26, 255, 0.13);
}



.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  background: #fff;
  border: none;
  transition: transform 0.2s;
  display: block;
}

.slide-image img:hover {
  transform: scale(1.04) rotate(-2deg);
}

.slider-instructions {
  margin-top: 32px;
  background: #fff;
  color: #661aff;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 12px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.1);
  letter-spacing: 0.5px;
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
  transition:
    background 0.2s,
    transform 0.2s;
  outline: none;
  margin: 0 auto;
  display: block;
}

.quiz-btn:hover,
.quiz-btn:focus {
  background: #a259e6;
  transform: scale(1.04);
}

.blink {
  animation: blink-animation 1s steps(2, start) infinite;
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

  .arrow-btn {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
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

  .arrow-btn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .lang-switcher {
    margin-bottom: 8px;
    width: 100%;
    justify-content: center;
  }

  .slider-row {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .slide-card {
    margin: 0;
    width: 100%;
  }
}

.lang-switcher {
  position: fixed;
  right: 48px;
  top: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.9;
  transition:
    opacity 0.2s,
    background 0.2s;
}

.lang-btn.active {
  background: #d1aaff !important;
  color: #222 !important;
  opacity: 1;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static !important;
    flex-direction: row !important;
    justify-content: center !important;
    margin-top: 32px !important;
    right: unset;
    top: unset;
  }
}
</style>

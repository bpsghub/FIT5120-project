<template>
  <div class="learning-slider-container">
    <div class="slider-content">
      <slot name="lang-switcher">
        <LanguageSwitcher v-model="lang" class="lang-switcher" />
      </slot>
      <div class="slider-row">
        <button class="arrow-btn left" @click="prevSlide" :disabled="currentSlide === 0">
          <span>&lt;</span>
        </button>
        <div class="slide-card">
          <h2 class="slide-title">{{ slideTitle }}</h2>
          <p class="slide-desc">{{ slideDesc }}</p>
        </div>
        <button class="arrow-btn right" @click="nextSlide" :disabled="currentSlide === slides.length - 1">
          <span>&gt;</span>
        </button>
      </div>
      <div class="slide-image">
        <img :src="getRandomImage(currentSlide)" alt="Slide Image" />
      </div>
    </div>
    <div class="slider-instructions">{{ instructionText }}</div>
    <button v-if="currentSlide === slides.length - 1" class="quiz-btn blink" @click="$emit('take-quiz')">
      <slot name="quiz-btn">{{ quizBtnText }}</slot>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Papa from 'papaparse'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const props = defineProps({
  csvUrl: { type: String, required: true },
  imageSeedPrefix: { type: String, default: 'slide' },
  lang: { type: String, default: 'en' },
})
const emit = defineEmits(['update:lang', 'take-quiz'])

const lang = computed({
  get: () => props.lang,
  set: (val) => emit('update:lang', val)
})

const slides = ref([])
const currentSlide = ref(0)

function prevSlide() {
  if (currentSlide.value > 0) currentSlide.value--
}
function nextSlide() {
  if (currentSlide.value < slides.value.length - 1) currentSlide.value++
}
function getRandomImage(idx) {
  return `https://picsum.photos/seed/${props.imageSeedPrefix}${idx + 1}/180/180`
}
onMounted(() => {
  fetch(props.csvUrl)
    .then((res) => res.text())
    .then((csv) => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          slides.value = results.data.map((row) => ({
            en: row.en || '',
            cn: row.cn || '',
            vn: row.vn || '',
            id: row.id || '',
            key: row.key || '',
            title_en: row.title_en || row.key || '',
            title_cn: row.title_cn || row.key || '',
            title_vn: row.title_vn || row.key || '',
            title_id: row.title_id || row.key || '',
          }))
        },
      })
    })
})
const slideTitle = computed(() => {
  const slide = slides.value[currentSlide.value]
  if (!slide) return ''
  // Always use title_* if present, else use main text, else fallback to key
  if (lang.value === 'en') return slide.title_en || slide.en || slide.key || ''
  if (lang.value === 'cn') return slide.title_cn || slide.cn || slide.key || ''
  if (lang.value === 'vn') return slide.title_vn || slide.vn || slide.key || ''
  if (lang.value === 'id') return slide.title_id || slide.id || slide.key || ''
  return slide.key || ''
})
const slideDesc = computed(() => {
  return slides.value[currentSlide.value]?.[lang.value] || ''
})
const instructionText = computed(() => {
  if (lang.value === 'en') return 'USE THE ARROWS TO NAVIGATE BETWEEN SLIDES.'
  if (lang.value === 'cn') return '使用箭头在幻灯片之间导航。'
  if (lang.value === 'vn') return 'SỬ DỤNG MŨI TÊN ĐỂ CHUYỂN GIỮA CÁC TRANG.'
  if (lang.value === 'id') return 'GUNAKAN PANAH UNTUK BERPINDAH ANTAR SLIDE.'
  return 'USE THE ARROWS TO NAVIGATE BETWEEN SLIDES.'
})
const quizBtnText = computed(() => {
  if (lang.value === 'en') return 'Take the Quiz'
  if (lang.value === 'cn') return '参加测验'
  if (lang.value === 'vn') return 'Làm bài kiểm tra'
  if (lang.value === 'id') return 'Ikuti Kuis'
  return 'Take the Quiz'
})
</script>

<style scoped>
.learning-slider-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
}

.lang-switcher {
  position: absolute;
  top: 150px;
  right: 50px;
}

.slider-content {
  margin: 40px auto 0 auto;
  width: 100%;
  max-width: 900px;
  min-height: 250px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
}

.slider-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  background: #f8f6ff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(102, 26, 255, 0.08);
  padding: 32px 36px;
  min-width: 260px;
  max-width: 420px;
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
}

.slide-image {
  margin: 24px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(102, 26, 255, 0.1);
  background: #fff;
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

.quiz-btn {
  margin: 32px auto 0 auto;
  display: block;
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
    max-width: 100vw;
    min-width: 0;
    margin: 16px auto 0 auto;
  }

  .slide-card {
    min-width: 160px;
    max-width: 90vw;
    padding: 16px 10px;
    margin: 0 6px;
    font-size: 1rem;
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

  .lang-switcher {
    position: static;
    margin: 0 0 12px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    z-index: 2;
  }

  .slider-row {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .slide-card {
    margin: 0;
    width: 100%;
    max-width: 90vw;
  }
}

@media (max-width: 600px) {
  .slider-content {
    font-size: 0.95rem;
  }

  .slide-card {
    min-width: 100px;
    max-width: 98vw;
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
    max-width: 98vw;
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

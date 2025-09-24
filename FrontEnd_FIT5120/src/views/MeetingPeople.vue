<template>
  <div class="meeting-people-guide">
    <Header />
    <!-- Hero Banner -->
    <header class="hero-banner">
      <div class="hero-gradient"></div>
      <div class="hero-particles">
        <span v-for="n in 18" :key="n" class="particle" :style="particleStyle(n)" />
      </div>
      <div class="hero-content">
        <h1 class="main-title">Meeting New People</h1>
        <h2 class="subtitle">This guide helps you feel confident when meeting new people in Australia.</h2>
      </div>
      <!-- <div class="progress-bar" :style="{ width: progressPercent + '%' }" aria-label="Progress"></div> -->
    </header>

    <!-- Learning section -->
    <div class="content-box">
      <LearningSlider v-model:lang="lang" csv-url="/Learning about Australia/meetingPeople.csv"
        image-seed-prefix="meetingpeople" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import 'swiper/css'
import 'swiper/css/bundle'
import Header from '@/components/Header.vue'
import LearningSlider from '@/components/LearningSlider.vue'

const lang = ref('en')

const slides = ref([])


async function fetchSlides() {
  const res = await fetch('/Learning about Australia/meetingPeople.csv')
  const csv = await res.text()
  const lines = csv.split(/\r?\n/).filter(Boolean)
  const headers = lines[0].split(',')
  slides.value = lines.slice(1).map(line => {
    const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    const obj = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = cols[i]?.replace(/^"|"$/g, '').trim() || ''
    })
    return obj
  })
  await nextTick()
}

onMounted(fetchSlides)

function particleStyle(n) {
  const angle = (n / 18) * 2 * Math.PI
  const radius = 120 + Math.random() * 40
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const size = 12 + Math.random() * 10
  const delay = Math.random() * 2
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(60% + ${y}px)`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;700&display=swap');

.meeting-people-guide {
  font-family: 'Open Sans', Arial, sans-serif;
  background: #E6E6FA;
  min-height: 100vh;
  color: #222;
}

/* Hero Banner */
.hero-banner {
  position: relative;
  width: 100vw;
  min-height: 260px;
  background: linear-gradient(120deg, #E6E6FA 0%, #9370DB 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 32px;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #E6E6FA 0%, #9370DB 100%);
  z-index: 0;
  pointer-events: none;
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(155, 89, 182, 0.18);
  border-radius: 50%;
  box-shadow: 0 2px 8px #4B0082;
  animation: float 4s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }

  100% {
    transform: translateY(-24px) scale(1.1);
    opacity: 1;
  }
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
}

.main-title {
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 36px;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 4px 16px rgba(75, 0, 130, 0.25);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 24px;
  font-style: italic;
  color: #f8f8ff;
  font-weight: 400;
  margin-bottom: 0;
}

/* Carousel Section */
.carousel-section {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 0 64px 0;
  z-index: 10;
  min-height: 420px;
}

.meeting-carousel {
  width: 100%;
  min-height: 340px;
}

.slide-card {
  background: #F6F4FF;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(75, 0, 130, 0.10);
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 340px;
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.slide-grid {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: stretch;
}

.slide-text {
  flex: 3 1 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
}

.slide-headline {
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 32px;
  color: #4B0082;
  font-weight: 700;
  margin-bottom: 12px;
}

.slide-desc {
  font-size: 16px;
  color: #222;
  margin: 0 0 16px 0;
}

.slide-bullets {
  font-size: 16px;
  color: #222;
  margin: 0 0 16px 0;
  padding-left: 20px;
  list-style: disc inside;
}

.slide-tip {
  background: #E6E6FA;
  color: #4B0082;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(75, 0, 130, 0.08);
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.slide-tip:focus,
.slide-tip:hover {
  background: #FFD700;
  color: #4B0082;
}

.tip-icon {
  font-size: 18px;
}

.slide-image-container {
  flex: 2 1 40%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
}

.slide-image {
  width: 100%;
  max-width: 260px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(75, 0, 130, 0.13);
  filter: brightness(0.95) saturate(1.1);
  opacity: 0;
  animation: fadeIn 1.2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}


/* Carousel Arrows */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #4B0082;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 12px rgba(75, 0, 130, 0.13);
  transition: transform 0.2s, background 0.2s;
}

.carousel-arrow.left {
  left: -32px;
}

.carousel-arrow.right {
  right: -32px;
}

.carousel-arrow:hover,
.carousel-arrow:focus {
  background: #FFD700;
  color: #4B0082;
  transform: scale(1.1);
}

.chevron {
  font-weight: bold;
  font-size: 2.2rem;
  line-height: 1;
}

/* Pagination Dots */
.swiper-pagination {
  position: absolute;
  bottom: -32px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}

.swiper-pagination-bullet {
  width: 14px;
  height: 14px;
  background: #4B0082;
  border-radius: 50%;
  opacity: 0.7;
  transition: background 0.2s, transform 0.2s;
  border: 2px solid #E6E6FA;
}

.swiper-pagination-bullet-active {
  background: #FFD700;
  border-color: #4B0082;
  transform: scale(1.2);
  opacity: 1;
}

/* Sticky Footer Instruction */
.sticky-instruction {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #008080;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 14px 0;
  border-radius: 32px 32px 0 0;
  margin-top: 32px;
  box-shadow: 0 -2px 12px rgba(0, 128, 128, 0.08);
  animation: pulse 2s infinite;
  z-index: 100;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 -2px 12px rgba(0, 128, 128, 0.08);
  }

  50% {
    box-shadow: 0 -2px 24px #FFD700;
  }
}

/* Responsive Design */
@media (max-width: 900px) {
  .carousel-section {
    padding: 16px 0 48px 0;
  }

  .slide-card {
    padding: 16px;
  }

  .slide-grid {
    flex-direction: column;
    gap: 16px;
  }

  .slide-image-container {
    min-width: 120px;
  }

  .carousel-arrow.left {
    left: -12px;
  }

  .carousel-arrow.right {
    right: -12px;
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 26px;
  }

  .subtitle {
    font-size: 16px;
  }

  .carousel-section {
    padding: 8px 0 32px 0;
  }

  .slide-card {
    padding: 8px;
  }

  .slide-headline {
    font-size: 22px;
  }

  .slide-bullets {
    font-size: 14px;
  }

  .slide-image {
    max-width: 98vw;
  }

  .sticky-instruction {
    font-size: 0.95rem;
    padding: 10px 0;
  }
}
</style>

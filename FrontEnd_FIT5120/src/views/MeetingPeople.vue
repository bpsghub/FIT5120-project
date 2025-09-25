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
        <h1 class="main-title">{{ $t('meetingpeople_title') }}</h1>
        <h2 class="subtitle">{{ $t('meetingpeople_subtitle') }}</h2>
      </div>
    </header>
    <!-- Learning section -->
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/meetingPeople.csv"
        image-seed-prefix="meetingpeople" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import LearningSlider from '@/components/LearningSlider.vue'

const { locale } = useI18n()

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
</style>

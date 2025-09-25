<template>
  <div class="eating-out-container">
    <Header />
    <LearningBanner :title="$t('socialnorms.eatingout.title')" :subtitle="$t('socialnorms.eatingout.subtitle')"
      :particle-count="18" />
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/dining_etiquette.csv"
        image-seed-prefix="eatingout" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import LearningBanner from '@/components/LearningBanner.vue'
import LearningSlider from '@/components/LearningSlider.vue'

const { locale } = useI18n()
function takeQuiz() {
  alert('Quiz coming soon!')
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #222;
  padding: 24px 0 8px 0;
  margin-bottom: 0px;
}

.logo {
  font-family: 'Brush Script MT', cursive;
  font-size: 2.5rem;
  margin-left: 48px;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 32px;
  margin-right: 48px;
}

.nav a {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a.router-link-exact-active {
  color: #a259e6;
}

.eating-out-container {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.banner {
  background: #97b34a;
  color: #222;
  padding: 48px 0 32px 0;
  text-align: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
  border-top: 0px solid #fff;
  border-bottom: 8px dashed #fff;
}

.banner h1 {
  font-size: 2.3rem;
  font-family: 'Quicksand', 'Arial', sans-serif;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.banner p {
  font-size: 1.2rem;
  margin: 0 auto;
  max-width: 900px;
}

.content-box {
  margin: 40px auto 0 auto;
  width: 100%;
  max-width: 900px;
  min-height: 250px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
}

.placeholder {
  font-size: 2rem;
  color: #222;
  text-align: center;
}

.lang-switcher {
  position: fixed;
  right: 48px;
  top: calc(300px + 200px);
  /* header + banner height estimate */
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #a259e6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.7;
  cursor: pointer;
  transition:
    opacity 0.2s,
    background 0.2s;
}

.lang-btn.active {
  background: #d1aaff;
  color: #222;
  opacity: 1;
}

.quiz-btn-row {
  display: flex;
  justify-content: flex-end;
  margin: 32px 60px 0 0;
}

.quiz-btn {
  background: #661aff;
  color: #fff;
  font-size: 1.5rem;
  border: none;
  border-radius: 12px;
  padding: 12px 32px 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.1);
  transition: background 0.2s;
}

.quiz-btn:hover {
  background: #a259e6;
}

.play-icon {
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>

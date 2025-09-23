<template>
  <div class="myki-learning-container container">
    <Header />
    <div class="banner">
      <h1>Learning About Myki Card</h1>
      <p>
        This guide helps you understand how to use the Myki card for public transport in Australia, with step-by-step
        instructions in multiple languages.
      </p>
    </div>
    <div class="content-box">
      <LearningSlider v-model:lang="lang" csv-url="/Learning about Australia/epic4_myki_keys_final.csv"
        image-seed-prefix="mykilearning" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import LearningSlider from '@/components/LearningSlider.vue'

const lang = ref('en')
function takeQuiz() {
  alert('Quiz coming soon!')
}
</script>

<style scoped>
.myki-learning-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.banner {
  background: #e2c75c;
  color: #222;
  padding: 48px 0 32px 0;
  text-align: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
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

.lang-switcher {
  position: fixed;
  right: 48px;
  top: calc(300px + 200px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
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

<template>
  <div class="public-transport-container container">
    <Header />
    <div class="banner">
      <h1>Public Transportation</h1>
      <p>Understand how to catch public transport, read timetables, and use your travel card.</p>
    </div>
    <div class="content-box">
      <LearningSlider
        v-model:lang="lang"
        csv-url="/Learning about Australia/publictransport.csv"
        image-seed-prefix="publictransport"
        @take-quiz="takeQuiz"
      />
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

.public-transport-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.banner {
  background: #b23b3b;
  color: #fff;
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
</style>

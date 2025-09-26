<template>
  <div class="medical-attention-container ">
    <Header />
    <LearningBanner :title="$t('navigate_your_life.cards.grocceriesshopping.title')"
      :subtitle="$t('navigate_your_life.cards.grocceriesshopping.subtitle')" :particle-count="18" />

    <div class="content-box">
      <LearningSlider :lang="locale" v-model="locale" csv-url="/Learning about Australia/epic4_doctor_etiquettes.csv"
        image-seed-prefix="medical" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import LearningSlider from '@/components/LearningSlider.vue'
import { useI18n } from 'vue-i18n'
import LearningBanner from '@/components/LearningBanner.vue'

const { locale } = useI18n()
function takeQuiz() {
  alert('Quiz coming soon!')
}
</script>

<style scoped>
.medical-attention-container {
  min-height: 100vh;
  background: #E6E6FA;
  display: flex;
  flex-direction: column;
}
</style>

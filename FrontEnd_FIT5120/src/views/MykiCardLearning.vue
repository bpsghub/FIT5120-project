<template>
  <div class="bus-learning-container">
    <Header />
    <LearningBanner :title="$t('myki_learning.title')" :subtitle="$t('myki_learning.subtitle')" :particle-count="18" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_myki_keys_final.csv"
        image-seed-prefix="mykilearning" @take-quiz="takeQuiz" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import LearningSlider from '@/components/LearningSlider.vue';
import LearningBanner from '@/components/LearningBanner.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n()
function takeQuiz() {
  alert('Quiz coming soon!');
}
</script>

<style scoped>
.bus-learning-container {
  min-height: 100vh;
  background: #E6E6FA;
  display: flex;
  flex-direction: column;
}
</style>

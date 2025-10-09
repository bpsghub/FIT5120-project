<template>
  <div class="bus-learning-container">
    <LearningBanner :title="$t('bus_learning.title')" :subtitle="$t('bus_learning.subtitle')" :particle-count="18" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_bus_keys_final.csv"
        image-seed-prefix="buslearning" />
    </div>
  </div>
</template>

<script setup>
import LearningSlider from '@/components/LearningSlider.vue';
import LearningBanner from '@/components/LearningBanner.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n()

</script>

<style scoped>
.bus-learning-container {
  min-height: 100vh;
  background: #E6E6FA;
  display: flex;
  flex-direction: column;
}
</style>

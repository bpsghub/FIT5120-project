<template>
  <div class="bus-learning-container">
    <BannerBubble :title="$t('train_learning.title')" :subtitle="$t('train_learning.subtitle')"
      :bubbleTexts="['Train', 'Station', 'Platform', 'Track', 'Ticket', 'Metro', 'Express', 'Local', 'Door', 'Fast', 'Schedule', 'Depart']"
      :customIcon="trainIcon" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_train_keys_final.csv"
        image-seed-prefix="trainlearning" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import LearningSlider from '@/components/LearningSlider.vue';
import BannerBubble from '@/components/BannerBubble.vue';
import { useI18n } from 'vue-i18n';

// Train icon
const trainIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z' })
])

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

<template>
  <div class="bus-learning-container">
    <BannerBubble :title="$t('myki_learning.title')" :subtitle="$t('myki_learning.subtitle')"
      :bubbleTexts="['Myki', 'Card', 'Top up', 'Touch on', 'Touch off', 'Balance', 'Money', 'Travel', 'Pay', 'Scan', 'Reader', 'Fare']"
      :customIcon="cardIcon" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_myki_keys_final.csv"
        image-seed-prefix="mykilearning" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import LearningSlider from '@/components/LearningSlider.vue';
import BannerBubble from '@/components/BannerBubble.vue';
import { useI18n } from 'vue-i18n';

// Myki card icon
const cardIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' })
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

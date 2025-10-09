<template>
  <div class="bus-learning-container">
    <BannerBubble :title="$t('tram_learning.title')" :subtitle="$t('tram_learning.subtitle')"
      :bubbleTexts="['Tram', 'Stop', 'Ring', 'City', 'Free zone', 'Tracks', 'Ding ding', 'Green', 'Rails', 'Touch on', 'Zone', 'Melbourne']"
      :customIcon="tramIcon" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_tram_keys_final.csv"
        image-seed-prefix="tramlearning" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import LearningSlider from '@/components/LearningSlider.vue';
import BannerBubble from '@/components/BannerBubble.vue';
import { useI18n } from 'vue-i18n';

// Tram icon
const tramIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45.98 2.66 2.32 3.04L6 21.5v.5h2.23l2-2h3.55l2 2H18v-.5l-1.32-1.52c1.34-.38 2.32-1.59 2.32-3.04zM7.5 19c-.83 0-1.5-.67-1.5-1.5S6.67 16 7.5 16s1.5.67 1.5 1.5S8.33 19 7.5 19zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V8h12v5z' })
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

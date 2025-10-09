<template>
  <div class="bus-learning-container">
    <BannerBubble :title="$t('bus_learning.title')" :subtitle="$t('bus_learning.subtitle')"
      :bubbleTexts="['Bus', 'Stop', 'Route', 'Tap on', 'Tap off', 'Bell', 'Driver', 'Seat', 'Window', 'Next stop', 'Wait', 'Ride']"
      :customIcon="busIcon" />
    <div class="content-box">
      <LearningSlider v-model="locale" :lang="locale" csv-url="/Learning about Australia/epic4_bus_keys_final.csv"
        image-seed-prefix="buslearning" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import LearningSlider from '@/components/LearningSlider.vue';
import BannerBubble from '@/components/BannerBubble.vue';
import { useI18n } from 'vue-i18n';

// Bus icon
const busIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
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
